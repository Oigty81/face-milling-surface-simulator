<template>
    <div
        class="card custom-console"
        :style="{height: ''.concat(consoleHeight).concat('px')}"
    >
        <div class="card-header p-1">
            <h3 class="pt-1">Console</h3>
        </div>
        <simplebar
            class="card-body p-1 bg-2"
            data-simplebar-auto-hide="false"
            ref="scroll_1"
            :style="{height: ''.concat(consoleHeight).concat('px')}"
        >
            <table>
                <tr
                    v-for="(item, index) in messageList"
                    :key="index"
                >
                    <td
                        class="table-col-datetime"
                        :class="{ 'first-entry': index === 0 && toggleFirstEntry, 'text-info': item.color === 0, 'text-success': item.color === 1, 'text-danger': item.color === 2}"
                        style="min-width: 200px;"
                    >{{item.timestamp}}</td>
                    <td
                        class="table-col-message"
                        :class="{ 'first-entry': index === 0 && toggleFirstEntry, 'text-info': item.color === 0, 'text-success': item.color === 1, 'text-danger': item.color === 2}"
                        style="min-width: 800px;"
                    >{{item.text}}</td>
                </tr>
            </table>
        </simplebar>
    </div>
</template>

<script>
import simplebar from 'simplebar-vue';

export default {
    name: 'MessageConsole',
    props: {
        consoleHeight: {
            default: 280
        },
        messageList: {
            default() {
                return [
                    {
                        timestamp: '2021-01-01 10:00:00',
                        text: '<default entry 1>',
                        color: 0
                    },
                    {
                        timestamp: '2021-01-01 11:00:00',
                        text: '<default entry 2>',
                        color: 1
                    },
                    {
                        timestamp: '2021-01-01 12:00:00',
                        text: '<default entry 3>',
                        color: 2
                    },
                ];
            }
        }
    },
    components: {
        simplebar,
    },
    data: function () {
        return {
            toggleFirstEntry: false
        };
    },
    watch: {
        /*eslint-disable */
        messageList: {
                handler(newVal, oldVal) {
                    this.$refs.scroll_1.SimpleBar.getScrollElement().scrollTo({ top: 0, behavior: "smooth" });
                    
                    if(newVal !== undefined && newVal.length > 0) {
                        // class remove / class add to restart the animation
                        setTimeout(() => {
                            this.toggleFirstEntry = false;
                            setTimeout(() => {
                                this.toggleFirstEntry = true;
                            }, 100);
                        }, 100);
                    }
                },
                deep: false,
        }
        /*eslint-enable */
    }
};
</script>
