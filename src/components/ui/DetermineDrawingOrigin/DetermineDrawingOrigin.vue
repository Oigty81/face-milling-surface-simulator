<template>
    <canvas
        v-bind:id="canvasId"
        class="determine-drawing-origin-canvas"
        @click="receiveCanvasMouseClick($event)"
        @mousemove="receiveCanvasMouseMove($event)"
    ></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';

import { Point2d } from '../../../types/Point2d';
import { Size2d } from '../../../types/Size2d';
import { CanvasMouseEventInformation } from '../../../types/CanvasMouseEventInformation';
import { DefaultCallback } from '../../../types/DefaultCallback';

import { uuidv4 } from '../../../utilities/createUUID';

@Component({})
export default class DetermineDrawingOrigin extends Vue {
    private canvasId!: string;
    private currentCanvasSize!: Size2d;
    
    constructor() {
        super();
        
        this.canvasId = 'drawing-origin-canvas-'.concat(uuidv4()); // make unique ids for main canvas
        this.currentCanvasSize = new Size2d(32, 32);
    }

    @Prop({
        default: function () {
            return '';
        }
    })
    imageData!: string;

    @Watch('imageData', { immediate: false })
        // eslint-disable-next-line
        onImageDataChanged(value: string, oldValue: string) {
            this.setImageToCanvas(value, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                }
            });
        }

    @Prop({
        default: function () {
            return new Point2d(0, 0);
        }
    })
    originPosition!: Point2d;

    @Watch('originPosition', { immediate: false })
        // eslint-disable-next-line
        onOriginPositionChanged(value: Point2d, oldValue: Point2d) {
            this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                }
            });
        }

    @Prop({
        default: function () {
            return false;
        }
    })
    originVisible!: boolean;

    @Watch('originVisible', { immediate: false })
        // eslint-disable-next-line
        onOriginVisibleChanged(value: boolean, oldValue: boolean) {
            this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                }
            });
        }

    @Prop({
        default: function () {
            return new Image(64, 64);
        }
    })
    workpieceOriginImage!: HTMLImageElement;
    
    // ---------------------------------------------------------
    
    @Emit()
    sendClickPosition(position: Point2d) {
        return position;
    }

    @Emit()
    sendMouseMove(canvasMouseEventInformation: CanvasMouseEventInformation) {
        return canvasMouseEventInformation;
    }

    @Emit()
    sendError(text: string) {
        return text;
    }

    // ---------------------------------------------------------

    mounted() {
        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if(ctx !== null) {
            ctx.canvas.width = 0;
            ctx.canvas.height = 0;
        }
    }

    // ---------------------------------------------------------
    
    setImageToCanvas(imageData: string, cbLoaded: (cb: DefaultCallback) => void) {
        const canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        
        if(imageData === '' && ctx !== null) {
           ctx.canvas.width = 0;
           ctx.canvas.height = 0;
        }
        
        const img = new Image();
        img.src = imageData;
        img.onload = () => {
            if((img.width > 2048) || (img.height > 2048)) {
                cbLoaded(new DefaultCallback(1, 'in DetermineDrawingOrigin: source image to large! (' + img.width + 'x' + img.height + ')', 0, 0));
            } else {
                if(ctx !== null) {
                    ctx.canvas.width = img.width;
                    ctx.canvas.height = img.height;
                    
                    this.currentCanvasSize = new Size2d(img.width, img.height);
                    
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    
                    if(this.originVisible === true) {
                        ctx.drawImage(this.workpieceOriginImage, this.originPosition.X - 32, this.originPosition.Y - 32);
                    }

                    cbLoaded(new DefaultCallback(0, '', img.width, img.height));
                } else {
                    cbLoaded(new DefaultCallback(2, 'in DetermineDrawingOrigin: can not draw image', 0, 0));
                }
            }
        };
    }

    receiveCanvasMouseClick(e: MouseEvent) {
        const canvas1 = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const rect = canvas1.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.sendClickPosition(new Point2d(x, y));
    }

    receiveCanvasMouseMove(e: MouseEvent) {
        const canvas1 = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const rect = canvas1.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.sendMouseMove(new CanvasMouseEventInformation(new Point2d(x, y), this.currentCanvasSize));
    }
}
</script>
