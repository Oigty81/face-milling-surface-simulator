<template>
    <canvas
        v-bind:id="canvasId"
        class="determine-drawing-relation-canvas"
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
import { CanvasMouseEventInformationExtended } from '../../../types/CanvasMouseEventInformationExtended';
import { DefaultCallback } from '../../../types/DefaultCallback';

import { uuidv4 } from '../../../utilities/createUUID';

@Component({})
export default class DetermineDrawingRelation extends Vue {
    private canvasId!: string;
    private currentCanvasSize!: Size2d;
    
    private positionStart!: Point2d;
    private positionEnd!: Point2d;
    private pointToPointLength!: number;
    private isDrawingActive!: boolean;
    private isDrawingDone!: boolean;
   
    constructor() {
        super();
        
        this.canvasId = 'drawing-relation-canvas-'.concat(uuidv4()); // make unique ids for main canvas
        this.currentCanvasSize = new Size2d(32, 32);
        
        this.positionStart = new Point2d(0, 0);
        this.positionEnd = new Point2d(0, 0);
        this.pointToPointLength = 0;
        this.isDrawingActive = false;
        this.isDrawingDone = false;
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
            return new Image(32, 32);
        }
    })
    crosshairImage!: HTMLImageElement;

    @Prop({
        default: function () {
            return false;
        }
    })
    drawingResetTrigger!: boolean;

    @Watch('drawingResetTrigger', { immediate: false })
        // eslint-disable-next-line
        onRoughnessResetTriggerChanged(value: boolean, oldValue: boolean) {
            if(value === true) {
                this.isDrawingActive = false;
                this.isDrawingDone = false;
                this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                    if(cb.Error > 0) {
                        this.sendError(cb.ErrorText);
                    }
                });
                this.sendDrawingReset();
            }
        }
    
    // ---------------------------------------------------------
        
    @Emit()
    sendClickDrawingLength(length) {
        return length;
    }

    @Emit()
    sendMouseMove(canvasMouseEventInformation: CanvasMouseEventInformationExtended) {
        return canvasMouseEventInformation;
    }

    @Emit()
    sendDrawingReset() {
        return 0;
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
                cbLoaded(new DefaultCallback(1, 'in DetermineDrawingRelation: source image to large! (' + img.width + 'x' + img.height + ')', 0, 0));
            } else {
                if(ctx !== null) {
                    ctx.canvas.width = img.width;
                    ctx.canvas.height = img.height;
                    
                    this.currentCanvasSize = new Size2d(img.width, img.height);
                    
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    
                    if(this.isDrawingActive === true) {
                        ctx.drawImage(this.crosshairImage, this.positionStart.X - 16, this.positionStart.Y - 16);
                        if(this.isDrawingDone === true) {
                            ctx.drawImage(this.crosshairImage, this.positionEnd.X - 16, this.positionEnd.Y - 16);
                        }

                        ctx.beginPath();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#FF0000";
                        ctx.moveTo(this.positionStart.X, this.positionStart.Y);
                        ctx.lineTo(this.positionEnd.X, this.positionEnd.Y);
                        ctx.stroke();
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

        if(this.isDrawingActive === true) {
            this.positionEnd = new Point2d(x, y);
            this.pointToPointLength = Math.sqrt(
                Math.pow(this.positionStart.X - this.positionEnd.X, 2) +
                Math.pow(this.positionStart.Y - this.positionEnd.Y, 2)
            );
            this.sendClickDrawingLength(this.pointToPointLength);
        
            this.isDrawingDone = true;
            this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                } else {
                    this.isDrawingActive = false;
                }
            });
        } else {
            this.isDrawingActive = true;
            this.isDrawingDone = false;
            
            this.positionStart = new Point2d(x, y);
            this.positionEnd = new Point2d(x, y);
            this.pointToPointLength = Math.sqrt(
                Math.pow(this.positionStart.X - this.positionEnd.X, 2) +
                Math.pow(this.positionStart.Y - this.positionEnd.Y, 2)
            );
            this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                }
            });
        }
    }

    receiveCanvasMouseMove(e: MouseEvent) {
        const canvas1 = document.getElementById(this.canvasId) as HTMLCanvasElement;
        const rect = canvas1.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if(this.isDrawingActive === true) {
            this.positionEnd = new Point2d(x, y);
            this.pointToPointLength = Math.sqrt(
                Math.pow(this.positionStart.X - this.positionEnd.X, 2) +
                Math.pow(this.positionStart.Y - this.positionEnd.Y, 2)
            );

            this.setImageToCanvas(this.imageData, (cb: DefaultCallback) => {
                if(cb.Error > 0) {
                    this.sendError(cb.ErrorText);
                }
            });
        } else {
            this.positionStart = new Point2d(x, y);
        }

        this.sendMouseMove(
            new CanvasMouseEventInformationExtended(
                new Point2d(x, y),
                this.currentCanvasSize,
                this.positionStart,
                this.positionEnd,
                this.pointToPointLength,
                this.isDrawingActive
            )
        );
    }
}
</script>
