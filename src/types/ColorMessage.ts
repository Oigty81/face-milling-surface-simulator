export class ColorMessage {
    private _text: string;
    private _color: number;
    
    constructor(text: string, color: number) {
        this._text = text;
        this._color = color;
    }

    public get Text() { return this._text; }
    public get Color() { return this._color; }
}
