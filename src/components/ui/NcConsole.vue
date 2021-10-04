<template>
    <div
        class="card bg-3 custom-console"
        ref="ncConsole"
        :style="{height: ''.concat(consoleHeight).concat('px')}"
    >
        <div class="row card-header p-1 ml-1">
            <div class="col-4 px-0">
                <h3 class="pt-1">Nc-Program</h3>
            </div>
            <div class="col-4">
                <h3 class="pt-1 text-right">Block-Progress:</h3>
            </div>
            <div class="col-4 pt-1">
                <div class="nc-progress-bar-wrapper">
                    <div
                        class="nc-progress-bar"
                        :style="{ width: progressNcBlockWidth }"
                    ></div>
                </div>
            </div>
        </div>
        <simplebar
            class="card-body p-1 bg-2"
            data-simplebar-auto-hide="false"
            ref="scroll_1"
            :style="{height: ''.concat(consoleHeight).concat('px')}"
        >
            <ComponentSizeDetectionWrapper
                v-resize-info="{index: 9001, immediate: true}"
                @componentResized="wrapperResized($event)"
            >
                <table>
                    <tr
                        v-for="(item, index) in blocksAsTextList"
                        :key="index"
                    >
                        <td
                            class="table-col-nc-block nc-text"
                            :class="{ 'current-nc-block': item.blockAssociated === currentNcBlock }"
                        >{{item.ncBlockText}}</td>
                    </tr>
                </table>
            </ComponentSizeDetectionWrapper>
        </simplebar>
    </div>
</template>

<script>
import simplebar from 'simplebar-vue';

import ComponentSizeDetectionWrapper from '../layout/ComponentSizeDetectionWrapper';

export default {
     name: 'NcConsole',
     components: {
        simplebar,
        ComponentSizeDetectionWrapper
    },
     props: {
        consoleHeight: {
            default: 280
        },
        ncBlockProgress: {
            type: Number,
            default: 30
        },
        currentNcBlock: {
            type: Number,
            default: 1,
        },
        blocksAsTextList: {
            default() {
                return [
                    {
                        ncBlockText: ";--------- start",
                        blockAssociated: 0
                    },
                    {
                        ncBlockText: "G1 X100 Y234 TR=4 F=0.5",
                        blockAssociated: 1
                    },
                    {
                        ncBlockText: "G2 X300 Y100 CR=120 TR=3",
                        blockAssociated: 2
                    },
                    {
                        ncBlockText: "G2 X-10 Y20",
                        blockAssociated: 3
                    },
                    {
                        ncBlockText: "G1 X100 Y-100",
                        blockAssociated: 4
                    },
                    {
                        ncBlockText: ";---------------",
                        blockAssociated: 5
                    },
                    {
                        ncBlockText: "G1 Y-50",
                        blockAssociated: 6
                    },
                ];
            }
        },
    },
    computed: {
        progressNcBlockWidth: function() {
            return this.ncBlockProgress.toString().concat('%');
        }
    },
    data: function () {
        return {
            tableHeight: 1
        };
    },
    methods: {
        wrapperResized(e) {
            if(e.index === 9001) {
               this.tableHeight = e.height;
            }
        },
    },
    watch: {
        /*eslint-disable */
        currentNcBlock: {
                handler(newVal, oldVal) {  
                    const scrollPosition = (this.tableHeight / this.blocksAsTextList.length) * this.currentNcBlock;
                    this.$refs.scroll_1.SimpleBar.getScrollElement().scrollTo({ top: scrollPosition, behavior: "smooth" });
                },
                deep: false,
        }
        /*eslint-enable */
    }
};
</script>
