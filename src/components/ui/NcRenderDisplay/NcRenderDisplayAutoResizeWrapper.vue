<template>
    <div
        ref="NcRenderDisplayWrapperEl"
        class="nc-render-display-wrapper-container"
        @mousemove="receiveMouseMove($event)"
    >
        <simplebar
            ref="NcRenderDisplayScrollbarEl"
            :style="{
                width: ''.concat(currentViewportSize.Width).concat('px'),
                height: ''.concat(currentViewportSize.Height).concat('px')
            }"
            data-simplebar-auto-hide="false"
        >
            <NcRenderDisplay
                :viewportSize="currentViewportSize"
                :zoomPositiveTrigger="zoomPositiveTrigger"
                :zoomNegativeTrigger="zoomNegativeTrigger"
                :zoomResetTrigger="zoomResetTrigger"
                :ncRenderParameter="ncRenderParameter"
                :isEnabledMillTool="true"
                :renderLineOption="renderLineOption"
                :currentMillPosition="currentMillPosition"
                :roughnessResetTrigger="roughnessResetTrigger"
                :downloadRoughnessTrackImageTrigger="downloadRoughnessTrackImageTrigger"
                @send-zoom-positive="sendZoomPositive($event)"
                @send-zoom-negative="sendZoomNegative($event)"
                @send-zoom-reset="sendZoomReset($event)"
                @send-roughness-reset="sendRoughnessReset()"
                @send-download-roughness-image="sendDownloadRoughnessImage()"
                @send-message="sendMessage($event)"
            ></NcRenderDisplay>
        </simplebar>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import simplebar from 'simplebar-vue';

import { Point2d } from '../../../types/Point2d';
import { Size2d } from '../../../types/Size2d';
import { MillPosition } from '../../../types/MillPosition';
import { NcRenderParameter } from '../../../types/NcRenderParameter';
import { ColorMessage } from '../../../types/ColorMessage';

import NcRenderDisplay from './NcRenderDisplay.vue';

@Component({
    components: { simplebar, NcRenderDisplay }
})
export default class NcRenderDisplayAutoResizeWrapper extends Vue {
    private currentViewportSize!: Size2d;

    constructor() {
        super();
        
        this.currentViewportSize = new Size2d(600, 600);
    }
    
    @Prop({
        default: function () {
            return 1.2;
        }
    })
    viewportRelation!: number;

    @Watch('viewportRelation')
        // eslint-disable-next-line
        onViewportRelationChanged(value: Size2d, oldValue: Size2d) {
            this.handleResize();
        }
    
    @Prop({
        default: function () {
            return false;
        }
    })
    zoomPositiveTrigger!: boolean;

    @Prop({
        default: function () {
            return false;
        }
    })
    zoomNegativeTrigger!: boolean;

    @Prop({
        default: function () {
            return false;
        }
    })
    zoomResetTrigger!: boolean;
   
    @Prop({
        default: function () {
            return new NcRenderParameter(
                '', 10, '#ff0000', '#0000ff', '#7777bb', 1, '#c0c0c0', new Point2d(0, 0), ''
            );
        }
    })
    ncRenderParameter!: NcRenderParameter;

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
            return new Point2d(100, 100);
        }
    })
    currentMillPosition!: MillPosition;

    @Prop({
        default: function () {
            return false;
        }
    })
    roughnessResetTrigger!: boolean;
    
     @Prop({
        default: function () {
            return false;
        }
    })
    downloadRoughnessTrackImageTrigger!: boolean;
        
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
    sendMessage(e) {
        return e;
    }

    // ---------------------------------------------------------

    mounted() {
        window.addEventListener('resize', this.handleResize);
         this.handleResize();
    }

    // ---------------------------------------------------------

    handleResize() {
        if(this.$refs.NcRenderDisplayWrapperEl !== undefined) {
            const w: number = (this.$refs.NcRenderDisplayWrapperEl as Vue & { clientWidth: number }).clientWidth;
            this.currentViewportSize = new Size2d(w, w / this.viewportRelation);
        }
    }

    receiveMouseMove(e: MouseEvent) {
        if(this.$refs.NcRenderDisplayScrollbarEl !== undefined) {
            const scrollTriggerThreshold = 32;
            const scrollTriggerStep = 64;
            
            //TODO: fix this later, today getScrollElement is not supported by typescript (2021-05-03)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            const scrollElement = this.$refs.NcRenderDisplayScrollbarEl.SimpleBar.getScrollElement();
            let currentScrollLeft = scrollElement.scrollLeft;
            let currentScrollTop = scrollElement.scrollTop;

            // check scroll X
            if((e.offsetX - currentScrollLeft) < scrollTriggerThreshold || e.offsetX > (this.currentViewportSize.Width - scrollTriggerThreshold)) {
                if((e.offsetX - currentScrollLeft) < scrollTriggerThreshold) {
                    if(currentScrollLeft > scrollTriggerStep) {
                        currentScrollLeft -= scrollTriggerStep;
                    } else {
                        currentScrollLeft = 0;
                    }
                } else {
                    if(currentScrollLeft < (scrollElement.scrollWidth - scrollTriggerStep)) {
                        currentScrollLeft += scrollTriggerStep;
                    } else {
                        currentScrollLeft = scrollElement.scrollWidth;
                    }
                }
            }

            // check scroll Y
            if((e.offsetY - currentScrollTop) < scrollTriggerThreshold || e.offsetY > (this.currentViewportSize.Height - scrollTriggerThreshold)) {
                if((e.offsetY - currentScrollTop) < scrollTriggerThreshold) {
                    if(currentScrollTop > scrollTriggerStep) {
                        currentScrollTop -= scrollTriggerStep;
                    } else {
                        currentScrollTop = 0;
                    }
                } else {
                    if(currentScrollTop < (scrollElement.scrollHeight - scrollTriggerStep)) {
                        currentScrollTop += scrollTriggerStep;
                    } else {
                        currentScrollTop = scrollElement.scrollWidth;
                    }
                }
            }

            scrollElement.scrollTo({ left: currentScrollLeft, top: currentScrollTop, behavior: "smooth" });
        }
    }
}
</script>
