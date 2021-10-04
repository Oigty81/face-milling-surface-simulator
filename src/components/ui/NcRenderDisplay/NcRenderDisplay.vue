<template>
        <canvas
            v-bind:id="canvasId"
            class="nc-render-display-canvas"
            @wheel="onWheel($event)"
        ></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import moment from 'moment';
import { saveAs } from 'file-saver';

import { Point2d } from '../../../types/Point2d';
import { Size2d } from '../../../types/Size2d';
import { MillPosition } from '../../../types/MillPosition';
import { DefaultCallback } from '../../../types/DefaultCallback';
import { NcRenderParameter } from '../../../types/NcRenderParameter';
import { ColorMessage } from '../../../types/ColorMessage';

import { uuidv4 } from '../../../utilities/createUUID';

import { RenderService } from './RenderService';

@Component({})
export default class NcRenderDisplay extends Vue {
    private canvasId!: string;
    private _renderService!: RenderService;
    private _runtimeInitialized!: boolean;
    private _normalizedZoom!: number;
    private zoomFactor!: number;
    private _imageSize!: Size2d;
    
    constructor() {
        super();
        
        this.canvasId = 'render-display-canvas-'.concat(uuidv4()); // make unique ids for main canvas
        this._runtimeInitialized = false;
        this._normalizedZoom = 1.0;
        this.zoomFactor = 1.0;
        this._imageSize = new Size2d(100, 80);
    }

    @Prop({
        default: function () {
            return new Size2d(100, 100);
        }
    })
    viewportSize!: Size2d;

    @Watch('viewportSize', { immediate: true })
        // eslint-disable-next-line
        onViewportSizeChanged(value: Size2d, oldValue: Size2d) {
            this.setViewportSize();
        }

    @Prop({
        default: function () {
            return false;
        }
    })
    zoomPositiveTrigger!: boolean;

    @Watch('zoomPositiveTrigger')
        // eslint-disable-next-line
        onZoomPositiveTriggerChanged(value: boolean, oldValue: boolean) {
            if(value === true) {
                if(this.zoomFactor < 4.9) {
                    this.zoomFactor += 0.2;
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendZoomPositive(new ColorMessage('zoom positiv: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x'), 0));
                } else {
                    this.sendZoomPositive(new ColorMessage('zoom positiv: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x  that is the maximum zoom value!'), 2));
                }
            }
        }

    @Prop({
        default: function () {
            return false;
        }
    })
    zoomNegativeTrigger!: boolean;

    @Watch('zoomNegativeTrigger')
        // eslint-disable-next-line
        onZoomNegativeTriggerChanged(value: boolean, oldValue: boolean) {
            if(value === true) {
                if(this.zoomFactor > 1.0) {
                    this.zoomFactor -= 0.2;
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendZoomNegative(new ColorMessage('zoom negative: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x'), 0));
                } else {
                    this.sendZoomNegative(new ColorMessage('zoom negative: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x  that is the minimum zoom value!'), 2));
                }
            }
        }

    @Prop({
        default: function () {
            return false;
        }
    })
    zoomResetTrigger!: boolean;

    @Watch('zoomResetTrigger')
        // eslint-disable-next-line
        onZoomResetTriggerChanged(value: boolean, oldValue: boolean) {
            if(value === true) {
                this.zoomFactor = 1.0;
                this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                this.sendZoomReset(new ColorMessage('zoom reset: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x'), 0));
            }
        }

    @Prop({
        default: function () {
            return new NcRenderParameter(
                '', 10, '#ff0000', '#0000ff', '#7777bb', 1, '#c0c0c0', new Point2d(0, 0), ''
            );
        }
    })
    ncRenderParameter!: NcRenderParameter;
    
    @Watch('ncRenderParameter', { immediate: false, deep: true })
        // eslint-disable-next-line
        onNcRenderParameter(value: NcRenderParameter, oldValue:NcRenderParameter) {
            this.createNewRenderDisplay(value);
        }

    @Prop({
        default: function () {
            return true;
        }
    })
    isEnabledMillTool!: boolean;

    @Prop({
        default: function () {
            return 4;
        }
    })
    renderLineOption!: number;

    @Prop({
        default: function () {
            return new MillPosition(new Point2d(100, 100), true);
        }
    })
    currentMillPosition!: MillPosition;

    @Watch('currentMillPosition', { immediate: false })
        // eslint-disable-next-line
        onCurrentMillPositionChanged(value: MillPosition, oldValue: MillPosition) {
            if(this._runtimeInitialized === true) {
                this._renderService.DrawRoughnessToRenderObject(this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this.renderLineOption);
                if(value.RefreshCanvas === true) {
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                }
            }
        }
    
    @Prop({
        default: function () {
            return false;
        }
    })
    roughnessResetTrigger!: boolean;

    @Watch('roughnessResetTrigger', { immediate: false })
        // eslint-disable-next-line
        onRoughnessResetTriggerChanged(value: boolean, oldValue: boolean) {
            if(this._runtimeInitialized === true) {
                if(value === true) {
                    this._renderService.ResetRenderObject();
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendRoughnessReset();
                }
            }
        }

     @Prop({
        default: function () {
            return false;
        }
    })
    downloadRoughnessTrackImageTrigger!: boolean;

    @Watch('downloadRoughnessTrackImageTrigger', { immediate: false })
        // eslint-disable-next-line
        onDownloadRoughnessTrackImageTriggerChanged(value: boolean, oldValue: boolean) {
            if(this._runtimeInitialized === true) {
                if(value === true) {
                    this._renderService.SetRenderObject(false, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.SaveCanvasToPng();
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendDownloadRoughnessImage();
                }
            }
        }
    
    // ---------------------------------------------------------
        
    @Emit()
    sendZoomPositive(msg: ColorMessage) {
        return msg;
    }

    @Emit()
    sendZoomNegative(msg: ColorMessage) {
        return msg;
    }

    @Emit()
    sendZoomReset(msg: ColorMessage) {
        return msg;
    }

    @Emit()
    sendRoughnessReset() {
        return 0;
    }

    @Emit()
    sendDownloadRoughnessImage() {
        return 0;
    }

    @Emit()
    sendMessage(msg: ColorMessage) {
        return msg;
    }
    
    // ---------------------------------------------------------
    
    created() {
        this._renderService = new RenderService(this.canvasId, () => {
            this._runtimeInitialized = true;
            this.createNewRenderDisplay(this.ncRenderParameter);
            this.setViewportSize();
        });
    }

    destroyed() {
        this._renderService.ReleaseMemory();
    }

    // ---------------------------------------------------------

    onWheel(e) {
        if(this._runtimeInitialized === true) {
            if(e.deltaY > 0) {
                if(this.zoomFactor > 1.0) {
                    this.zoomFactor -= 0.2;
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendZoomNegative(new ColorMessage('zoom negative: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x'), 0));
                } else {
                    this.sendZoomNegative(new ColorMessage('zoom negative: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x  that is the minimum zoom value!'), 2));
                }
            } else {
                if(this.zoomFactor < 4.9) {
                    this.zoomFactor += 0.2;
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                    this.sendZoomPositive(new ColorMessage('zoom positiv: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x'), 0));
                } else {
                    this.sendZoomPositive(new ColorMessage('zoom positiv: '.concat(this.zoomFactor.toFixed(1).toString()).concat('x  that is the maximum zoom value!'), 2));
                }
            }
        }
    }
    
    setViewportSize() {
        const canvas1 = document.getElementById(this.canvasId) as HTMLCanvasElement;
        if(canvas1 !== null) {
            if(this._runtimeInitialized === true && this._imageSize !== undefined) {
                this.CalculateNormalizedZoom();
                this._renderService.SetRenderObject(
                    this.isEnabledMillTool,
                    this.currentMillPosition.Position.X,
                    this.currentMillPosition.Position.Y,
                    this._normalizedZoom,
                    this.zoomFactor,
                );
            }
        }
    }

    createNewRenderDisplay(ncRenderParameter: NcRenderParameter) {
        if(this._runtimeInitialized === true && ncRenderParameter !== null) {
            this._renderService.CreateNewRenderObject(ncRenderParameter, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendMessage(new ColorMessage(cb.ErrorText, 2));
                } else {
                    this._imageSize = new Size2d(cb.Value1, cb.Value2);
                    this.CalculateNormalizedZoom();
                    this._renderService.SetRenderObject(this.isEnabledMillTool, this.currentMillPosition.Position.X, this.currentMillPosition.Position.Y, this._normalizedZoom, this.zoomFactor);
                }
            });
        }
    }
    
    CalculateNormalizedZoom() : void {
        const relationWidth = this.viewportSize.Width / this._imageSize.Width;
        const relationHeight = this.viewportSize.Height / this._imageSize.Height;
        const normalizedZoom = (relationWidth <= relationHeight) ? relationWidth : relationHeight;
        this._normalizedZoom = normalizedZoom;
    }

    SaveCanvasToPng() {
        const canvas1 = document.getElementById(this.canvasId) as HTMLCanvasElement;

        canvas1.toBlob(function(blob) {
            saveAs(blob, "roughnessTrackImg_".concat(moment().format('YYYYMMDD_HHmmss_SSS')).concat(".png"));
        });
    }
}
</script>
