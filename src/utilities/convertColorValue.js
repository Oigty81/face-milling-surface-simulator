"use strict";

function colorValueHexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

export function colorValueHexToIntWithAlphaAndSwapRedWithBlue(hex, alpha) {
    return (alpha << 24) + (colorValueHexToRgb(hex).b << 16) + (colorValueHexToRgb(hex).g << 8) + colorValueHexToRgb(hex).r;
}
