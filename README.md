# face-milling-surface-simulator
[https://oigty81.github.io/face-milling-surface-simulator](https://oigty81.github.io/face-milling-surface-simulator)

A CNC milling simulator as web app. 
This application simulates milling paths and roughness marks.
The simulator is capable of parse cnc programs from a uploaded txt-file and generate a milling paths.
After upload an image and setting origin, relation und touched-color, the simulator will display the milling tool in its current position and leave marks of roughness.

It runs on web browsers with support to HTML5 and Webassembly.

For more infos to usage this tool go to the quick guide: [https://oigty81.github.io/face-milling-surface-simulator/#/Help](https://oigty81.github.io/face-milling-surface-simulator/#/Help)

![](./pagedemo.gif)

# 
## My intension for creating this project:
* build a medium-sized web application with the **Vue.js** framework
* responsive behavior and optimization for mobile devices
* using **WebAssembly** for fast rendering
* using **Emscripten** to compile C source code into **WebAssembly** bytecode

# 

This application is useful for employees working in machining technology and will be further developed and improved.

go to **[TODO](TODO.md)** for more informations

# 
## Project setup

### Prerequisite

- [Node.JS v12](https://nodejs.org/download/release/v12.8.0/)

### Install the repository
```
git clone https://github.com/Oigty81/face-milling-surface-simulator.git
cd face-milling-surface-simulator
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

# 
