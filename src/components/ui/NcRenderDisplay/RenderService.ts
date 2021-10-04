import { DefaultCallback } from '../../../types/DefaultCallback';
import { NcRenderParameter } from '../../../types/NcRenderParameter';

import { colorValueHexToIntWithAlphaAndSwapRedWithBlue } from '../../../utilities/convertColorValue';

import renderWrapper from './wasm/renderWrapper.js';
require.context("./wasm", false, /^\.\/renderWrapper.wasm/);

export class RenderService {
    private _nativeServicesModule: any;
    private _innerCanvasId!: string;
    
    constructor(canvasId: string, cbRuntimeInitialized: () => void) {
        this._innerCanvasId = canvasId;

        this._nativeServicesModule = renderWrapper();
        
        this._nativeServicesModule.onRuntimeInitialized = () => {
            cbRuntimeInitialized();
        };
    }
    
    CreateNewRenderObject(ncRenderParameter: NcRenderParameter, cbLoaded: (cb: DefaultCallback) => void) {
        const c1 = document.createElement("canvas");
        const ctx = c1.getContext('2d');
        
        if(ncRenderParameter.ImageData === '' && ctx !== null) {
            ctx.canvas.width = 0;
            ctx.canvas.height = 0;
            cbLoaded(new DefaultCallback(0, '', 0, 0));
        }
        
        const image = new Image();
        const imageOrigin = new Image();
        image.src = ncRenderParameter.ImageData;
        image.onload = () => {
            if((image.width > 2048) || (image.height > 2048)) {
                cbLoaded(new DefaultCallback(1, 'source image to large! (' + image.width + 'x' + image.height + ')', 0, 0));
            } else {
                imageOrigin.src = ncRenderParameter.OriginPositionImageData;
                imageOrigin.onload = () => {
                    // scale image for better zoom resolution
                    const widthWithScale = image.width * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR;
                    const heightWithScale = image.height * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR;
                                        
                    if(ctx !== null) {
                        ctx.canvas.width = widthWithScale;
                        ctx.canvas.height = heightWithScale;
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, widthWithScale, heightWithScale);
                        
                        let dxImageOrigin = 0;
                        let dyImageOrigin = 0;
                        let dWidthImageOrigin = 0;
                        let dHeightImageOrigin = 0;

                        if(image.width > 800 || image.height > 800) {
                            dxImageOrigin = (ncRenderParameter.OriginPosition.X * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) - 64;
                            dyImageOrigin = (ncRenderParameter.OriginPosition.Y * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) - 64;
                            dWidthImageOrigin = 128;
                            dHeightImageOrigin = 128;
                        } else {
                            dxImageOrigin = (ncRenderParameter.OriginPosition.X * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) - 128;
                            dyImageOrigin = (ncRenderParameter.OriginPosition.Y * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) - 128;
                            dWidthImageOrigin = 64;
                            dHeightImageOrigin = 64;
                        }
                        ctx.drawImage(imageOrigin, dxImageOrigin, dyImageOrigin, dWidthImageOrigin, dHeightImageOrigin);
                    
                        const imageData = ctx.getImageData(0, 0, widthWithScale, heightWithScale);
                        
                        const numBytes = widthWithScale * heightWithScale * 4;
                        
                        const ptr = this._nativeServicesModule._malloc(numBytes);
                        const heapBytes = new Uint8Array(this._nativeServicesModule.HEAPU8.buffer, ptr, numBytes);
                    
                        heapBytes.set(new Uint8Array(imageData.data));
                    
                        const createNewRenderObject = this._nativeServicesModule.cwrap(
                            'CreateRenderObject',
                            'number',
                            [
                                'string', 'number', 'number', 'number',
                                'number', 'number', 'number', 'number',
                                'number', 'number', 'number', 'number',
                            ]
                        );

                        const result = createNewRenderObject(
                            this._innerCanvasId,
                            image.width,
                            image.height,
                            heapBytes.byteOffset,
                            widthWithScale,
                            heightWithScale,
                            ncRenderParameter.ToolDiameter,
                            colorValueHexToIntWithAlphaAndSwapRedWithBlue(ncRenderParameter.ToolColor, 64),
                            colorValueHexToIntWithAlphaAndSwapRedWithBlue(ncRenderParameter.LineColor, 255),
                            colorValueHexToIntWithAlphaAndSwapRedWithBlue(ncRenderParameter.RoughnessColor, 255),
                            ncRenderParameter.StrokeWidth,
                            colorValueHexToIntWithAlphaAndSwapRedWithBlue(ncRenderParameter.TouchedColor, 255)
                        );
                    
                        cbLoaded(new DefaultCallback(0, '', image.width, image.height));
                    } else {
                        cbLoaded(new DefaultCallback(2, 'can not create render object!', 0, 0));
                    }
                };
            }
        };
    }

    ResetRenderObject() {
        this._nativeServicesModule._ResetRenderObject();
    }

    DrawRoughnessToRenderObject(millToolPositionX, millToolPositionY, option) {
        this._nativeServicesModule._DrawRoughnessToRenderObject(millToolPositionX, millToolPositionY, option);
    }

    SetRenderObject(millToolVisible, millToolPositionX, millToolPositionY, normalizedZoom, zoomFactor) {
        this._nativeServicesModule._SetRenderObject(
            millToolVisible,
            millToolPositionX,
            millToolPositionY,
            normalizedZoom,
            (zoomFactor)
        );
    }
    
    ReleaseMemory() {
        this._nativeServicesModule._DeallocateNativeMemory();
    }
}
