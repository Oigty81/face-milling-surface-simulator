#include <time.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

#include "renderCore.h"

/*
** HTMLElement canvas id
*/
char G_canvasId[64];

/*
** global pointer and variables 
*/
char* G_ptrToCanvas = NULL;
char* G_bitmapOriginal = NULL;
char* G_bitmapMillingTrack = NULL;

int G_imageWidth;
int G_imageHeight;
int G_bitmapWidth;
int G_bitmapHeight;
int G_bitmapStride;

/*
** release the memory for all image/bitmap layer and renderCore module
*/
int EMSCRIPTEN_KEEPALIVE DeallocateNativeMemory() {
    
  RenderCoreDestroy();

  if(G_ptrToCanvas != NULL) {
    free(G_ptrToCanvas); 
    G_ptrToCanvas = NULL;
  } 

  if(G_bitmapOriginal != NULL) {
    free(G_bitmapOriginal); 
    G_bitmapOriginal = NULL;
  } 

   if(G_bitmapMillingTrack != NULL) {
    free(G_bitmapMillingTrack); 
    G_bitmapMillingTrack = NULL;
  } 

  return 0;
}

/*
** create a new render object with initial parameters
*/
int EMSCRIPTEN_KEEPALIVE CreateRenderObject(
  char* canvasId,
  int imageWidth,
  int imageHeight,
  char* buffer,
  int width,
  int height,
  int toolDiameter,
  int toolColor,
  int lineColor, 
  int roughnessColor,
  int strokeWidth,
  int touchedColor
  ) {

  DeallocateNativeMemory();

  RenderCoreInitialize(toolDiameter, toolColor, lineColor, roughnessColor, strokeWidth, touchedColor);

  strcpy(G_canvasId, canvasId);
  
  G_imageWidth = imageWidth;
  G_imageHeight = imageHeight;

  G_ptrToCanvas = buffer;

  G_bitmapWidth = width;
  G_bitmapHeight = height;
  G_bitmapStride = width * 4; // just nessecary for compatiblity to "renderCore" module
  
  G_bitmapOriginal = (char*) malloc(sizeof(char)* width*height*4);
  if(G_bitmapOriginal == NULL) return -1;
  G_bitmapMillingTrack = (char*) malloc(sizeof(char)* width*height*4);
  if(G_bitmapMillingTrack == NULL) return -1;
 
  // copy memory from canvas data to native module 
  memcpy(G_bitmapOriginal, G_ptrToCanvas, (G_bitmapWidth * G_bitmapHeight * 4));

  memcpy(G_bitmapMillingTrack, G_bitmapOriginal, (G_bitmapWidth*G_bitmapHeight * 4));
    
  return 1001;
}

/*
** reset the current image to the original pure image
*/
void EMSCRIPTEN_KEEPALIVE ResetRenderObject() {

    if(G_bitmapOriginal != NULL && G_bitmapMillingTrack != NULL) {
         memcpy(G_bitmapMillingTrack, G_bitmapOriginal, (G_bitmapWidth*G_bitmapHeight * 4));
    }
}

/*
** draw the roughness lines and center line
*/
void EMSCRIPTEN_KEEPALIVE DrawRoughnessToRenderObject(int x, int y, char option) {
  RenderCoreDraw(G_bitmapMillingTrack, G_bitmapWidth, G_bitmapHeight, G_bitmapStride, x, y, option);
}

/*
** update the canvas image / draw mill-tool optional 
*/
int EMSCRIPTEN_KEEPALIVE SetRenderObject(
    char switchMillTool,
    int x,
    int y,
    double normalizedZoom,
    double zoomFactor
  ) {
  if(G_bitmapOriginal != NULL && G_bitmapMillingTrack != NULL) {
    // copy memory from native module to canvas data
    memcpy(G_ptrToCanvas, G_bitmapMillingTrack, (G_bitmapWidth * G_bitmapHeight * 4));

    if(switchMillTool) {
      RenderCoreDrawMill(G_ptrToCanvas, G_bitmapWidth, G_bitmapHeight, G_bitmapStride, x, y);
    }
    
    if(zoomFactor > 5.0)  {
      zoomFactor = 5.0;
    }

    if(zoomFactor < 0.1)  {
      zoomFactor = 0.1;
    }
 
    EM_ASM({
      let data = Module.HEAPU8.slice($0, $0 + $1 * $2 * 4);
      
      // --- canvas helper element, not include in the DOM 
      let cHelper = document.createElement('canvas');
      let ctxHelper = cHelper.getContext('2d');
     
      let cMain = document.getElementById('' + UTF8ToString($4));
      let ctxMain = cMain.getContext('2d');
      
      ctxHelper.canvas.width  = $1;
      ctxHelper.canvas.height = $2;
      
      let imageData = ctxHelper.getImageData(0, 0, $1, $2);
      imageData.data.set(data);

      ctxHelper.putImageData(imageData, 0, 0);
     
      ctxMain.canvas.width = $5 * $7 * $3;
      ctxMain.canvas.height = $6 * $7 * $3;

      ctxMain.drawImage(cHelper, 0, 0, ctxHelper.canvas.width, ctxHelper.canvas.height, 0, 0, ctxMain.canvas.width, ctxMain.canvas.height);
    }, G_ptrToCanvas, G_bitmapWidth, G_bitmapHeight, zoomFactor,  (char* ) G_canvasId, G_imageWidth, G_imageHeight, normalizedZoom);

    return 1002;
  }
  return -2;
}

/*
** the main function, as dummy function, call automatical when WASM-Modul initialize in JavaScript
*/
int EMSCRIPTEN_KEEPALIVE main() {
  return 0;
}


