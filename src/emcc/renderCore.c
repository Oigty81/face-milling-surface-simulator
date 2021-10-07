#include <memory.h>
#include <stdlib.h>
#include <math.h>

#include "RenderCore.h"

/*
** structure of horizontal line informations for the circle sprites
*/
typedef struct {
	int xStart;
	int xEnd;
} HLINES;

/*
** for calculate sinus / cosinus with degree
*/
#define DEG (3.1415927/180.0) 

/*
** draw inner loop (mill tool)
*/
#define DRAW_LINE_MILL_TOOL(bL,sL,len)\
			unsigned char* bitmapLinePtr = bL;\
			unsigned char* spriteLinePtr =sL;\
			int length = len;\
			unsigned char* helpPtr = (unsigned char* ) &millToolColor;\
			unsigned char alphaComplement = 255 - helpPtr[3];\
			\
			for (int w = 0; w < length; w++)\
			{\
				unsigned char* pixel = bitmapLinePtr + (w * 4);\
			\
				if (*(spriteLinePtr + w) == 1)\
				{\
					pixel[0] = (((helpPtr[0] * helpPtr[3]) + (pixel[0] * alphaComplement)) >> 8);\
					pixel[1] = (((helpPtr[1] * helpPtr[3]) + (pixel[1] * alphaComplement)) >> 8);\
					pixel[2] = (((helpPtr[2] * helpPtr[3]) + (pixel[2] * alphaComplement)) >> 8);\
					pixel[3] = 255;\
				}\
			}\

/*
** draw inner loop (roughness line)
*/
#define DRAW_LINE_ROUGHNESS_LINE(bL,sL,len)\
			unsigned char* bitmapLinePtr = bL;\
			unsigned char* spriteLinePtr =sL;\
			int length = len;\
			unsigned char* helpPtr = (unsigned char* ) &millRoughnessColor;\
			unsigned char* helpPtr2 = (unsigned char* ) &millTouchedColor;\
			unsigned char isTouched;\
			\
			for (int w = 0; w < length; w++)\
			{\
				isTouched = 0;\
				unsigned char* pixel = bitmapLinePtr + (w * 4);\
			\
				if ((pixel[0] == helpPtr2[0]) &&\
					(pixel[1] == helpPtr2[1]) &&\
					(pixel[2] == helpPtr2[2]))\
				{\
					isTouched = 1;\
				}\
			\
				if (*(spriteLinePtr + w) == 1 && isTouched == 1)\
				{\
					pixel[0] = helpPtr[0];\
					pixel[1] = helpPtr[1];\
					pixel[2] = helpPtr[2];\
					pixel[3] = 255;\
				}\
			}\

/*
** global variables
*/
int millToolDiameter;
int millToolColor;
int centerLineColor;
int millRoughnessColor;
int strokeWidthRoughnessLine;
int millTouchedColor;

float* floatSinPtr = NULL;
float* floatCosPtr = NULL;

unsigned char* spriteRoughnessPtr  = NULL;
unsigned char* spriteMilltoolPtr = NULL;

int spriteMillToolSideLength;

int currentStartX;
int currentStartY;
int currentStartXSprite;
int currentStartYSprite;
int currentWidth;
int currentHeight;

/*
** local function prototypes
*/
int GenerateSinus();
float Sinus16Bit(unsigned short angle);
float Cosinus16Bit(unsigned short angle);
void DestroySinus();

int GenerateSprites();
void DestroySprites();
void ClippingSpites(int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y);
void DrawCenterLinePixel(unsigned char* bitmapLinePtr, int x, int y, int stride);

/* 
** initialize module RenderCore
*/
int RenderCoreInitialize(int toolDiameter, int toolColor, int lineColor, int roughnessColor, int strokeWidth, int touchedColor) {	
	int result;

	if (RenderCorePointerStatus() < 0x0f) {
		return 99; /* render core is already initialize */
	}
	
	millToolDiameter = toolDiameter;
	millToolColor = toolColor;
	centerLineColor = lineColor;
	millRoughnessColor = roughnessColor;
	strokeWidthRoughnessLine = strokeWidth;
	millTouchedColor = touchedColor;

	if (GenerateSinus() != 0) {
		DestroySinus();
		return -1;
	}

	result = GenerateSprites();

	if (result != 0){
		DestroySinus();
		DestroySprites();
		return result;
	}

	return 0;
}

/*
** deinitialize and destroy memory for this module "renderCore"
*/
void RenderCoreDestroy() {
	DestroySinus();
	DestroySprites();
}

/*
** helper, returns bit by bit which pointer is allocated
*/
int RenderCorePointerStatus() {
	int result = 0;
	
	int isNotfloatSinPtr = 0x01;
	int isNotfloatCosPtr = 0x02;
	int isNotSpriteRoughnessPtr = 0x04;
	int isNotSpriteMilltoolPtr = 0x08;
	
	if (floatSinPtr == NULL) result |= isNotfloatSinPtr;
	if (floatCosPtr == NULL) result |= isNotfloatCosPtr;
	
	if (spriteRoughnessPtr == NULL) result |= isNotSpriteRoughnessPtr;
	if (spriteMilltoolPtr == NULL) result |= isNotSpriteMilltoolPtr;
	
	return result;
}

/*
** draw center line and roughness on touched color
** option: (1||4) -> roughness / (2||4) -> centerLine 
*/
void RenderCoreDraw(unsigned char* bitmap, int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y, char option) {
	ClippingSpites(bitmapWidth, bitmapHeight, bitmapStride, x, y);

	if (option == 1 || option == 4) {
		for (int h = 0; h < currentHeight; h++) {
			DRAW_LINE_ROUGHNESS_LINE(
				bitmap + (((h + currentStartY) * bitmapStride) + (currentStartX * 4)), 
				spriteRoughnessPtr + (((h + currentStartYSprite) * spriteMillToolSideLength) + currentStartXSprite), 
				currentWidth);
		}
	}

	if (option == 2 || option == 4) {
		if (x > 2 && y > 2 && x < bitmapWidth - 2 && y < bitmapHeight - 2) {
			DrawCenterLinePixel(bitmap, x - 1, y - 1, bitmapStride);
			DrawCenterLinePixel(bitmap, x, y - 1, bitmapStride);
			DrawCenterLinePixel(bitmap, x + 1, y - 1, bitmapStride);

			DrawCenterLinePixel(bitmap, x - 1, y, bitmapStride);
			DrawCenterLinePixel(bitmap, x, y, bitmapStride);
			DrawCenterLinePixel(bitmap, x + 1, y, bitmapStride);

			DrawCenterLinePixel(bitmap, x - 1, y + 1, bitmapStride);
			DrawCenterLinePixel(bitmap, x, y + 1, bitmapStride);
			DrawCenterLinePixel(bitmap, x + 1, y + 1, bitmapStride);

		}
	}
}

/*
** draw mill tool 
*/
void RenderCoreDrawMill(unsigned char* bitmap, int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y) {	
	ClippingSpites(bitmapWidth, bitmapHeight, bitmapStride, x, y);

	for (int h = 0; h < currentHeight; h++) {
		DRAW_LINE_MILL_TOOL(
			bitmap + (((h + currentStartY) * bitmapStride) + (currentStartX * 4)),
			spriteMilltoolPtr + (((h + currentStartYSprite) * spriteMillToolSideLength) + currentStartXSprite),
			currentWidth);
	}
}

/*
** ******************
** local functions
** ******************
*/

/*
** generate 16 Bit sinus / cosinus memory table
*/
int GenerateSinus() {
	unsigned short i;

	if ((floatSinPtr = (float* ) malloc(sizeof(float) * 0xffff)) == NULL) return -1;
	if ((floatCosPtr = (float* ) malloc(sizeof(float) * 0xffff)) == NULL) return -1;

	for (i = 0; i < 0xffff; i++) *(floatSinPtr + i) = sin((360.0 / 0xffff) * i * DEG);
	for (i = 0; i < 0xffff; i++) *(floatCosPtr + i) = cos((360.0 / 0xffff) * i * DEG);

	return 0;
}

/*
** call a sinus value from memory table
*/
float Sinus16Bit(unsigned short angle) {
	return(*(floatSinPtr + angle));
}

/*
** call a cosinus value from memory table
*/
float Cosinus16Bit(unsigned short angle) {
	return((float) * (floatCosPtr + angle));
}

/*
** destroy 16 Bit  sinus cosinus memory table
*/
void DestroySinus() {
	if (floatSinPtr != NULL) {
		free(floatSinPtr);
		floatSinPtr = NULL;
	}

	if (floatCosPtr != NULL) {
		free(floatCosPtr);
		floatCosPtr = NULL;
	}
}

/*
** create sprite memory and generate sprites
*/
int GenerateSprites() {
	int innerWidth = 0;

	if (millToolDiameter < 4 || millToolDiameter > 1600) return -20;
	
	spriteMillToolSideLength = millToolDiameter + 1;

	int radiusMillTool = (int) (spriteMillToolSideLength/2.0);
	
    int spriteRoughnessLength = pow(spriteMillToolSideLength, 2.0);;
    int spriteMilltoolLength = pow(spriteMillToolSideLength, 2.0);;

	if ((spriteRoughnessPtr = (unsigned char* ) malloc(sizeof(char) * spriteRoughnessLength)) == NULL) return -2;
	if ((spriteMilltoolPtr = (unsigned char* ) malloc(sizeof(char) * spriteMilltoolLength)) == NULL) return -2;

	memset(spriteRoughnessPtr, 0, spriteRoughnessLength);
	memset(spriteMilltoolPtr, 0, spriteMilltoolLength);

	/* 
	** create roughness line
	*/
	innerWidth = radiusMillTool - strokeWidthRoughnessLine;

	(innerWidth < 2) ? innerWidth : 2;

	for (int i = 0; i < 0xffff; i++) {
		for (int w = innerWidth; w < radiusMillTool; w++) {
			int xCurr = radiusMillTool + (Cosinus16Bit(i) * w);
			int yCurr = radiusMillTool - (Sinus16Bit(i) * w);
			*(spriteRoughnessPtr + (yCurr * spriteMillToolSideLength + xCurr)) = 0x01;
		}
	}

	/*
	** create mill tool
	*/
	HLINES* hLinesPtr = NULL;

	if ((hLinesPtr = (HLINES* )malloc(sizeof(HLINES) * spriteMillToolSideLength)) == NULL) return -3;

	for (int i = 0; i < 0x7fff; i++) {
		int xCurr = (Sinus16Bit(i) * radiusMillTool);
		int yCurr = (Cosinus16Bit(i) * radiusMillTool * (-1));

		if ((yCurr + radiusMillTool) >= 0 && (yCurr + radiusMillTool) < spriteMillToolSideLength) {
			hLinesPtr[yCurr + radiusMillTool].xStart = radiusMillTool - xCurr;
			hLinesPtr[yCurr + radiusMillTool].xEnd = radiusMillTool + xCurr;
		}
	}

	for (int i = 0; i < spriteMillToolSideLength; i++) {
		int yCurr = i * spriteMillToolSideLength;

		for (int w = 0; w < spriteMillToolSideLength; w++) {
			if (hLinesPtr[i].xStart <= w && hLinesPtr[i].xEnd >= w)
				* (spriteMilltoolPtr + (yCurr + w)) = 0x01;
		}
	}

	free(hLinesPtr);

	return 0;
}

/*
** destroy sprite memory
*/
void DestroySprites() {
	if (spriteRoughnessPtr != NULL) {
		free(spriteRoughnessPtr);
		spriteRoughnessPtr = NULL;
	}

	if (spriteMilltoolPtr != NULL) {
		free(spriteMilltoolPtr);
		spriteMilltoolPtr = NULL;
	}
}

/*
** clipping all sprites outside the main bitmap
*/
void ClippingSpites(int bitmapWidth, int bitmapHeight, int bitmapStride, int x, int y) {
	int x0 = x - (int)(millToolDiameter / 2.0);
	int y0 = y - (int)(millToolDiameter / 2.0);

	currentStartX = 0;
	currentStartY = 0;
	currentStartXSprite = 0;
	currentStartYSprite = 0;
	currentWidth = 0;
	currentHeight = 0;

	/* check whether visible */
	if ((x0 < 2 - spriteMillToolSideLength) ||
		(y0 < 2 - spriteMillToolSideLength) ||
		(x0 > bitmapWidth - 2) ||
		(y0 > bitmapHeight - 2))
		return;

	if (x0 < 0) {
		currentStartXSprite = x0 * (-1);
		currentStartX = 0;
		currentWidth = spriteMillToolSideLength + x0;
	} else if (x0 >= (bitmapWidth - spriteMillToolSideLength)) {
		currentStartXSprite = 0;
		currentStartX = x0;
		currentWidth = spriteMillToolSideLength - (x0 + spriteMillToolSideLength - bitmapWidth);
	} else {
		currentStartXSprite = 0;
		currentStartX = x0;
		currentWidth = spriteMillToolSideLength;
	}

	if (y0 < 0) {
		currentStartYSprite = y0 * (-1);
		currentStartY = 0;
		currentHeight = spriteMillToolSideLength + y0;
	} else if (y0 >= (bitmapHeight - spriteMillToolSideLength)) {
		currentStartYSprite = 0;
		currentStartY = y0;
		currentHeight = spriteMillToolSideLength - (y0 + spriteMillToolSideLength - bitmapHeight);
	} else {
		currentStartYSprite = 0;
		currentStartY = y0;
		currentHeight = spriteMillToolSideLength;
	}

	(currentWidth < 0) ? currentWidth = 0 : currentWidth;
	(currentHeight < 0) ? currentHeight = 0 : currentHeight;
}

/*
** draw center line as mini cross
*/
void DrawCenterLinePixel(unsigned char* bitmapLinePtr, int x, int y, int stride) {
	unsigned char* helpPtr = (unsigned char* ) &centerLineColor;
	unsigned char* pixel = bitmapLinePtr + ((y * stride) + (x * 4));

	pixel[0] = helpPtr[0];  /* b */
	pixel[1] = helpPtr[1];  /* g */
	pixel[2] = helpPtr[2];  /* r */
	pixel[3] = 255;
}
