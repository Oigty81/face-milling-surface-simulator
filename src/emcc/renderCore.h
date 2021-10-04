#ifndef __RENDER_CORE__
#define __RENDER_CORE__

#ifdef __cplusplus
extern "C" {
#endif

int RenderCoreInitialize(int toolDiameter, int toolColor, int lineColor, int roughnessColor, int strokeWidth, int touchedColor);
void RenderCoreDestroy();
int  RenderCorePointerStatus();

void RenderCoreDraw(unsigned char* bitmap, int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y, char option);
void RenderCoreDrawMill(unsigned char* bitmap, int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y);

#ifdef __cplusplus
} /* extern "C" */
#endif

#endif 
