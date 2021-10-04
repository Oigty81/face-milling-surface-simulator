import { Point2d } from './Point2d';

export class MillPosition {
    private _position: Point2d;
    private _refreshCanvas: boolean;
        
    constructor(position: Point2d, refreshCanvas: boolean) {
        this._position = position;
        this._refreshCanvas = refreshCanvas;
    }

    public get Position() { return this._position; }
    public get RefreshCanvas() { return this._refreshCanvas; }
}
