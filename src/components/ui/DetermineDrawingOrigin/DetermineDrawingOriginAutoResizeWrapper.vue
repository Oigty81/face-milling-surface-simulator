<template>
    <div
        ref="DetermineDrawingOriginWrapperEl"
        class="determine-drawing-origin-wrapper-container"
        @mousemove="receiveMouseMove($event)"
    >
        <simplebar
            ref="DetermineDrawingOriginScrollbarEl"
            :style="{
                width: ''.concat(currentViewportSize.Width).concat('px'),
                height: ''.concat(currentViewportSize.Height).concat('px')
            }"
            data-simplebar-auto-hide="false"
        >
            <DetermineDrawingOrigin
                :imageData="imageData"
                :originPosition="originPosition"
                :originVisible="originVisible"
                :workpieceOriginImage="workpieceOriginImage"
                @send-click-position="sendClickPosition($event)"
                @send-mouse-move="receiveMouseMoveCanvas($event)"
                @send-error="sendError($event)"
            ></DetermineDrawingOrigin>
        </simplebar>
        <origin-tool-tip
            :toolTipPosition="toolTipPosition"
            :toolTipVisible="toolTipVisible"
            :displayPosition="toolTipDisplayPosition"
        ></origin-tool-tip>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch, Emit } from 'vue-property-decorator';
import simplebar from 'simplebar-vue';

import { Point2d } from '../../../types/Point2d';
import { Size2d } from '../../../types/Size2d';
import { CanvasMouseEventInformation } from '../../../types/CanvasMouseEventInformation';

import DetermineDrawingOrigin from './DetermineDrawingOrigin.vue';
import OriginToolTip from './OriginToolTip.vue';

@Component({
    components: { simplebar, DetermineDrawingOrigin, OriginToolTip }
})
export default class DetermineDrawingOriginAutoResizeWrapper extends Vue {
    private currentViewportSize!: Size2d;
    private toolTipPosition!: Point2d;
    private toolTipVisible!: boolean;
    private toolTipDisplayPosition!: Point2d;
    private timerId!: number;
    private toolTipVisibleTimeout!: number;

    constructor() {
        super();

        this.currentViewportSize = new Size2d(600, 600);
        this.toolTipPosition = new Point2d(0, 0);
        this.toolTipVisible = false;
        this.toolTipDisplayPosition = new Point2d(0, 0);
        this.timerId = 0;
        this.toolTipVisibleTimeout = 0;
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
            return new Point2d(0, 0);
        }
    })
    originPosition!: Point2d;

    @Prop({
        default: function () {
            return false;
        }
    })
    originVisible!: boolean;

    @Prop({
        default: function () {
            return new Image(64, 64);
        }
    })
    workpieceOriginImage!: HTMLImageElement;

    // ---------------------------------------------------------
    
    @Emit()
    sendClickPosition(e) {
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
            }
        }, 100);
    }

    destroyed() {
        clearInterval(this.timerId);
    }

    // ---------------------------------------------------------

    handleResize() {
        if(this.$refs.DetermineDrawingOriginWrapperEl !== undefined) {
            const w: number = (this.$refs.DetermineDrawingOriginWrapperEl as Vue & { clientWidth: number }).clientWidth;
            this.currentViewportSize = new Size2d(w, w / this.viewportRelation);
        }
    }

    receiveMouseMove(e: MouseEvent) {
        if(this.$refs.DetermineDrawingOriginScrollbarEl !== undefined) {
            const scrollTriggerThreshold = 32;
            const scrollTriggerStep = 64;
            
            //TODO: fix this later, today getScrollElement is not supported by typescript (2021-05-03)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            const scrollElement = this.$refs.DetermineDrawingOriginScrollbarEl.SimpleBar.getScrollElement();
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

    receiveMouseMoveCanvas(e: CanvasMouseEventInformation) {
        if(this.$refs.DetermineDrawingOriginScrollbarEl !== undefined) {
            const viewportBoundingThreshold = 8;

            //TODO: fix this later, today getScrollElement is not supported by typescript (2021-05-03)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            /* @ts-ignore */
            const scrollElement = this.$refs.DetermineDrawingOriginScrollbarEl.SimpleBar.getScrollElement();
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
                    this.toolTipDisplayPosition = new Point2d(e.CurrentPosition.X, e.CurrentPosition.Y);
                    this.toolTipVisibleTimeout = 12;
                } else {
                    this.toolTipVisible = false;
                }
            } else {
            this.toolTipVisible = false;
            }
        }
    }
}
</script>
