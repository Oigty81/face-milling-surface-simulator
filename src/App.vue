<template>
    <div id="app">
        <Navbar
            v-resize-info="{index: 1001, immediate: true}"
            @componentResized="resizeNavbar($event)"
        ></Navbar>

        <router-view/>

        <ModalInfo
            :modalShow="showModalInfo"
            @closeModal="closeModalInfo()"
        ></ModalInfo>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import Navbar from '@/components/layout/Navbar';
import ModalInfo from '@/components/layout/ModalInfo';

export default Vue.extend({
    components: {
        Navbar,
        ModalInfo
    },
    created() {
        this.$store.dispatch('CommonModule/loadDemo', { profile: 'demo/profile1.json', ncProgram: 'demo/CNC_Demo1.txt' });
        this.$store.dispatch("CommonModule/GenerateUrlGetQuery", window.location);
        
        if(process.env.VUE_APP_APPMODE === 'APP' && 'websocketport' in this.currentUrlGetQuery) {
            this.webSocket = new WebSocket("ws://localhost:" + this.currentUrlGetQuery.websocketport);

            this.webSocket.onopen = (event) => {
                console.log("websocket connected :", event);
                this.$store.dispatch('MessageConsoleModule/addMessage', { text: "websocket connected", color: 1 }, { root: true });
            };

            this.webSocket.onmessage = (event) => {
                if (event.data) {
                    console.log("websocket message:", event.data);
                    this.$store.commit("CommonModule/ADD_WEBSOCKED_MESSAGE", event.data);
                }
            };

            this.webSocket.onmessage = (event) => {
                if (event.data) {
                    const wsMessageObject = JSON.parse(event.data);
                    if (wsMessageObject.type !== undefined && wsMessageObject.data !== undefined) {
                        switch (wsMessageObject.type) {
                            case 'message':
                                //..
                                break;
                            case 'profiledata':
                                this.$store.dispatch('MessageConsoleModule/addMessage', { text: "websocket message 'profiledata'", color: 1 }, { root: true });
                                break;
                            case 'imagedata':
                                this.$store.dispatch('MessageConsoleModule/addMessage', { text: "websocket message 'imagedata'", color: 1 }, { root: true });
                                break;
                            case 'cncdata':
                                this.$store.dispatch('MessageConsoleModule/addMessage', { text: "websocket message 'cncdata'", color: 1 }, { root: true });
                                break;
                            default:
                                console.log("unknown websocket message type:", event.data);
                                break;
                        }
                    }
                }
            };
        }
    },
    computed: {
        ...mapGetters('CommonModule', [
            'showModalInfo', "currentUrlGetQuery",
        ]),
    },
    data: function () {
        return {
            webSocket: null
        };
    },
    methods: {
        resizeNavbar(e) {
            if(e.index === 1001) {
                this.$store.commit('CommonModule/SET_NAVBAR_HEIGHT', e.height, { root: true });
            }
        },
        closeModalInfo() {
            this.$store.commit('CommonModule/SET_MODAL_INFO', false, { root: true });
        }
    }
});
</script>
