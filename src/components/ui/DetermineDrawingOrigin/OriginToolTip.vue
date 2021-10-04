<template>
    <div>
    <transition name="fade">
    <div
        class="drawing-origin-tooltip"
        v-if="toolTipVisible === true"
        transition="fade"
        :style="{ top: currentTop + 'px', left: currentLeft + 'px'}"
    >
        <p class="drawing-origin-tooltip-text"><strong>current position</strong></p>
        <p class="drawing-origin-tooltip-text">X: {{displayPosition.X.toFixed(0)}}</p>
        <p class="drawing-origin-tooltip-text">X: {{displayPosition.Y.toFixed(0)}}</p>
    </div>
    </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

import { Point2d } from '../../../types/Point2d';

@Component({})
export default class OriginToolTip extends Vue {
    private currentTop!: number;
    private currentLeft!: number;

    constructor() {
        super();
        this.currentTop = 0;
        this.currentLeft = 0;
    }

    @Prop({
        default: function () {
            return {
                X: 0,
                Y: 0
            };
        }
    })
    toolTipPosition!: Point2d;

    @Watch('toolTipPosition', { immediate: false, deep: true })
        // eslint-disable-next-line
        onChangedToolTipPosition(value: Point2d, oldValue: Point2d) {
            this.currentTop = value.Y;
            this.currentLeft = value.X;
        }

    @Prop({
        default: function () {
            return true;
        }
    })
    toolTipVisible!: boolean;

     @Prop({
        default: function () {
            return {
                X: 0,
                Y: 0
            };
        }
    })
    displayPosition!: Point2d;
}
</script>

<style lang="scss" scoped>
    .fade-enter-active {
        transition: opacity 0.666s;
        opacity: 1;
    }

    .fade-leave-active {
        transition: opacity 1.333s;
        opacity: 1;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
