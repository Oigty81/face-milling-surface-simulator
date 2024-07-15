<template>
    <div ref="NavbarEl">
        <b-navbar toggleable="xl" type="dark" class="bg-navbar my-0" >
            <b-navbar-brand>
                <img class="img-logo-1" src="../../assets/logo.png" alt="-">
                <span class="header-text-1 mx-2">Face - Milling - Surface - Simulator</span>
                <img class="img-logo-2" src="../../assets/logo.png" alt="-">
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                 <b-navbar-nav>
                    <b-nav-item href="#" tag="router-link" :to="{ path: '/Home' }"><i class="fas fa-home"></i>{{'\xa0\xa0'}}Home</b-nav-item>
                    <b-nav-item href="#" tag="router-link" :to="{ path: '/Home/Settings' }"><i class="fas fa-tools"></i>{{'\xa0\xa0'}}Settings</b-nav-item>
                    <b-nav-item href="#" tag="router-link" :to="{ path: '/Help' }"><i class="far fa-question-circle"></i>{{'\xa0\xa0'}}Help</b-nav-item>
                    <b-nav-item href="#" @click="openModalInfo()">{{'\xa0'}}<i class="fas fa-info"></i>{{'\xa0\xa0'}}Info</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item href="#" @click="loadDemo1()"><i class="far fa-save"></i>{{'\xa0\xa0'}}Load Demo 1</b-nav-item>
                    <b-nav-item href="#" @click="loadDemo2()"><i class="far fa-save"></i>{{'\xa0\xa0'}}Load Demo 2</b-nav-item>
                    <b-nav-item v-if="appMode === 'APP'" href="#">BAT</b-nav-item>
                    <b-nav-item v-if="appMode === 'APP'" href="#" @click="minimizeApp()">Min</b-nav-item>
                    <b-nav-item v-if="appMode === 'APP'" href="#" @click="quitApp()">EXIT</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class Navbar extends Vue {
    public appMode!: string;

    constructor() {
        super();
        this.appMode = process.env.VUE_APP_APPMODE;
    }

    loadDemo1() {
        this.$store.dispatch('CommonModule/loadDemo', { profile: 'demo/profile1.json', ncProgram: 'demo/CNC_Demo1.txt' });
    }
    
    loadDemo2() {
        this.$store.dispatch('CommonModule/loadDemo', { profile: 'demo/profile2.json', ncProgram: 'demo/CNC_Demo2.txt' });
    }
    
    openModalInfo() {
        this.$store.commit('CommonModule/SET_MODAL_INFO', true, { root: true });
    }

    minimizeApp() {
        this.$store.dispatch("UtilitiesModule/appMinimize");
    }

    quitApp() {
        this.$store.dispatch("UtilitiesModule/appQuit");
    }
}
</script>
