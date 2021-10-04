export class DefaultCallback {
    private _error: number;
    private _errorText: string;
    private _value1: number;
    private _value2: number;
        
    constructor(error: number, errorText: string, value1: number, value2: number) {
        this._error = error;
        this._errorText = errorText;
        this._value1 = value1;
        this._value2 = value2;
    }

    public get Error() { return this._error; }
    public get ErrorText() { return this._errorText; }
    public get Value1() { return this._value1; }
    public get Value2() { return this._value2; }
}
