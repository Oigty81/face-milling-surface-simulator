import { Point2d } from './Point2d';
import { Size2d } from './Size2d';

export class CanvasMouseEventInformation {
    private _currentPosition: Point2d;
    private _currentSize: Size2d;
        
    constructor(currentPosition: Point2d, currentSize: Size2d) {
        this._currentPosition = currentPosition;
        this._currentSize = currentSize;
    }

    public get CurrentPosition() { return this._currentPosition; }
    public get CurrentSize() { return this._currentSize; }
}
