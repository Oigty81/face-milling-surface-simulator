import { getters } from '../../../../src/store/modules/Nc/getters';

describe('store.Nc.getters', () => {
    let state1;
    beforeEach(() => {
        // mock state
        state1 = {
            ncMemory: {
                samples: [
                    { x: 0, y: 0, blockAssociated: 0 },
                    { x: 1, y: 0, blockAssociated: 0 },
                    { x: 2, y: 0, blockAssociated: 1 },
                    { x: 3, y: 0, blockAssociated: 1 },
                    { x: 4, y: 0, blockAssociated: 1 },
                    { x: 5, y: 5, blockAssociated: 1 },
                    { x: 6, y: 5, blockAssociated: 1 },
                    { x: 7, y: 10, blockAssociated: 2 },
                    { x: 8, y: 10, blockAssociated: 2 },
                ]
            },
            currentNcSamplePosition: 5
        };
    });

    it('current nc progress in percent', () => {
        const result = getters.currentNcBlockProgress(state1);
        expect(result).toBe(60);
    });
});
