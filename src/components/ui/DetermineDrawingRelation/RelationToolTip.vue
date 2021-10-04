<template>
    <div>
    <transition name="fade">
    <div
        class="drawing-relation-tooltip"
        v-if="toolTipVisible === true"
        transition="fade"
        :style="{ top: currentTop + 'px', left: currentLeft + 'px'}"
    >
        <div class="row">
            <div class="col-6">
                <p class="drawing-relation-tooltip-text">Start X: </p>
                <p class="drawing-relation-tooltip-text">Start X: </p>
            </div>
            <div class="col-6">
                <p class="drawing-relation-tooltip-text"> {{displayPositionStart.X.toFixed(0)}}</p>
                <p class="drawing-relation-tooltip-text"> {{displayPositionStart.Y.toFixed(0)}}</p>
            </div>
        </div>
        <div
            class="row"
            v-if="displayPositionEndVisible === true"
        >
            <div class="col-6">
                <p class="drawing-relation-tooltip-text">End X: </p>
                <p class="drawing-relation-tooltip-text">End Y: </p>
            </div>
            <div class="col-6">
                <p class="drawing-relation-tooltip-text"> {{displayPositionEnd.X.toFixed(0)}}</p>
                <p class="drawing-relation-tooltip-text"> {{displayPositionEnd.X.toFixed(0)}}</p>
            </div>
        </div>
        <div
            class="row"
            v-if="displayPositionEndVisible === true"
        >
            <div class="col">
                <hr class="hr-line-white" style="margin: 8px 0px;">
            </div>
        </div>
        <div
            class="row"
            v-if="displayPositionEndVisible === true"
        >
            <div class="col-6">
                <p class="drawing-relation-tooltip-text">Length: </p>
            </div>
            <div class="col-6">
                <p class="drawing-relation-tooltip-text"> {{displayLength.toFixed(0)}}</p>
            </div>
        </div>
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
export default class RelationToolTip extends Vue {
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
    displayPositionStart!: Point2d;

    @Prop({
        default: function () {
            return {
                X: 10,
                Y: 20
            };
        }
    })
    displayPositionEnd!: Point2d;

    @Prop({
        default: function () {
            return 10;
        }
    })
    displayLength!: number;

    @Prop({
        default: function () {
            return false;
        }
    })
    displayPositionEndVisible!: boolean;
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
