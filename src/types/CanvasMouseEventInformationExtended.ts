import { Point2d } from './Point2d';
import { Size2d } from './Size2d';

export class CanvasMouseEventInformationExtended {
    private _currentPosition: Point2d;
    private _currentSize: Size2d;
    private _pointStart: Point2d;
    private _pointEnd: Point2d;
    private _pointToPointLength: number;
    private _isDrawingActive: boolean;
        
    constructor(
            currentPosition: Point2d,
            currentSize: Size2d,
            pointStart: Point2d,
            pointEnd: Point2d,
            pointToPointLength: number,
            isDrawingActive: boolean
        ) {
        this._currentPosition = currentPosition;
        this._currentSize = currentSize;
        this._pointStart = pointStart;
        this._pointEnd = pointEnd;
        this._pointToPointLength = pointToPointLength;
        this._isDrawingActive = isDrawingActive;
    }

    public get CurrentPosition() { return this._currentPosition; }
    public get CurrentSize() { return this._currentSize; }
    public get PointStart() { return this._pointStart; }
    public get PointEnd() { return this._pointEnd; }
    public get PointToPointLength() { return this._pointToPointLength; }
    public get IsDrawingActive() { return this._isDrawingActive; }
}
