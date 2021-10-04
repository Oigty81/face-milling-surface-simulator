export const getters = {
    ncLoadAndInitialize: state => state.ncLoadAndInitialize,
    ncRun: state => state.ncRun,
    currentNcSamplePosition: state => state.currentNcSamplePosition,
    currentNcPosition: state => {
        if(state.ncMemory !== undefined && state.ncMemory.samples !== undefined && state.ncMemory.samples.length > 0) {
            const s = state.ncMemory.samples[state.currentNcSamplePosition];
            return {
                x: s.x,
                y: s.y
            };
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    },
    blocksAsTextList: state => {
        if(state.ncMemory !== undefined && state.ncMemory.blocksAsText !== undefined && state.ncMemory.blocksAsText.length > 0) {
            return state.ncMemory.blocksAsText;
        } else {
            return [{
                ncBlockText: "; - *** empty ***",
                blockAssociated: 0
            }];
        }
    },
    currentNcBlock: state => {
        if(state.ncMemory !== undefined && state.ncMemory.samples !== undefined && state.ncMemory.samples.length > 0) {
            const s = state.ncMemory.samples[state.currentNcSamplePosition];
            return s.blockAssociated;
        } else {
            return 0;
        }
    },
    currentNcBlockProgress: state => {
        if(state.ncMemory !== undefined && state.ncMemory.samples !== undefined && state.ncMemory.samples.length > 0) {
            const currentBlockAssociated = state.ncMemory.samples[state.currentNcSamplePosition].blockAssociated;
            if(currentBlockAssociated !== undefined) {
                let samplesBlockAssociatedAppearFirst = false;
                let samplesBlockAssociatedFirstIndex = 0;
                let numberOfSamplesBlockAssociated = 0;
                state.ncMemory.samples.forEach((s, i) => {
                    if(s.blockAssociated === currentBlockAssociated) {
                        numberOfSamplesBlockAssociated++;
                        if(samplesBlockAssociatedAppearFirst === false) {
                            samplesBlockAssociatedFirstIndex = i;
                            samplesBlockAssociatedAppearFirst = true;
                        }
                    }
                });
                const currentSamplePositionInBlock = state.currentNcSamplePosition - samplesBlockAssociatedFirstIndex;
                
                if(numberOfSamplesBlockAssociated < 1) {
                    return 0;
                }

                return (currentSamplePositionInBlock * 100.0) / numberOfSamplesBlockAssociated;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    },
};
