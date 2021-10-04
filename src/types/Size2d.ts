export class Size2d {
    private _width: number;
    private _height: number;
    
    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    public get Width() { return this._width; }
    public get Height() { return this._height; }
}
