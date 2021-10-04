import generateSamples from '../../../../src/utilities/Nc/generateSamples';

describe('Nc.generateSamples', () => {
    it('check generate Samples from simple G1 block with one tool blade and feed 1', () => {
        const ncProgram = {
            blocks: [
                { g: 1, x: 10, y: 0, cr: 0, feed: 1, blockAssociated: 0 },
            ]
        };

        const outSamples = generateSamples(ncProgram, 0, 0, 1);
        expect(outSamples.error).toBe(0);
        expect(outSamples.errorText).toBe("");
        expect(outSamples.ncSampleList.length).toBe(10);
        expect(outSamples.ncSampleList[3].x).toBeGreaterThan(2.9);
        expect(outSamples.ncSampleList[3].x).toBeLessThan(3.1);
    });
        
    // --------------------------------------------------------

    it('check generate Samples from simple G1 block with one tool blade and feed 0.5', () => {
        const ncProgram = {
            blocks: [
                { g: 1, x: 10, y: 0, cr: 0, feed: 0.5, blockAssociated: 0 },
            ]
        };
        
        const outSamples = generateSamples(ncProgram, 0, 0, 1);
        expect(outSamples.error).toBe(0);
        expect(outSamples.errorText).toBe("");
        expect(outSamples.ncSampleList.length).toBe(20);
        expect(outSamples.ncSampleList[6].x).toBeGreaterThan(2.9);
        expect(outSamples.ncSampleList[6].x).toBeLessThan(3.1);
    });

    // --------------------------------------------------------

    it('check generate Samples from simple G1 block "sloped" with one tool blade and feed 1', () => {
        const ncProgram = {
            blocks: [
                { g: 1, x: 10, y: 5, cr: 0, feed: 1, blockAssociated: 0 },
            ]
        };
        
        const outSamples = generateSamples(ncProgram, 0, 0, 1);
        expect(outSamples.error).toBe(0);
        expect(outSamples.errorText).toBe("");
        expect(outSamples.ncSampleList.length).toBe(12);
        expect(outSamples.ncSampleList[3].x).toBeGreaterThan(2.6);
        expect(outSamples.ncSampleList[3].x).toBeLessThan(2.8);
        expect(outSamples.ncSampleList[3].y).toBeGreaterThan(1.3);
        expect(outSamples.ncSampleList[3].y).toBeLessThan(1.4);
    });

    // --------------------------------------------------------

    it('check generate Samples from simple G2 block (radius 100) with one tool blade and feed 1', () => {
        const ncProgram = {
            blocks: [
                { g: 2, x: 100, y: 100, cr: 100, feed: 1, blockAssociated: 0 },
            ]
        };
        
        const outSamples = generateSamples(ncProgram, 0, 0, 1);
        expect(outSamples.error).toBe(0);
        expect(outSamples.errorText).toBe("");
        expect(outSamples.ncSampleList.length).toBe(158);
        expect(outSamples.ncSampleList[outSamples.ncSampleList.length / 2].x).toBeGreaterThan(29);
        expect(outSamples.ncSampleList[outSamples.ncSampleList.length / 2].x).toBeLessThan(31);
        expect(outSamples.ncSampleList[outSamples.ncSampleList.length / 2].y).toBeGreaterThan(70);
        expect(outSamples.ncSampleList[outSamples.ncSampleList.length / 2].y).toBeLessThan(72);
    });
});
