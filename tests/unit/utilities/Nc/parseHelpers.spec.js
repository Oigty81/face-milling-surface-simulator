import {
    lineSplitter,
    validateNcBlockText,
    checkNcScopeLimit,
    precheckCircularInterpolationFaults,
    addTransitionRadius
} from '../../../../src/utilities/Nc/parseHelpers';

describe('Nc.parseHelpers.lineSplitter', () => {
    it('should split a string in single strings at line feed character and remove possible carrier return character', () => {
        const result = lineSplitter(";------NC1\r\nG1 X1 Y1;--\r\nG1 X2Y=2\nG1X3Y4Z1 CR=23");
        expect(result.length).toBe(4);
        expect(result).toEqual(expect.arrayContaining([';------NC1', 'G1 X2Y=2']));
        expect(result).not.toBeUndefined();
    });
});

describe('Nc.parseHelpers.validateNcBlockText', () => {
    it('parsing fault', () => {
        const result = validateNcBlockText('G1X34rrr');
        expect(result.error).toBe(1);
    });

    it('insignificant line', () => {
        const result = validateNcBlockText(';abcd efgh');
        expect(result.error).toBe(0);
        expect(result.insignificantLine).toBe(true);
    });

    it('G-Code undefined', () => {
        const result = validateNcBlockText('X34 Y=33.6 CR=34.5 TR=3 F=0.3;abc');
        expect(result.error).toBe(2);
    });
    
    it('G-Code must have a value 1, 2 or 3', () => {
        const result = validateNcBlockText('G4 X34 Y=33.6 CR=34.5 TR=3');
        expect(result.error).toBe(3);
    });

    it('when G1, x and/or y axis must define', () => {
        const result = validateNcBlockText('G1 TR=1');
        expect(result.error).toBe(4);
    });

    it('when G2 or G3, x and/or y axis', () => {
        const result = validateNcBlockText('G2 CR=2 TR=1');
        expect(result.error).toBe(5);
    });

    it('when G2 or G3, radius must define', () => {
        const result = validateNcBlockText('G3 X34 TR=1');
        expect(result.error).toBe(5);
    });

    it('lowercase letter tolerance', () => {
        const result = validateNcBlockText('g1x34 y=33.6');
        expect(result.ncBlock).toEqual({
            g: 1, x: 34, y: 33.6, cr: undefined, tr: undefined, feed: undefined
        });
    });

    it('linear movement x', () => {
        const result = validateNcBlockText('N1G1X34.5');
        expect(result.ncBlock).toEqual({
            g: 1, x: 34.5, y: undefined, cr: undefined, tr: undefined, feed: undefined
        });
    });

    it('linear movement x with *.0', () => {
        const result = validateNcBlockText('N1G1X34.0');
        expect(result.ncBlock).toEqual({
            g: 1, x: 34, y: undefined, cr: undefined, tr: undefined, feed: undefined
        });
    });

    it('linear movement y', () => {
        const result = validateNcBlockText('N1G1Y10.7');
        expect(result.ncBlock).toEqual({
            g: 1, x: undefined, y: 10.7, cr: undefined, tr: undefined, feed: undefined
        });
    });

    it('linear movement x and y with feed', () => {
        const result = validateNcBlockText('N1G1X34.5Y22.1F0.6');
        expect(result.ncBlock).toEqual({
            g: 1, x: 34.5, y: 22.1, cr: undefined, tr: undefined, feed: 0.6
        });
    });

    it('linear movement negative x and y with feed', () => {
        const result = validateNcBlockText('N1G1X-34.5Y= -22.1F0.6');
        expect(result.ncBlock).toEqual({
            g: 1, x: -34.5, y: -22.1, cr: undefined, tr: undefined, feed: 0.6
        });
    });

    it('linear movement x and y with feed and transition radius', () => {
        const result = validateNcBlockText('N1G1X34.5Y3TR=2F0.3');
        expect(result.ncBlock).toEqual({
            g: 1, x: 34.5, y: 3, cr: undefined, tr: 2, feed: 0.3
        });
    });

    it('clockwise circular interpolation ', () => {
        const result = validateNcBlockText('N1 G2 X=4 Y=3 CR=5');
        expect(result.ncBlock).toEqual({
            g: 2, x: 4, y: 3, cr: 5, tr: undefined, feed: undefined
        });
    });

    it('counter-clockwise circular interpolation ', () => {
        const result = validateNcBlockText('N1 G3 X=4 Y=3 CR=5');
        expect(result.ncBlock).toEqual({
            g: 3, x: 4, y: 3, cr: 5, tr: undefined, feed: undefined
        });
    });

    it('linear movement y whitespace character at line start', () => {
        const result = validateNcBlockText('    G1Y10.7');
        expect(result.ncBlock).toEqual({
            g: 1, x: undefined, y: 10.7, cr: undefined, tr: undefined, feed: undefined
        });
    });
});

describe('Nc.parseHelpers.checkNcScopeLimit', () => {
    it('values within the range', () => {
        const result = checkNcScopeLimit({
            x: 100, y: 100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(0);
    });

    it('values (negative x/y) within the range ', () => {
        const result = checkNcScopeLimit({
            x: -900, y: -100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(0);
    });

    it('invalidate raw nc block', () => {
        const result = checkNcScopeLimit({
            x: 100, y: 100, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(1);
    });

    it('x greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 2000, y: 100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(2);
    });

    it('negative x greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: -2000, y: 100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(2);
    });

    it('y greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 200, y: 2100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(3);
    });

    it('negative y greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 100, y: -2100, cr: 0, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(3);
    });

    it('cr greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 200, y: 100, cr: 1200, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(4);
    });

    it('cr cannot be negative', () => {
        const result = checkNcScopeLimit({
            x: 100, y: -100, cr: -1, tr: 0, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(4);
    });

    it('tr greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 200, y: 100, cr: 12, tr: 200, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(5);
    });

    it('tr cannot be negative', () => {
        const result = checkNcScopeLimit({
            x: 100, y: -100, cr: 0, tr: -1, feed: 1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(5);
    });

    it('feed greater then scope limit', () => {
        const result = checkNcScopeLimit({
            x: 200, y: 100, cr: 200, tr: 0, feed: 120.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(6);
    });

    it('feed cannot be negative', () => {
        const result = checkNcScopeLimit({
            x: 100, y: -100, cr: 0, tr: 0, feed: -1.0
        }, 1000, 1000, 1000, 100, 100);
        expect(result.error).toBe(6);
    });
});

describe('Nc.parseHelpers.precheckCircularInterpolationFaults', () => {
    it('radius is greater than min', () => {
        const result = precheckCircularInterpolationFaults([
            { g: 2, x: 5, y: 5, cr: 10, tr: 0, feed: 1, blockAssociated: 0 }
        ], 0, 0);
        expect(result.error).toBe(0);
    });

    it('radius is minimally approximate ', () => {
        const result = precheckCircularInterpolationFaults([
            { g: 2, x: 5, y: 5, cr: 3.53555, tr: 0, feed: 1, blockAssociated: 0 }
        ], 0, 0);
        expect(result.error).toBe(0);
    });

    it('radius is less than min', () => {
        const result = precheckCircularInterpolationFaults([
            { g: 2, x: 5, y: 5, cr: 3.5, tr: 0, feed: 1, blockAssociated: 0 }
        ], 0, 0);
        expect(result.error).toBe(1);
    });

    it('ignore radius with linear movement ', () => {
        const result = precheckCircularInterpolationFaults([
            { g: 1, x: 5, y: 5, cr: 0, tr: 0, feed: 1, blockAssociated: 0 }
        ], 0, 0);
        expect(result.error).toBe(0);
    });
});

describe('Nc.parseHelpers.addTransitionRadius', () => {
    it('no error', () => {
        const result = addTransitionRadius([{ g: 2, x: 1, y: 2, cr: 1, f: 1 }]);
        expect(result.error === undefined).toBe(true);
    });

    it('no transition radius blocks available', () => {
        const inputBlocks = [
            { g: 1, x: 100, y: 0, cr: 0, tr: 10, feed: 1, blockAssociated: 1 },
            { g: 1, x: 100, y: 100, cr: 0, tr: 10, feed: 1, blockAssociated: 2 },
        ];
        const result = addTransitionRadius(inputBlocks, 0, 0);
        expect(result.length).toBe(3);
    });
});
