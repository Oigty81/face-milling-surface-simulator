<template>
    <div class="mt-1">
        <simplebar
            style="width:99.5vw; overflow-x:hidden;"
            data-simplebar-auto-hide="false"
            :style="{height: ''.concat(scrollbarHeight).concat('px')}"
        >
            <ComponentSizeDetectionWrapper
                v-resize-info="{index: 2001, immediate: true}"
                @componentResized="wrapperResized($event)"
            > <router-view />
            </ComponentSizeDetectionWrapper>

            <div class="row mt-1 pl-3" style="width:99.5vw;">
                <div class="col-lg-6 px-0">
                    <nc-console
                        :ncBlockProgress="currentNcBlockProgress"
                        :currentNcBlock="currentNcBlock"
                        :blocksAsTextList="blocksAsTextList"
                        :consoleHeight="consoleHeight"
                    >
                    </nc-console>
                </div>
                <div class="col-lg-6 px-0">
                    <message-console
                        :messageList="messageList"
                        :consoleHeight="consoleHeight"
                    >
                    </message-console>
                </div>
            </div>
        </simplebar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import simplebar from 'simplebar-vue';

import ComponentSizeDetectionWrapper from '../components/layout/ComponentSizeDetectionWrapper';

import MessageConsole from '../components/ui/MessageConsole';
import NcConsole from '../components/ui/NcConsole';

export default {
    name: 'Home',
    components: {
        simplebar,
        ComponentSizeDetectionWrapper,
        MessageConsole,
        NcConsole,
        
    },
    created: function() {
        window.addEventListener("resize", this.resizeHandler);
        this.clientHeight = window.innerHeight;
    },
    data: function () {
        return {
            clientHeight: 0,
            mainSectionHeight: 0,
        };
    },
    computed: {
        ...mapGetters('CommonModule', [
            'navbarHeight',
        ]),
        ...mapGetters('MessageConsoleModule', [
            'messageList',
        ]),
        ...mapGetters('NcModule', [
            'blocksAsTextList',
            'currentNcBlock',
            'currentNcBlockProgress',
        ]),
                
        scrollbarHeight: function() {
            return this.clientHeight - this.navbarHeight + 10;
        },
        consoleHeight: function() {
            if(this.clientHeight - this.navbarHeight < 900) {
                return 280;
            } else {
                return this.clientHeight - (this.navbarHeight + this.mainSectionHeight + 40);
            }
        }
    },
    methods: {
        resizeHandler() {
            this.clientHeight = window.innerHeight;
        },
        wrapperResized(e) {
            if(e.index === 2001) {
                this.mainSectionHeight = e.height;
            }
        },
    },
};
</script>
