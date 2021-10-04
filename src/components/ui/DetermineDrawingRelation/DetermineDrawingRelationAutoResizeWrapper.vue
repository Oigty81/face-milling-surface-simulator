<template>
    <div
        ref="DetermineDrawingRelationWrapperEl"
        class="determine-drawing-relation-wrapper-container"
        @mousemove="receiveMouseMove($event)"
    >
        <simplebar
            ref="DetermineDrawingRelationScrollbarEl"
            :style="{
                width: ''.concat(currentViewportSize.Width).concat('px'),
                height: ''.concat(currentViewportSize.Height).concat('px')
            }"
            data-simplebar-auto-hide="false"
        >
            <DetermineDrawingRelation
                :imageData="imageData"
                :crosshairImage="crosshairImage"
                :drawingResetTrigger="drawingResetTriggerValue"
                @send-click-drawing-length="sendClickDrawingLength($event)"
                @send-mouse-move="receiveMouseMoveCanvas($event)"
                @send-drawing-reset="receiveDrawingReset()"
                @send-error="sendError($event)"
            ></DetermineDrawingRelation>
        </simplebar>
        <relation-tool-tip
            :toolTipPosition="toolTipPosition"
            :toolTipVisible="toolTipVisible"
            :displayPositionStart="toolTipDisplayPositionStart"
            :displayPositionEnd="toolTipDisplayPositionEnd"
            :displayLength="toolTipDisplayLength"
            :displayPositionEndVisible="toolTipDisplayPositionEndVisible"
        ></relation-tool-tip>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import simplebar from 'simplebar-vue';

import { Point2d } from '../../../types/Point2d';
import { Size2d } from '../../../types/Size2d';
import { CanvasMouseEventInformationExtended } from '../../../types/CanvasMouseEventInformationExtended';

import DetermineDrawingRelation from './DetermineDrawingRelation.vue';
import RelationToolTip from './RelationToolTip.vue';

@Component({
    components: { simplebar, DetermineDrawingRelation, RelationToolTip }
})
export default class DetermineDrawingRelationAutoResizeWrapper extends Vue {
    private currentViewportSize!: Size2d;
    private toolTipPosition!: Point2d;
    private toolTipVisible!: boolean;

    private toolTipDisplayPositionStart!: Point2d;
    private toolTipDisplayPositionEnd!: Point2d;
    private toolTipDisplayLength!: number;
    private toolTipDisplayPositionEndVisible!: boolean;
    
    private timerId!: number;
    private toolTipVisibleTimeout!: number;

    private drawingResetTriggerValue!: boolean;

    constructor() {
        super();
        
        this.currentViewportSize = new Size2d(600, 600);
        this.toolTipPosition = new Point2d(0, 0);
        this.toolTipVisible = false;

        this.toolTipDisplayPositionStart = new Point2d(0, 0);
        this.toolTipDisplayPositionEnd = new Point2d(0, 0);
        this.toolTipDisplayLength = 0;
        this.toolTipDisplayPositionEndVisible = false;

        this.timerId = 0;
        this.toolTipVisibleTimeout = 0;

        this.drawingResetTriggerValue = false;
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
            return '';
        }
    })
    imageData!: string;

    @Prop({
        default: function () {
            return new Image(32, 32);
        }
    })
    crosshairImage!: HTMLImageElement;
    
    // ---------------------------------------------------------
    
    @Emit()
    sendClickDrawingLength(e) {
        return e;
    }

    @Emit()
    sendError(e) {
        return e;
    }

    // ---------------------------------------------------------

    mounted() {
        window.addEventListener('resize', this.handleResize);
         this.handleResize();

         this.timerId = setInterval(() => {
            this.toolTipVisibleTimeout--;
            if(this.toolTipVisibleTimeout === 0) {
                this.toolTipVisible = false;
                this.drawingResetTriggerValue = true;
            }
        }, 100);
    }

    destroyed() {
        clearInterval(this.timerId);
    }

    // ---------------------------------------------------------

    handleResize() {
        if(this.$refs.DetermineDrawingRelationWrapperEl !== undefined) {
            const w: number = (this.$refs.DetermineDrawingRelationWrapperEl as Vue & { clientWidth: number }).clientWidth;
            this.currentViewportSize = new Size2d(w, w / this.viewportRelation);
        }
    }
    
    receiveMouseMove(e: MouseEvent) {
        if(this.$refs.DetermineDrawingRelationScrollbarEl !== undefined) {
            const scrollTriggerThreshold = 64;
            const scrollTriggerStep = 96;
            
            //TODO: fix this later, today getScrollElement is not supported by typescript (2021-05-03)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            const scrollElement = this.$refs.DetermineDrawingRelationScrollbarEl.SimpleBar.getScrollElement();
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

    receiveMouseMoveCanvas(e: CanvasMouseEventInformationExtended) {
        if(this.$refs.DetermineDrawingRelationScrollbarEl !== undefined) {
            const viewportBoundingThreshold = 8;

            //TODO: fix this later, today getScrollElement is not supported by typescript (2021-05-03)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            const scrollElement = this.$refs.DetermineDrawingRelationScrollbarEl.SimpleBar.getScrollElement();
            const currentViewportX = e.CurrentPosition.X - scrollElement.scrollLeft;
            const currentViewportY = e.CurrentPosition.Y - scrollElement.scrollTop;

            if(
                (e.CurrentPosition.X > viewportBoundingThreshold) &&
                (e.CurrentPosition.Y > viewportBoundingThreshold) &&
                (e.CurrentPosition.X < e.CurrentSize.Width - viewportBoundingThreshold) &&
                (e.CurrentPosition.Y < e.CurrentSize.Height - viewportBoundingThreshold)
            ) {
                if(
                    (currentViewportX > viewportBoundingThreshold) &&
                    (currentViewportX < this.currentViewportSize.Width - viewportBoundingThreshold) &&
                    (currentViewportY > viewportBoundingThreshold) &&
                    (currentViewportY < this.currentViewportSize.Height - viewportBoundingThreshold)
                ) {
                    this.toolTipVisible = true;
                    this.toolTipPosition = new Point2d(currentViewportX + 40, currentViewportY + 20);
                    this.toolTipDisplayPositionStart = e.PointStart;
                    this.toolTipDisplayPositionEnd = e.PointEnd;
                    this.toolTipDisplayLength = e.PointToPointLength;
                    this.toolTipDisplayPositionEndVisible = e.IsDrawingActive;
                    this.toolTipVisibleTimeout = 16;
                } else {
                    this.toolTipVisible = false;
                    this.drawingResetTriggerValue = true;
                }
            } else {
                this.toolTipVisible = false;
                this.drawingResetTriggerValue = true;
            }
        }
    }

    receiveDrawingReset() {
        this.drawingResetTriggerValue = false;
    }
}
</script>
