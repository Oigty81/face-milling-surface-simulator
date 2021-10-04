import Vue from 'vue';

export default {
    install() {
        Vue.directive("resize-info", {
            resizeObserverList: undefined,
                                                
            bind: (el, binding, vnode) => {
                let immediateResizeEvent = false;
                let currentComponentIndex = 0;

                if(this.resizeObserverList === undefined) {
                    this.resizeObserverList = [];
                }

                if(typeof binding.value === 'object' && binding.value !== undefined) {
                    if(binding.value.index !== undefined && !isNaN(binding.value.index)) {
                        currentComponentIndex = binding.value.index;
                    }
                    if(binding.value.immediate !== undefined && typeof binding.value.immediate === 'boolean') {
                        immediateResizeEvent = binding.value.immediate;
                    }
                } else if (!isNaN(binding.value)) {
                    currentComponentIndex = binding.value;
                } else return;
                
                const resizeObserver = new ResizeObserver(entries => {
                    if(entries[0].contentRect.height !== undefined) {
                        if(immediateResizeEvent === true) {
                            vnode.child.$emit('componentResized', {
                                index: currentComponentIndex,
                                width: entries[0].contentRect.width,
                                height: entries[0].contentRect.height
                            });
                        } else {
                            immediateResizeEvent = true;
                        }
                    }
                });
                
                resizeObserver.observe(el);
                
                this.resizeObserverList.push({
                    resizeObserver: resizeObserver,
                    element: el,
                    componentIndex: currentComponentIndex
                });
            },

            unbind: (el, binding) => {
                let currentComponentIndex = 0;
                
                if(typeof binding.value === 'object' && binding.value !== undefined) {
                    if(binding.value.index !== undefined && !isNaN(binding.value.index)) {
                        currentComponentIndex = binding.value.index;
                    }
                } else if (!isNaN(binding.value)) {
                    currentComponentIndex = binding.value;
                } else return;
                
                this.resizeObserverList.forEach((rol, index, object) => {
                    if(currentComponentIndex === rol.componentIndex) {
                        rol.resizeObserver.unobserve(rol.element);
                        object.splice(index, 1);
                    }
                });
            }
        });
    },
};
