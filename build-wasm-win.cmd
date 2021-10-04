rem initialize emscripten on windows
call C:\emsdk-1-39-3\emsdk_env.bat

rem build  WebAssembly
call emcc ./src/emcc/RenderCore.c ./src/emcc/renderWrapper.c -O1 -s WASM=1 -s ENVIRONMENT="web"^
    -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall','cwrap']" -s TOTAL_MEMORY=512MB -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1^
    -s EXPORTED_FUNCTIONS="['_main', '_CreateRenderObject', '_ResetRenderObject', '_SetRenderObject', '_DrawRoughnessToRenderObject', '_DeallocateNativeMemory', '_malloc', '_free']"^
    -s EXPORT_NAME="renderWrapper" -o ./src/components/ui/NcRenderDisplay/wasm/renderWrapper.js

rem rename genarated js file
move .\src\components\ui\NcRenderDisplay\wasm\renderWrapper.js  ./src/components/ui/NcRenderDisplay/wasm/renderWrapper_temp.js

rem put  /* eslint-disable */   on the first line of js file
echo /* eslint-disable */ > ./src/components/ui/NcRenderDisplay/wasm/renderWrapper.js

rem copy raw-js-file content in new js-file with eslint-disable line
type .\src\components\ui\NcRenderDisplay\wasm\renderWrapper_temp.js >> ./src/components/ui/NcRenderDisplay/wasm/renderWrapper.js

rem delete raw-js-file
del .\src\components\ui\NcRenderDisplay\wasm\renderWrapper_temp.js