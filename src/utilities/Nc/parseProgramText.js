'use strict';

import {
    lineSplitter,
    validateNcBlockText,
    checkNcScopeLimit,
    precheckCircularInterpolationFaults,
    addTransitionRadius
} from './parseHelpers';

/**
 * parse nc program text string, validate it
 * generate nc blocks as text and nc object-list
 * @param {string} ncProgramText - nc program text from file or any source
 * @param {number} startPointX - start point in X, is necessary for calculate the first block
 * @param {number} startPointY - start point in Y, is necessary for calculate the first block
 * @param {number} defaultTR - is necessary for calculate default trasition radius
 * @param {number} defaultFeed - is necessary, if no feed in the nc program is specified
 * @return {{
 *  blocksAsText: {
 *      ncBlockText: string, blockAssociated: number
 *  }[]
 *  blocks: {
 *      g: number, x: number, y: number, cr: number, feed: number, blockAssociated: number
 *  }[]
 * }} nc block list as text and object
 */
export default function(ncProgramText, startPointX, startPointY, defaultTR, defaultFeed) {
    const ncProgramTextLines = lineSplitter(ncProgramText);
    const blocksAsText = [];
    const blocksRaw = [];
    let blocks = [];

    let currentX = startPointX;
    let currentY = startPointY;
    let currentCR = 0;
    let currentTR = defaultTR;
    let currentFeed = defaultFeed;

    const errorList = [];
    
    if(ncProgramTextLines !== undefined && ncProgramTextLines.length > 0) {
        ncProgramTextLines.forEach((ncBlockText, index) => {
            const ncBlockRaw = validateNcBlockText(ncBlockText);
            
            if(ncBlockRaw.error === 0) {
                blocksAsText.push({
                    ncBlockText: ncBlockText,
                    blockAssociated: index
                });
                if(ncBlockRaw.insignificantLine === false) {
                    if(ncBlockRaw.ncBlock.x !== undefined) {
                        currentX = ncBlockRaw.ncBlock.x;
                    }

                    if(ncBlockRaw.ncBlock.y !== undefined) {
                        currentY = ncBlockRaw.ncBlock.y;
                    }

                    if(ncBlockRaw.ncBlock.g === 2 || ncBlockRaw.ncBlock.g === 3) {
                        currentCR = ncBlockRaw.ncBlock.cr;
                    } else {
                        currentCR = 0;
                    }

                    if(ncBlockRaw.ncBlock.tr !== undefined) {
                        currentTR = ncBlockRaw.ncBlock.tr;
                    }

                    if(ncBlockRaw.ncBlock.feed !== undefined) {
                        currentFeed = ncBlockRaw.ncBlock.feed;
                    }
                    
                    blocksRaw.push({
                        g: ncBlockRaw.ncBlock.g,
                        x: currentX,
                        y: currentY,
                        cr: currentCR,
                        tr: currentTR,
                        feed: currentFeed,
                        blockAssociated: index
                    });
                }
           } else {
                errorList.push({
                    error: 2,
                    errorText: 'validate nc block error @block '.concat((index + 1).toString()).concat('  ').concat(ncBlockRaw.errorText)
                });
           }
        });

        if(errorList.length > 0) {
            return { errorList: errorList };
        }
    
        blocksRaw.forEach(b => {
            const result = checkNcScopeLimit(b, 1000, 1000, 1000, 100, 100);
            if(result.error > 0) {
                errorList.push({
                    error: 3,
                    errorText: ''.concat(result.errorText).concat(' @block ').concat(b.blockAssociated.toString())
                });
            }
        });

        if(errorList.length > 0) {
            return { errorList: errorList };
        }

        const resultPrecheckCircularInterpolationFaults = precheckCircularInterpolationFaults(blocksRaw, startPointX, startPointY);
        if(resultPrecheckCircularInterpolationFaults.error > 0) {
            errorList.push({
                error: 4,
                errorText: ''.concat(resultPrecheckCircularInterpolationFaults.errorText)
            });
        }

        if(errorList.length > 0) {
            return { errorList: errorList };
        }
        if(blocksRaw.length > 0) {
            blocks = addTransitionRadius(blocksRaw, startPointX, startPointY);
        } else {
            blocks = blocksRaw;
        }
        
        if(blocks.error !== undefined && blocks.errorText !== undefined) {
            errorList.push({
                error: 5,
                errorText: ''.concat(blocks.errorText)
            });
        } else {
            // no parse and precheck errors --> output block as text-list and blocks object-list
            return {
                blocksAsText: blocksAsText,
                blocks: blocks
            };
        }

        if(errorList.length > 0) {
            return { errorList: errorList };
        }
    } else {
        return {
            errorList: [{
                    error: 1,
                    errorText: 'no nc programm text found!',
                }]
        };
    }
}
