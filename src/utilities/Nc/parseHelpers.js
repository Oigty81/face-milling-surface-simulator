'use strict';

import {
    normalizeAngle,
    senseOfRotation,
    determineAngleOfStraight,
    simpleCosineLawCalculator,
    compareValuesWithDeviationTolerance,
    determineVectorAngle,
    calculateChordReverse180
} from './mathHelpers';

/**
 * split nc program text in lines by line feed character
 * @param {string} ncProgramText - source nc program text
 * @return {string[]} nc program lines
 */
export function lineSplitter(ncProgramText) {
    const lines = ncProgramText.split('\n');
    const outLines = [];
    if(lines !== undefined && lines.length > 0) {
        lines.forEach(l => {
            outLines.push(
                l.replace("\r", "")
            );
        });
        return outLines;
    } else {
        return undefined;
    }
}

/**
 * parse and validate nc block text and generate nc block object
 * @param {string} ncBlockText - nc program line
 * @return {{
 *              error: number,
 *              errorText: string,
 *              insignificantLine: boolean,
 *              ncBlock: { g: number, x: number, y: number, cr: number, tr: number, feed: number },
 *          }}
 */
export function validateNcBlockText(ncBlockText) {
    const linePattern = new RegExp(
        `^` +
        `(N\\d{1,5})?\\s*` +
        `(G[=]?\\s?\\d{1,5})?\\s*` +
        `(X[=]?\\s?[-]?\\d*\\.?\\d*)?\\s*` +
        `(Y[=]?\\s?[-]?\\d*\\.?\\d*)?\\s*` +
        `(Z[=]?\\s?[-]?\\d*\\.?\\d*)?\\s*` +
        `(CR=\\s?\\d*\\.?\\d*)?\\s*` +
        `(TR=\\s?\\d*\\.?\\d*)?\\s*` +
        `(F[=]?\\s?\\d*\\.?\\d*)?\\s*` +
        `(;.*)?\\s*` +
        `$`
    );
    
    const gPattern = new RegExp(`^((G[=]?\\s?)(\\d{1,5}))+$`);
    let gValue;
    const xPattern = new RegExp(`^((X[=]?\\s?)([-]?\\d*\\.?\\d*))+$`);
    let xValue;
    const yPattern = new RegExp(`^((Y[=]?\\s?)([-]?\\d*\\.?\\d*))+$`);
    let yValue;
    const crPattern = new RegExp(`^((CR=\\s?)(\\d*\\.?\\d*))+$`);
    let crValue;
    const trPattern = new RegExp(`^((TR=\\s?)(\\d*\\.?\\d*))+$`);
    let trValue;
    const fPattern = new RegExp(`^((F[=]?\\s?)(\\d*\\.?\\d*))+$`);
    let fValue;
    
    const linePatternMatch = linePattern.exec(ncBlockText.toUpperCase());

    if(linePatternMatch !== null && linePatternMatch.length > 0) {
        linePatternMatch.forEach(lpm => {
            let temp;
            
            temp = gPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                gValue = parseFloat(temp[3]);
            }
            
            temp = xPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                xValue = parseFloat(temp[3]);
            }
            
            temp = yPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                yValue = parseFloat(temp[3]);
            }
            
            temp = crPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                crValue = parseFloat(temp[3]);
            }
            
            temp = trPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                trValue = parseFloat(temp[3]);
            }
            
            temp = fPattern.exec(lpm);
            if(temp !== null && temp.length > 3) {
                fValue = parseFloat(temp[3]);
            }
        });
    } else {
        return {
            error: 1,
            errorText: 'parsing fault!',
            insignificantLine: undefined,
            ncBlock: undefined,
        };
    }
    
    if(gValue === undefined && xValue === undefined &&
        yValue === undefined && crValue === undefined &&
        trValue === undefined && fValue === undefined) {
            return {
                error: 0,
                errorText: '',
                insignificantLine: true,
                ncBlock: undefined,
            };
    }

    if(gValue === undefined) {
        return {
            error: 2,
            errorText: 'G-Code undefined!',
            insignificantLine: undefined,
            ncBlock: undefined,
        };
    }

    if(gValue < 0 || gValue > 3) {
        return {
            error: 3,
            errorText: 'G-Code must have a value 1, 2 or 3',
            insignificantLine: undefined,
            ncBlock: undefined,
        };
    }

    if(gValue === 1) {
        if(xValue !== undefined || yValue !== undefined) {
            return {
                error: 0,
                errorText: '',
                insignificantLine: false,
                ncBlock: { g: gValue, x: xValue, y: yValue, cr: undefined, tr: trValue, feed: fValue },
            };
        } else {
            return {
                error: 4,
                errorText: 'x or y axis must define',
                insignificantLine: undefined,
                ncBlock: undefined,
            };
        }
    }

    if(gValue === 2 || gValue === 3) {
        if((xValue !== undefined || yValue !== undefined) && crValue !== undefined) {
            return {
                error: 0,
                errorText: '',
                insignificantLine: false,
                ncBlock: { g: gValue, x: xValue, y: yValue, cr: crValue, tr: trValue, feed: fValue },
            };
        } else {
            return {
                error: 5,
                errorText: 'x or y axis and radius must define',
                insignificantLine: undefined,
                ncBlock: undefined,
            };
        }
    }
}

/**
 * check the value limit for nc-parameters
 * @param {{ g: number, x: number, y: number, cr: number, tr: number, feed: number, blockAssociated: number }} ncblock -
 * @param {number} limitForX - absolute max value for x parameter
 * @param {number} limitForY - absolute max value for y parameter
 * @param {number} limitForCR - positive max value for cr parameter
 * @param {number} limitForTR - positive max value for tr parameter
 * @param {number} limitForFeed - positive max value for feed parameter
* @return {{error: number, errorText: string }} - error = 0 -> all values ok | error > 0  -> values out of range
 */
export function checkNcScopeLimit(ncblock, limitForX, limitForY, limitForCR, limitForTR, limitForFeed) {
    if(ncblock !== undefined && ncblock.x !== undefined && ncblock.y !== undefined &&
        ncblock.cr !== undefined && ncblock.tr !== undefined && ncblock.feed !== undefined) {
            if(Math.abs(ncblock.x) > limitForX) {
                return {
                    error: 2,
                    errorText: 'nc scope limit "X" value is out of range (max value is +/- '.concat(limitForX.toString()).concat(')')
                };
            } else if (Math.abs(ncblock.y) > limitForY) {
                return {
                    error: 3,
                    errorText: 'nc scope limit "Y" value is out of range (max value is +/- '.concat(limitForY.toString()).concat(')')
                };
            } else if (ncblock.cr > limitForCR || ncblock.cr < 0) {
                return {
                    error: 4,
                    errorText: 'nc scope limit "CR" value is out of range (min value is 0 and max value is +/- '.concat(limitForCR.toString()).concat(')')
                };
            } else if (ncblock.tr > limitForTR || ncblock.tr < 0) {
                return {
                    error: 5,
                    errorText: 'nc scope limit "TR" value is out of range (min value is 0 and max value is +/- '.concat(limitForTR.toString()).concat(')')
                };
            } else if (ncblock.feed > limitForFeed || ncblock.feed < 0) {
                return {
                    error: 6,
                    errorText: 'nc scope limit "Feed" value is out of range (min value is 0 andmax value is '.concat(limitForFeed.toString()).concat(')')
                };
            } else {
                return {
                    error: 0,
                    errorText: ''
                };
            }
    } else {
        return {
            error: 1,
            errorText: 'checkNcScopeLimit() invalidate raw nc block'
        };
    }
}

/**
 * return radius ok or error "radius too small" with blocknumber in text
 * @param {*} ncBlockList -
 * @param {number} startPointX - start point in X, is necessary for calculate the first block
 * @param {number} startPointY - start point in X, is necessary for calculate the first block
 * @return {{error: number, errorText: string }} - error = 0 -> radius OK | error = 1 -> radius too small
 */
export function precheckCircularInterpolationFaults(ncBlockList, startPointX, startPointY) {
    let currentX = startPointX;
    let currentY = startPointY;
    let error = 0;
    let errorText = '';
    
    ncBlockList.forEach(b => {
        if(b.g === 2 || b.g === 3) {
            const dx = b.x - currentX;
            const dy = b.y - currentY;
            const linearLength = Math.sqrt(Math.pow(dx, 2.0) + Math.pow(dy, 2.0));

            if(linearLength >= (2 * b.cr)) {
                error = 1;
                errorText = "radius too small @block ".concat(b.blockAssociated.toString());
            }
        }
        currentX = b.x;
        currentY = b.y;
    });

    return {
        error: error,
        errorText: errorText
    };
}

/**
 * add transition radius between nc blocks, if define
 * @param {{ g: number, x: number, y: number, cr: number, tr: number, feed: number, blockAssociated: number }[]} preNcBlockList - pre nc block object-list with "tr"-parameter
 * @param {number} startPointX - start point in X, is necessary for calculate the first block
 * @param {number} startPointY - start point in X, is necessary for calculate the first block
 * @return {
 * { g: number, x: number, y: number, cr: number, feed: number, blockAssociated: number }[]
 * } nc block object-list
 */
export function addTransitionRadius(preNcBlockList, startPointX, startPointY) {
    const SAMPLES_STEP = 16; // samples step distance (a smaller value means a more precise approximation)
    const COMPARE_TOLERANCE = 0.5; // compare-tolerance for match potential chord length and real chord length

    const destNcBlockList = [];
    const errorList = [];

    if(preNcBlockList.length === 0) {
        errorList.push({
            error: 99,
            errorText: 'empty block list'
        });
        return errorList[0];
    }

    let directionRadius;
    let startX, startY, inflexionX, inflexionY, endX, endY;
    let radius1, dx1, dy1, length1, bendLength1, mx1, my1;
    let radius2, dx2, dy2, length2, bendLength2, mx2, my2;
    let maxSamples, maxSamples1, maxSamples2;

    let alpha1, alpha11, alpha21, gamma1;
    let p1Ka1, curAngle1;
    let alpha2, alpha12, alpha22, gamma2;
    let p1Ka2, curAngle2;
 
    let tangentAngle;
 
    let curX1, curY1, curX2, curY2;
    let chordLengthA, chordLengthB, chordMatch;

    // first start point
    startX = startPointX;
    startY = startPointY;

    // main loop
    for(let i = 0; i < preNcBlockList.length; i++) {
        // for the last nc block
        if((i + 1) === preNcBlockList.length) {
            destNcBlockList.push({
                g: preNcBlockList[i].g,
                x: preNcBlockList[i].x,
                y: preNcBlockList[i].y,
                cr: preNcBlockList[i].cr,
                feed: preNcBlockList[i].feed,
                blockAssociated: preNcBlockList[i].blockAssociated
            });
            break;
        }

        // inflexion point and end point for this pass
        inflexionX = preNcBlockList[i].x;
        inflexionY = preNcBlockList[i].y;
        endX = preNcBlockList[i + 1].x;
        endY = preNcBlockList[i + 1].y;

        // determine the direction of rotation of the radius for the interpolation block
        // returns 1 -> no new block necessary
        // returns 2 or 3 for G2 or G3
        directionRadius = senseOfRotation(startX, startY, inflexionX, inflexionY, endX, endY);

        // determine interpolation parameter for the first block
        if(preNcBlockList[i].g === 1) { // for G1
            dx1 = inflexionX - startX;
            dy1 = inflexionY - startY;
            length1 = Math.sqrt(Math.pow(dx1, 2.0) + Math.pow(dy1, 2.0));
            maxSamples1 = length1 / SAMPLES_STEP;
        }

        if(preNcBlockList[i].g === 2 || preNcBlockList[i].g === 3) { // for G2 and G3
            radius1 = preNcBlockList[i].cr;
            dx1 = inflexionX - startX;
            dy1 = inflexionY - startY;
      
            alpha1 = determineAngleOfStraight(startX, startY, inflexionX, inflexionY);
 
            length1 = Math.sqrt(Math.pow(dx1, 2.0) + Math.pow(dy1, 2.0));
 
            gamma1 = simpleCosineLawCalculator(radius1, length1);
            alpha11 = (180 - gamma1) / 2.0;
       
            if(preNcBlockList[i].g === 2) {
                alpha21 = alpha1 - alpha11; // for G2
            } else {
                alpha21 = alpha1 + alpha11; // for G3
            }
               
            mx1 = startX + (Math.cos(alpha21 * (Math.PI / 180.0)) * radius1);
            my1 = startY + (Math.sin(alpha21 * (Math.PI / 180.0)) * radius1);
            bendLength1 = (radius1 * 2 * Math.PI * gamma1) / 360.0;
            maxSamples1 = bendLength1 / SAMPLES_STEP;
            p1Ka1 = normalizeAngle(180 + alpha21);
        }

        // determine interpolation parameter for the second block
        if(preNcBlockList[i + 1].g === 1) { // for G1
            dx2 = endX - inflexionX;
            dy2 = endY - inflexionY;
            length2 = Math.sqrt(Math.pow(dx2, 2.0) + Math.pow(dy2, 2.0));
            maxSamples2 = length2 / SAMPLES_STEP;
        }

        if(preNcBlockList[i + 1].g === 2 || preNcBlockList[i + 1].g === 3) { // for G2 and G3
            radius2 = preNcBlockList[i + 1].cr;
            dx2 = endX - inflexionX;
            dy2 = endY - inflexionY;
      
            alpha2 = determineAngleOfStraight(inflexionX, inflexionY, endX, endY);
 
            length2 = Math.sqrt(Math.pow(dx2, 2.0) + Math.pow(dy2, 2.0));
 
            gamma2 = simpleCosineLawCalculator(radius2, length2);
            alpha12 = (180 - gamma2) / 2.0;
       
            if(preNcBlockList[i + 1].g === 2) {
                alpha22 = alpha2 - alpha12; // for G2
            } else {
                alpha22 = alpha2 + alpha12; // for G3
            }
               
            mx2 = inflexionX + (Math.cos(alpha22 * (Math.PI / 180.0)) * radius2);
            my2 = inflexionY + (Math.sin(alpha22 * (Math.PI / 180.0)) * radius2);
            bendLength2 = (radius2 * 2 * Math.PI * gamma2) / 360.0;
            maxSamples2 = bendLength2 / SAMPLES_STEP;
            p1Ka2 = normalizeAngle(180 + alpha22);
        }

        // determine max samples
        if(maxSamples2 >= maxSamples1) {
            maxSamples = maxSamples1;
        } else {
            maxSamples = maxSamples2;
        }

        // expected no match for transition radius (tr = 0, samples < 5 or directionRadius = 1)
        if(preNcBlockList[i].tr === 0 || maxSamples < 0.5 || directionRadius === 1) {
            destNcBlockList.push({
                g: preNcBlockList[i].g,
                x: preNcBlockList[i].x,
                y: preNcBlockList[i].y,
                cr: preNcBlockList[i].cr,
                feed: preNcBlockList[i].feed,
                blockAssociated: preNcBlockList[i].blockAssociated
            });
            startX = preNcBlockList[i].x;
            startY = preNcBlockList[i].y;
            continue; // continue main loop
        }

        // approximation and comparison:
        // chord length circle of both current tangent angles with length between the current points
        chordMatch = 0;

        //note: for "j"-variable -> better start at a slightly higher value, to avoid 0 values of the resulting values!!!
        // inner loop
        for(let j = 0.025; j < maxSamples; j += 0.025) {
            // calculate current position of straight line (tangent 1)
            if(preNcBlockList[i].g === 1) {
                curX1 = startX + ((dx1 * (maxSamples1 - j)) / maxSamples1);
                curY1 = startY + ((dy1 * (maxSamples1 - j)) / maxSamples1);
            }

            if(preNcBlockList[i].g === 2 || preNcBlockList[i].g === 3) {
                if(preNcBlockList[i].g === 2) {
                    curAngle1 = normalizeAngle(p1Ka1 - ((gamma1 * (maxSamples1 - j)) / maxSamples1)); // for G2
                } else {
                    curAngle1 = normalizeAngle(p1Ka1 + ((gamma1 * (maxSamples1 - j)) / maxSamples1)); // for G3
                }

                curX1 = mx1 + (Math.cos(curAngle1 * (Math.PI / 180.0)) * radius1);
                curY1 = my1 + (Math.sin(curAngle1 * (Math.PI / 180.0)) * radius1);
            }

            // calculate current position of straight line (tangent 2)
            if(preNcBlockList[i + 1].g === 1) {
                curX2 = inflexionX + ((dx2 * j) / maxSamples2);
                curY2 = inflexionY + ((dy2 * j) / maxSamples2);
            }

            if(preNcBlockList[i + 1].g === 2 || preNcBlockList[i + 1].g === 3) {
                if(preNcBlockList[i + 1].g === 2) {
                    curAngle2 = normalizeAngle(p1Ka2 - ((gamma2 * j) / maxSamples2)); // for G2
                } else {
                    curAngle2 = normalizeAngle(p1Ka2 + ((gamma2 * j) / maxSamples2)); // for G3
                }

                curX2 = mx2 + (Math.cos(curAngle2 * (Math.PI / 180.0)) * radius2);
                curY2 = my2 + (Math.sin(curAngle2 * (Math.PI / 180.0)) * radius2);
            }

            // stop approach at 25% of the scanning length
            if(j > maxSamples / 4) {
                break;
            }

            // calculate the angle between the two tangents //TODO: calculate once before loop begin
            tangentAngle = determineVectorAngle(inflexionX, inflexionY, curX1, curY1, curX2, curY2);

            // calculate potential chord length
            chordLengthA = Math.sqrt(Math.pow(curX1 - curX2, 2.0) + Math.pow(curY1 - curY2, 2.0));

            // calculate the real length of the chord  //TODO: calculate once before loop begin
            chordLengthB = calculateChordReverse180(preNcBlockList[i].tr, tangentAngle);

            // compare the length of the potential chord length and the real chord length
            chordMatch = compareValuesWithDeviationTolerance(chordLengthA, chordLengthB, COMPARE_TOLERANCE);

            if(chordMatch === 1) {
                break;
            }
        } // end inner loop

        // group new nc blocks
        // transitions radius in the area, the given pitch circle moves to the next point
        // transitions radius is not in the range, the max possible radius moves the given pitch circle to the next point
        // ----- Block 1
        destNcBlockList.push({
            g: preNcBlockList[i].g,
            x: curX1,
            y: curY1,
            cr: preNcBlockList[i].cr,
            feed: preNcBlockList[i].feed,
            blockAssociated: preNcBlockList[i].blockAssociated
        });
        // ----- Block 2
        const newCr = (chordLengthA / (2.0 * Math.sin(((180.0 - tangentAngle) / 2.0) * (Math.PI / 180.0))) * 1.1);
                
        destNcBlockList.push({
            g: directionRadius,
            x: curX2,
            y: curY2,
            cr: newCr,
            feed: preNcBlockList[i].feed,
            blockAssociated: preNcBlockList[i].blockAssociated
        });

        // next start point
        startX = preNcBlockList[i].x;
        startY = preNcBlockList[i].y;
    } // end main loop

    if(errorList.length > 0) {
        return errorList[0];
    } else {
        return destNcBlockList;
    }
}
