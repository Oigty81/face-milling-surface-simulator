'use strict';

/**
 * normalize degree value from angle.
 * @param {number} a - angle value
 */
export function normalizeAngle(a) {
    while((!(a < 360)) || (a < 0)) {
        if(!(a < 360)) {
            a -= 360;
        }
        if(a < 0) {
            a += 360;
        }
    }
    return a;
}

/**
 * determine angle of straight between point(x1, y1) and (point(x2, y2)
 * @param {number} x1 - point1 x
 * @param {number} y1 - point1 y
 * @param {number} x2 - point2 x
 * @param {number} y2 - point2 y
 * @returns {number} angle of straight
 */
export function determineAngleOfStraight(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    // irregular
    if((dx === 0) && (dy === 0)) {
        return 0;
    }

    // for 0 degree
    if((dx > 0) && (dy === 0)) {
        return 0;
    }

    // for 90 degree
    if((dx === 0) && (dy > 0)) {
        return 90;
    }
 
    // for 180 degree
    if((dx < 0) && (dy === 0)) {
        return 180;
    }
    
    // for 270 degree
    if((dx === 0) && (dy < 0)) {
        return 270;
    }

    // for greater than 0 degree and less than 90 degree
    if((dx > 0) && (dy > 0)) {
        return Math.atan(dy / dx) / (Math.PI / 180.0);
    }

    // for greater than 90 degree and less than 180 degree
    if((dx < 0) && (dy > 0)) {
        return 180 + (Math.atan(dy / dx) / (Math.PI / 180.0));
    }

    // for greater than 180 degree and less than 270 degree
    if((dx < 0) && (dy < 0)) {
        return 180 + (Math.atan(dy / dx) / (Math.PI / 180.0));
    }

    // for greater than 270 degree and less than 360 degree
    if((dx > 0) && (dy < 0)) {
        return 360 + (Math.atan(dy / dx) / (Math.PI / 180.0));
    }
}

/**
 * simple cosine law calculator to calculate the opposite angle (gamma) for
 * straight between P1 and P2 to the radius (triangle arms)
 * @param {number} radiusArms - quasi triangle side A and B
 * @param {number} straightLength - quasi triangle side C
 * @returns {number} opposite angle (gamma)
 */
export function simpleCosineLawCalculator(radiusArms, straightLength) {
    if(straightLength >= radiusArms * 2) {
        throw new Error("error: straightLength >= radiusArms * 2");
    }
    const counter = Math.pow(radiusArms, 2.0) + Math.pow(radiusArms, 2.0) - Math.pow(straightLength, 2.0);
    const denominator = 2 * Math.pow(radiusArms, 2.0);
    return Math.acos(counter / denominator) / (Math.PI / 180.0);
}

/**
 * find sense of rotation between two vectors
 * @param {number} x1 - vector 1 start x
 * @param {number} y1 - vector 1 start y
 * @param {number} x2 - vector 1 end x, vector 2 start x
 * @param {number} y2 - vector 1 end y, vector 2 start y
 * @param {number} x3 - vector 2 end x
 * @param {number} y3 - vector 2 end y
 * @returns {number} direction: (3) = anti-clockwise, (2) = clockwise, (1) = no sense of rotation
 */
export function senseOfRotation(x1, y1, x2, y2, x3, y3) {
    const v1x = x1 - x2;
    const v1y = y1 - y2;
    const v2x = x2 - x3;
    const v2y = y2 - y3;

    const orient = (v1x * v2y) - (v1y * v2x);

    let direction;

    if(orient > 0.0) {
        direction = 3;
    }
    if(orient < 0.0) {
        direction = 2;
    }
    if(orient === 0.0) {
        direction = 1;
    }
    return direction;
}

/**
 * compare two values with deviation tolerance
 * @param {number} value1 - value 1 to compare
 * @param {number} value2 - value 2 to compare
 * @param {number} tolerance - tolerance for compare
 * @returns {number} (1) is meaning | (0) is meaning
 */
export function compareValuesWithDeviationTolerance(value1, value2, tolerance) {
    const value1Min = value1 - Math.abs(tolerance);
    const value1Max = value1 + Math.abs(tolerance);
    
    if((value1Min < value2) && (value1Max > value2)) {
        return 1;
    } else {
        return 0;
    }
}

/**
 * determine interior angle between two vectors
 * @param {number} px - start point x of both vectors
 * @param {number} py - start point y of both vectors
 * @param {number} v1x - end point x vector 1
 * @param {number} v1y - end point y vector 1
 * @param {number} v2x - end point x vector 2
 * @param {number} v2y - end point y vector 2
 * @returns {number} interior angle
 */
export function determineVectorAngle(px, py, v1x, v1y, v2x, v2y) {
    const x1 = px - v1x;
    const y1 = py - v1y;
    const x2 = px - v2x;
    const y2 = py - v2y;
    
    if(((x1 === 0) && (y1 === 0)) || ((x2 === 0) && (y2 === 0))) {
        return 0.0;
    }
    
    const g = (
        ((x1 * x2) + (y1 * y2)) / (Math.sqrt(Math.pow(x1, 2.0) + Math.pow(y1, 2.0)) * Math.sqrt(Math.pow(x2, 2.0) + Math.pow(y2, 2.0)))
    );

    return Math.acos(g) / (Math.PI / 180.0);
}

/**
 * calculate chord (reverse -180 degree)
 * @param {number} radius - radius of circle
 * @param {number} chordAngle - angle for chord
 */
export function calculateChordReverse180(radius, chordAngle) {
    return (
        2 * radius * Math.sin(((180.0 - chordAngle) / 2.0) * (Math.PI / 180.0))
    );
}
