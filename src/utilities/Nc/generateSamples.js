'use strict';

import {
    normalizeAngle,
    determineAngleOfStraight,
    simpleCosineLawCalculator
} from './mathHelpers';

/**
 * calculate nc-samples from the nc-blocks
 * with feed from the current block and tool blades will be definate the resolution of the samples,
 * how many points to sample to the next block
 * @param {{
 *  blocksAsText: {
 *      ncBlockText: string, blockAssociated: number
 *  }[]
 *  blocks: {
 *      g: number, x: number, y: number, cr: number, feed: number, blockAssociated: number
 *  }[]
 * }} ncBlockData - nc block list as text and object
 * @param {number} startPointX - start point in X, is necessary for calculate the first block
 * @param {number} startPointY - start point in Y, is necessary for calculate the first block
 * @param {number} toolBlades - number of blades from the milltool
 * @returns {{x: number, y: number, blockAssociated: number}[]} object with nc sample list
 */
export default function(ncBlockData, startPointX, startPointY, toolBlades) {
    toolBlades = Math.floor(toolBlades);
    if(toolBlades < 1) toolBlades = 1;
    
    const ncSampleList = [];

    let startX = startPointX;
    let startY = startPointY;
    
    for(let i = 0; i < ncBlockData.blocks.length; i++) {
        const endX = ncBlockData.blocks[i].x;
        const endY = ncBlockData.blocks[i].y;
        const cr = ncBlockData.blocks[i].cr;
        
        const dx = endX - startX;
        const dy = endY - startY;
        
        let currentFeed = ncBlockData.blocks[i].feed / toolBlades;

        // avoid division by zero
        if(currentFeed === 0) {
            currentFeed = 0.01;
        }

        // calculate G1 samples
        if(ncBlockData.blocks[i].g === 1) {
            const samples = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0)) / currentFeed;
            for(let s = 0; s < samples; s++) {
                ncSampleList.push({
                    x: startX + ((dx * s) / samples),
                    y: startY + ((dy * s) / samples),
                    blockAssociated: ncBlockData.blocks[i].blockAssociated
                });
            }
        }

        // calculate G2 or G3 samples
        if(ncBlockData.blocks[i].g === 2 || ncBlockData.blocks[i].g === 3) {
            const linearLength = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0));

            if(linearLength >= (2 * cr)) {
                return {
                    error: 1,
                    errorText: "radius too small @block ".concat(ncBlockData.blocks[i].blockAssociated.toString()),
                    ncSampleList: []
                };
            } else {
                const angleStraightStartAndEndPoint = determineAngleOfStraight(startX, startY, endX, endY);
                const gamma = simpleCosineLawCalculator(cr, linearLength);
                const bendLength = (cr * 2 * Math.PI * gamma) / 360.0;
                const samples = bendLength / currentFeed;
                
                let angleStraightAndRemainingInTriangle;
                if(ncBlockData.blocks[i].g === 2) {
                    angleStraightAndRemainingInTriangle = angleStraightStartAndEndPoint - ((180.0 - gamma) / 2.0); // for G2
                } else {
                    angleStraightAndRemainingInTriangle = angleStraightStartAndEndPoint + ((180.0 - gamma) / 2.0); // for G3
                }

                const centerOfCircleX = startX + (Math.cos(angleStraightAndRemainingInTriangle * (Math.PI / 180.0)) * cr);
                const centerOfCircleY = startY + (Math.sin(angleStraightAndRemainingInTriangle * (Math.PI / 180.0)) * cr);
                const angleForStraightToCircleCenter = normalizeAngle(180.0 + angleStraightAndRemainingInTriangle);
                
                let currentAngle;
                                
                for(let s = 0; s < samples; s++) {
                    if(ncBlockData.blocks[i].g === 2) {
                        currentAngle = normalizeAngle(angleForStraightToCircleCenter - ((gamma * s) / samples)); // for G2
                    } else {
                        currentAngle = normalizeAngle(angleForStraightToCircleCenter + ((gamma * s) / samples)); // for G3
                    }
                    
                    const outX = centerOfCircleX + (Math.cos(currentAngle * (Math.PI / 180.0)) * cr);
                    const outY = centerOfCircleY + (Math.sin(currentAngle * (Math.PI / 180.0)) * cr);
                    
                    ncSampleList.push({
                        x: outX,
                        y: outY,
                        blockAssociated: ncBlockData.blocks[i].blockAssociated
                    });
                }
            }
        }

        // next startpoint
        startX = ncBlockData.blocks[i].x;
        startY = ncBlockData.blocks[i].y;
    }

    return {
        error: 0,
        errorText: "",
        ncSampleList: ncSampleList
    };
}
