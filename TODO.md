### Todo

- [ ] feature for edit current CNC-Program in the WEB-APP memory directly
- [ ] add comments for some function and class headers
- [ ] rewrite some vue components in typescript
- [ ] the methode "getScrollElement" from package  "simplebar-vue"  is not supported by typescript yet, remove the lines '@ts-ignore' in "DetermineDrawingOriginAutoResizeWrapper.vue" and "DetermineDrawingRelationAutoResizeWrapper.vue" at the respective positions
- [ ] refactoring vuex stores  (create mutation-types, ...)
- [ ] bugfix and optimize the renderservice (main-canvas) for better use on mobile devices
    - [ ] draw and refresh is very slowly
    - [ ] sometimes after routing back to `/home` (from `Home/Settings` or `/Help`) the content of main-canvas is disappeared

### In Progress

- [ ] complete some missing unit-tests for vue components and vuex action- and getter-functions

### Done ✓

- [x] check and fix responsive-behavior for screen widths over 1920 pixels