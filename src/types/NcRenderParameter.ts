import { Point2d } from './Point2d';

export class NcRenderParameter {
    private _imageData: string;
    private _toolDiameter: number;
    private _toolColor: string;
    private _lineColor: string;
    private _roughnessColor: string;
    private _strokeWidth: number;
    private _touchedColor: string;
    private _originPosition: Point2d;
    private _originPositionImageData: string;
   
    constructor(
            imageData: string,
            toolDiameter: number,
            toolColor: string,
            lineColor: string,
            roughnessColor: string,
            strokeWidth: number,
            touchedColor: string,
            originPosition: Point2d,
            originPositionImageData: string) {
        this._imageData = imageData;
        this._toolDiameter = toolDiameter;
        this._toolColor = toolColor;
        this._lineColor = lineColor;
        this._roughnessColor = roughnessColor;
        this._strokeWidth = strokeWidth;
        this._touchedColor = touchedColor;
        this._originPosition = originPosition;
        this._originPositionImageData = originPositionImageData;
    }

    public get ImageData() { return this._imageData; }
    public get ToolDiameter() { return this._toolDiameter; }
    public get ToolColor() { return this._toolColor; }
    public get LineColor() { return this._lineColor; }
    public get RoughnessColor() { return this._roughnessColor; }
    public get StrokeWidth() { return this._strokeWidth; }
    public get TouchedColor() { return this._touchedColor; }
    public get OriginPosition() { return this._originPosition; }
    public get OriginPositionImageData() { return this._originPositionImageData; }
}
