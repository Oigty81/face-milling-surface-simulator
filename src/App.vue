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
    created: function() {
        this.$store.dispatch('CommonModule/loadDemo', { profile: 'demo/profile1.json', ncProgram: 'demo/CNC_Demo1.txt' });
    },
    computed: {
        ...mapGetters('CommonModule', [
            'showModalInfo',
        ]),
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
