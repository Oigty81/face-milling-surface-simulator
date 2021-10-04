import {
    normalizeAngle,
    determineAngleOfStraight,
    simpleCosineLawCalculator,
    senseOfRotation,
    compareValuesWithDeviationTolerance,
    determineVectorAngle,
    calculateChordReverse180
} from '../../../../src/utilities/Nc/mathHelpers';

describe('Nc.mathHelpers.normalizeAngle', () => {
    it('normalizeAngle(20)', () => {
        const result = normalizeAngle(20);
        expect(result).toBe(20);
    });

    it('normalizeAngle(-2)', () => {
        const result = normalizeAngle(-2);
        expect(result).toBe(358);
    });

    it('normalizeAngle(722)', () => {
        const result = normalizeAngle(722);
        expect(result).toBe(2);
    });
});
    
describe('Nc.mathHelpers.determineAngleOfStraight', () => {
    it('determineAngleOfStraight(0, 0, 10, 0)', () => {
        const result = determineAngleOfStraight(0, 0, 10, 0);
        expect(result).toBe(0);
    });

    it('determineAngleOfStraight(0, 0, 0, 10)', () => {
        const result = determineAngleOfStraight(0, 0, 0, 10);
        expect(result).toBe(90);
    });

    it('determineAngleOfStraight(0, 0, -10, 0)', () => {
        const result = determineAngleOfStraight(0, 0, -10, 0);
        expect(result).toBe(180);
    });

    it('determineAngleOfStraight(0, 0, 0, -10)', () => {
        const result = determineAngleOfStraight(0, 0, 0, -10);
        expect(result).toBe(270);
    });

    it('determineAngleOfStraight(0, 0, 10, 11)', () => {
        const result = determineAngleOfStraight(0, 0, 10, 11);
        expect(result).toBeGreaterThan(46);
        expect(result).toBeLessThan(48);
    });

    it('determineAngleOfStraight(0, 0, -10, 11)', () => {
        const result = determineAngleOfStraight(0, 0, -10, 11);
        expect(result).toBeGreaterThan(130);
        expect(result).toBeLessThan(135);
    });

    it('determineAngleOfStraight(0, 0, -10, -7)', () => {
        const result = determineAngleOfStraight(0, 0, -10, -7);
        expect(result).toBeGreaterThan(212);
        expect(result).toBeLessThan(216);
    });

    it('determineAngleOfStraight(0, 0, 10, -8)', () => {
        const result = determineAngleOfStraight(0, 0, 10, -8);
        expect(result).toBeGreaterThan(318);
        expect(result).toBeLessThan(323);
    });
});

describe('Nc.mathHelpers.simpleCosineLawCalculator', () => {
    it('simpleCosineLawCalculator(10, 10)', () => {
        const result = simpleCosineLawCalculator(10, 10);
        expect(result).toBeGreaterThan(59.5);
        expect(result).toBeLessThan(60.5);
    });

    it('simpleCosineLawCalculator(10, 2)', () => {
        const result = simpleCosineLawCalculator(10, 2);
        expect(result).toBeGreaterThan(10);
        expect(result).toBeLessThan(15);
    });

    it('simpleCosineLawCalculator(10, 18)', () => {
        const result = simpleCosineLawCalculator(10, 18);
        expect(result).toBeGreaterThan(125);
        expect(result).toBeLessThan(132);
    });
});

describe('Nc.mathHelpers.senseOfRotation', () => {
    it('senseOfRotation(0, 0, 20, 0, 40, 0)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 40, 0);
        expect(result).toBe(1);
    });

    it('senseOfRotation(0, 0, 20, 0, -40, 0)', () => {
        const result = senseOfRotation(0, 0, 20, 0, -40, 0);
        expect(result).toBe(1);
    });

    it('senseOfRotation(0, 0, 20, 0, 30, 10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 30, 10);
        expect(result).toBe(3);
    });

    it('senseOfRotation(0, 0, 20, 0, 30, -10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 30, -10);
        expect(result).toBe(2);
    });

    it('senseOfRotation(0, 0, 20, 0, 20, 10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 20, 10);
        expect(result).toBe(3);
    });

    it('senseOfRotation(0, 0, 20, 0, 20, -10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 20, -10);
        expect(result).toBe(2);
    });

    it('senseOfRotation(0, 0, 20, 0, 0, 20)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 0, 20);
        expect(result).toBe(3);
    });

    it('senseOfRotation(0, 0, 20, 0, 0, -20)', () => {
        const result = senseOfRotation(0, 0, 20, 0, 0, -20);
        expect(result).toBe(2);
    });

    it('senseOfRotation(0, 0, 20, 0, -5, 10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, -5, 10);
        expect(result).toBe(3);
    });

    it('senseOfRotation(0, 0, 20, 0, -5, -10)', () => {
        const result = senseOfRotation(0, 0, 20, 0, -5, -10);
        expect(result).toBe(2);
    });

    it('senseOfRotation(0, 0, 10, 10, -5, 0)', () => {
        const result = senseOfRotation(0, 0, 10, 10, -5, 0);
        expect(result).toBe(3);
    });

    it('senseOfRotation(0, 0, -10, 10, 20, 0)', () => {
        const result = senseOfRotation(0, 0, -10, 10, 20, 0);
        expect(result).toBe(2);
    });
});
   
describe('Nc.mathHelpers.compareValuesWithDeviationTolerance', () => {
    it('compareValuesWithDeviationTolerance(0, 2.5, 0.5)', () => {
        const result = compareValuesWithDeviationTolerance(0, 2.5, 0.5);
        expect(result).toBe(0);
    });

    it('compareValuesWithDeviationTolerance(0, 2.5, 3.0)', () => {
        const result = compareValuesWithDeviationTolerance(0, 2.5, 3.0);
        expect(result).toBe(1);
    });

    it('compareValuesWithDeviationTolerance(-2, 1.5, -0.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, 1.5, -0.5);
        expect(result).toBe(0);
    });

    it('compareValuesWithDeviationTolerance(-2, 1.5, -4.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, 1.5, -4.5);
        expect(result).toBe(1);
    });

    it('compareValuesWithDeviationTolerance(-2, 1.5, 0.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, 1.5, 0.5);
        expect(result).toBe(0);
    });

    it('compareValuesWithDeviationTolerance(-2, 1.5, 4.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, 1.5, 4.5);
        expect(result).toBe(1);
    });

    it('compareValuesWithDeviationTolerance(-2, -1.5, 0.4)', () => {
        const result = compareValuesWithDeviationTolerance(-2, -1.5, 0.4);
        expect(result).toBe(0);
    });

    it('compareValuesWithDeviationTolerance(-2, -1.5, 0.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, -1.5, 0.6);
        expect(result).toBe(1);
    });

    it('compareValuesWithDeviationTolerance(-2, -1.5, -0.5)', () => {
        const result = compareValuesWithDeviationTolerance(-2, -1.5, 0.6);
        expect(result).toBe(1);
    });

    it('compareValuesWithDeviationTolerance(-2, -1.5, 0.6)', () => {
        const result = compareValuesWithDeviationTolerance(-2, -1.5, 0.6);
        expect(result).toBe(1);
    });
});

describe('Nc.mathHelpers.determineVectorAngle', () => {
    it('determineVectorAngle(0, 0, 0, 10, 10, 0)', () => {
        const result = determineVectorAngle(0, 0, 0, 10, 10, 0);
        expect(result).toBe(90);
    });

    it('determineVectorAngle(0, 0, 0, 10, -10, 0)', () => {
        const result = determineVectorAngle(0, 0, 0, 10, -10, 0);
        expect(result).toBe(90);
    });

    it('determineVectorAngle(0, 0, -10, 1, 10, 1)', () => {
        const result = determineVectorAngle(0, 0, -10, 1, 10, 1);
        expect(result).toBeGreaterThan(165);
        expect(result).toBeLessThan(170);
    });

    it('determineVectorAngle(0, 0, -10, -1, 10, -1)', () => {
        const result = determineVectorAngle(0, 0, -10, -1, 10, -1);
        expect(result).toBeGreaterThan(165);
        expect(result).toBeLessThan(170);
    });

    it('determineVectorAngle(0, 0, 10, 10, 10, 10)', () => {
        const result = determineVectorAngle(0, 0, 10, 10, 10, 10);
        expect(result).toBeGreaterThan(-0.005);
        expect(result).toBeLessThan(0.005);
    });
   
    it('determineVectorAngle(0, 0, -10, -1, 10, 1)', () => {
        const result = determineVectorAngle(0, 0, -10, -1, 10, 1);
        expect(result).toBeGreaterThan(179.995);
        expect(result).toBeLessThan(180.005);
    });
});

describe('Nc.mathHelpers.calculateChordReverse180', () => {
    it('calculateChordReverse180(100, 120)', () => {
        const result = calculateChordReverse180(100, 120);
        expect(result).toBeGreaterThan(99.995);
        expect(result).toBeLessThan(100.005);
    });

    it('calculateChordReverse180(100, 1)', () => {
        const result = calculateChordReverse180(100, 1);
        expect(result).toBeGreaterThan(199.5);
        expect(result).toBeLessThan(200.5);
    });

    it('calculateChordReverse180(100, -1)', () => {
        const result = calculateChordReverse180(100, -1);
        expect(result).toBeGreaterThan(199.5);
        expect(result).toBeLessThan(200.5);
    });

    it('calculateChordReverse180(100, 90)', () => {
        const result = calculateChordReverse180(100, 90);
        expect(result).toBeGreaterThan(141.42);
        expect(result).toBeLessThan(141.43);
    });

    it('calculateChordReverse180(100, -90)', () => {
        const result = calculateChordReverse180(100, -90);
        expect(result).toBeGreaterThan(141.42);
        expect(result).toBeLessThan(141.43);
    });
});
