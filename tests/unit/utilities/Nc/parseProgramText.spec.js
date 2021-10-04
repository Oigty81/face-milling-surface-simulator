import parseProgramText from '../../../../src/utilities/Nc/parseProgramText';

describe('Nc.parseProgramText', () => {
    it('valide nc program', () => {
        const result = parseProgramText(";------NC1\nG1 X100;--\r\nG3X150Y100CR=200\nG1X12Y13\nG1X-20Y-100F2\r\nG2x-150y100cr=130\r\nG1X200Y-200", 0, 0, 10, 1);
        expect(result.errorList === undefined).toBe(true);
        
        const expectedObject = [
            {
                g: 1,
                x: 95.6,
                y: 0,
                cr: 0,
                feed: 1,
                blockAssociated: 1
            },
            {
                g: 3,
                x: 102.95355747954176,
                y: 3.261244758417945,
                cr: 10.913142833307049,
                feed: 1,
                blockAssociated: 1
            },
            {
                g: 3,
                x: 144.17131575922852,
                y: 76.3219856947888,
                cr: 200,
                feed: 1,
                blockAssociated: 2
            },
            {
                g: 3,
                x: 129.3594152966661,
                y: 86.98745746963732,
                cr: 10.82491658134305,
                feed: 1,
                blockAssociated: 2
            },
            {
                g: 1,
                x: 15.045332169344334,
                y: 14.919883324151868,
                cr: 0,
                feed: 1,
                blockAssociated: 3
            },
            {
                g: 3,
                x: 11.019103666954493,
                y: 9.536209823933056,
                cr: 10.326960366609523,
                feed: 1,
                blockAssociated: 3
            },
            {
                g: 1,
                x: -18.256184296807987,
                y: -93.84215079810319,
                cr: 0,
                feed: 2,
                blockAssociated: 4
            },
            {
                g: 2,
                x: -26.334409727744493,
                y: -100.90938511117261,
                cr: 10.836186225025402,
                feed: 2,
                blockAssociated: 4
            },
            {
                g: 2,
                x: -155.9683071468273,
                y: 90.05766368131353,
                cr: 130,
                feed: 2,
                blockAssociated: 5
            },
            {
                g: 2,
                x: -141.19262341256257,
                y: 92.45082006791077,
                cr: 10.776433986275618,
                feed: 2,
                blockAssociated: 5
            },
            {
                g: 1,
                x: 200,
                y: -200,
                cr: 0,
                feed: 2,
                blockAssociated: 6
            }
        ];
        expect(result.blocks).toEqual(expectedObject);
    });

    it('invalide nc program', () => {
        const result = parseProgramText(";------NC1\nG1-TTTTTTTTTTTTT\r\nG3X150Y100CR=200", 0, 0, 1, 1);
        expect(result.errorList !== undefined).toBe(true);
        expect(result.errorList[0].error).toBe(2);
    });

    it('comment only and line feed character in the last line with letter', () => {
        const result = parseProgramText(";------ 1 --\r\n;------2--\n", 0, 0, 1, 1);
        expect(result.errorList === undefined).toBe(true);
        expect(result.blocksAsText.length).toBeGreaterThan(2);
        expect(result.blocks.length).toBe(0);
        expect(result.blocksAsText[1].ncBlockText).toEqual(';------2--');
        expect(result.blocksAsText[1].blockAssociated).toBe(1);
    });

    it('axis values out of range error', () => {
        const result = parseProgramText("G1 X=1600\n", 0, 0, 1, 1);
        expect(result.errorList !== undefined).toBe(true);
        expect(result.errorList[0].error).toBe(3);
    });

    it('interpolation radius too small', () => {
        const result = parseProgramText("G3 X=10 Y=100 CR=2\n", 0, 0, 1, 1);
        expect(result.errorList !== undefined).toBe(true);
        expect(result.errorList[0].error).toBe(4);
    });
});
