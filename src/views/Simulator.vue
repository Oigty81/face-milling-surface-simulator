<template>
    <div class="row mt-1 pl-3" style="width:99.5vw;">
        <div class="col-xl-7 px-1">
            <div class="row px-2">
                <div class="col-lg px-1">
                    <NcRenderDisplayAutoResizeWrapper
                        :viewportRelation="1.9"
                        :ncRenderParameter="ncRenderParameter"
                        :isEnabledMillTool="true"
                        :renderLineOption="4"
                        :currentMillPosition="currentMillPosition"
                        :zoomPositiveTrigger="zoomPositiveTriggerValue"
                        :zoomNegativeTrigger="zoomNegativeTriggerValue"
                        :zoomResetTrigger="zoomResetTriggerValue"
                        :roughnessResetTrigger="roughnessResetTriggerValue"
                        :downloadRoughnessTrackImageTrigger="downloadRoughnessTrackImageTriggerValue"
                        @send-zoom-positive="receiveZoomPositive($event)"
                        @send-zoom-negative="receiveZoomNegative($event)"
                        @send-zoom-reset="receiveZoomReset($event)"
                        @send-roughness-reset="receiveRoughnessReset()"
                        @send-download-roughness-image="receiveDownloadRoughnessImage()"
                        @send-message="receiveMessage($event)"
                    ></NcRenderDisplayAutoResizeWrapper>
                </div>
            </div>
        </div>
        <div class="col-xl-5 px-3">
            <div class="row px-2">
                <div class="col-xl px-1 pb-3">
                    <NcController
                        :ledGlowNcStart="ncRun"
                        :ledGlowNcStop="!ncRun"
                        :ncPositionX="currentNcPosition.x"
                        :ncPositionY="currentNcPosition.y"
                        @clickNcStart="startNc()"
                        @clickNcStop="stopNc()"
                        @clickNcReset="resetNc()"
                        @changeVelocity="setNcSimulationVelocity($event)"
                    ></NcController>
                </div>
                <div class="col-xl px-1 pb-3">
                    <RenderController
                        @clickZoomPositive="clickZoomPositive()"
                        @clickZoomNegative="clickZoomNegative()"
                        @clickZoomReset="clickZoomReset()"
                        @clickResetRoughnessTrack="clickResetRoughnessTrack()"
                        @changeNcSamplesPerRefreshSliderChange="changeNcSamplesPerRefreshSliderChange($event)"
                        @clickDownloadCanvas="clickDownloadCanvas()"
                    ></RenderController>
                </div>
                <div class="col-xl px-1 pb-3">
                    <ProfileController
                        :ncOriginOnImage="profileData.imageOrigin"
                        :ncStartpoint="profileData.ncStartpoint"
                        :toolColor="profileData.toolColor"
                        :roughnessColor="profileData.roughnessColor"
                        :touchedColor="profileData.touchedColor"
                        :millDiameter="profileData.millDiameter"
                        :relationPixelPerMM="profileData.relationPixelPerMM"
                        @clickSettings="clickSettings()"
                    ></ProfileController>
                </div>
                <div class="col-lg px-1 pb-2">
                    <UpAndDownloadController
                        @clickResetProfile="clickResetProfile()"
                        @clickDownloadProfile="clickDownloadProfile()"
                        @clickClearNcProgram="clearNc()"
                        @clickDownloadNcProgram="clickDownloadNcProgram()"
                    ></UpAndDownloadController>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { saveAs } from 'file-saver';

import { mapActions, mapGetters } from 'vuex';

import { Point2d } from '../types/Point2d';
import { MillPosition } from '../types/MillPosition';
import { NcRenderParameter } from '../types/NcRenderParameter';

import { getBase64FromImageElement } from '../utilities/imageHelper';

import NcRenderDisplayAutoResizeWrapper from '../components/ui/NcRenderDisplay/NcRenderDisplayAutoResizeWrapper';
import NcController from '../components/layout/ControlSections/NcController';
import RenderController from '../components/layout/ControlSections/RenderController';
import ProfileController from '../components/layout/ControlSections/ProfileController';
import UpAndDownloadController from '../components/layout/ControlSections/UpAndDownloadController';

export default {
    name: 'Simulator',
    components: {
        NcRenderDisplayAutoResizeWrapper,
        NcController,
        RenderController,
        ProfileController,
        UpAndDownloadController,
    },
    mounted: function() {
        const woImg = new Image(128, 128);
        woImg.src = require('../assets/workpieceOrigin.png');
        woImg.onload = () => {
            this.workpieceOriginImage = getBase64FromImageElement(woImg);
        };
        
        this.$store.dispatch('ProfileModule/triggerProfilData');
    },
    data: function () {
        return {
            ncPositionX: 10,
            ncPositionY: 10,
            
            ncRenderParameter: null,
            
            zoomPositiveTriggerValue: false,
            zoomNegativeTriggerValue: false,
            zoomResetTriggerValue: false,
            roughnessResetTriggerValue: false,
            downloadRoughnessTrackImageTriggerValue: false,

            millPositionRender: true,
            millPositionRenderCounter: 0,
            ncSamplesPerRefresh: 5,

            workpieceOriginImage: '',
        };
    },
    computed: {
        ...mapGetters('NcModule', [
            'ncRun',
            'blocksAsTextList',
            'currentNcSamplePosition',
            'currentNcPosition',
            'currentTickerValue'
        ]),
        ...mapGetters('ProfileModule', [
            'profileData',
        ]),
        currentMillPosition: function() {
            return new MillPosition(new Point2d(this.ncPositionX, this.ncPositionY), this.millPositionRender);
        },
    },
    methods: {
        ...mapActions('NcModule', [
            'startNc', 'stopNc', 'resetNc', 'clearNc', 'setNcSimulationVelocity'
        ]),
        clickZoomPositive() {
            this.zoomPositiveTriggerValue = true;
        },
        receiveZoomPositive(e) {
            this.zoomPositiveTriggerValue = false;
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: e.Text, color: e.Color });
        },
        clickZoomNegative() {
           this.zoomNegativeTriggerValue = true;
        },
        receiveZoomNegative(e) {
            this.zoomNegativeTriggerValue = false;
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: e.Text, color: e.Color });
        },
        clickZoomReset() {
            this.zoomResetTriggerValue = true;
        },
        receiveZoomReset(e) {
            this.zoomResetTriggerValue = false;
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: e.Text, color: e.Color });
        },
        clickResetRoughnessTrack() {
            this.roughnessResetTriggerValue = true;
        },
        receiveRoughnessReset() {
            this.roughnessResetTriggerValue = false;
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'reset roughness tracks', color: 0 });
        },
        changeNcSamplesPerRefreshSliderChange(e) {
            this.ncSamplesPerRefresh = e;
        },
        clickDownloadCanvas() {
            this.downloadRoughnessTrackImageTriggerValue = true;
        },
        receiveDownloadRoughnessImage() {
            this.downloadRoughnessTrackImageTriggerValue = false;
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'download canvas content', color: 0 });
        },
        clickSettings() {
            this.$router.push({ path: '/Home/Settings' });
        },
        clickResetProfile() {
             this.$store.dispatch('ProfileModule/loadProfile', {
                mainImage: '',
                toolColor: '#ff0000',
                roughnessColor: '#606060',
                touchedColor: '#c0c0c0',
                millDiameter: 20,
                relationPixelPerMM: 1,
                imageOrigin: { x: 0, y: 0 },
                ncStartpoint: { x: 0, y: 0 }
            });
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'reset profile', color: 0 });
        },
        clickDownloadProfile() {
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'download current profile', color: 0 });
            
            const fileName = "profile_".concat(moment().format('YYYYMMDD_HHmmss_SSS')).concat(".json");
            const jsonObjectContent = new Blob([JSON.stringify(this.profileData, null, 4)], {
                    type: 'application/json',
                    name: fileName
            });

            saveAs(jsonObjectContent, fileName);
        },
        clickDownloadNcProgram() {
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'download current nc programm', color: 0 });

            const fileName = "CNC_Prg_".concat(moment().format('YYYYMMDD_HHmmss_SSS')).concat(".txt");
            let ncProgrammText = '';
            
            this.blocksAsTextList.forEach(b => {
                ncProgrammText = ncProgrammText.concat(b.ncBlockText).concat('\r\n');
            });

            const blob = new Blob([ncProgrammText], {
                type: "text/plain;charset=utf-8",
                name: fileName
            });
            saveAs(blob, fileName);
        },
        receiveMessage(e) {
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: e.Text, color: e.Color });
        }
    },
    watch: {
        /*eslint-disable */
        currentNcPosition: {
            handler(newVal, oldVal) {
                if(this.profileData !== undefined) {
                    this.ncPositionX = (this.profileData.imageOrigin.x * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) +
                        (newVal.x * this.profileData.relationPixelPerMM * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR);
                    this.ncPositionY = (this.profileData.imageOrigin.y * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) +
                        (newVal.y * (-1) * this.profileData.relationPixelPerMM * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR);
                    this.millPositionRenderCounter++;
                    if(this.millPositionRenderCounter >= this.ncSamplesPerRefresh || this.currentNcSamplePosition === 0) {
                        this.millPositionRender = true;
                        this.millPositionRenderCounter = 0;
                    } else {
                        this.millPositionRender = false;
                    }
                }                
            },
            deep: false
        },
        profileData: {
            handler(newVal, oldVal) {
                if(this.profileData !== undefined) {
                    this.ncRenderParameter = new NcRenderParameter(
                        newVal.mainImage,
                        newVal.millDiameter * newVal.relationPixelPerMM * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR,
                        newVal.toolColor,
                        '#ff0000',
                        newVal.roughnessColor,
                        1,
                        newVal.touchedColor,
                        new Point2d(newVal.imageOrigin.x, newVal.imageOrigin.y),
                        this.workpieceOriginImage
                    );
                    this.ncPositionX = (newVal.imageOrigin.x * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) +
                        (newVal.ncStartpoint.x * newVal.relationPixelPerMM * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR);
                    this.ncPositionY = (newVal.imageOrigin.y * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR) +
                        (newVal.ncStartpoint.y * (-1) * newVal.relationPixelPerMM * process.env.VUE_APP_RENDER_IMAGE_SCALE_FACTOR);
                }
            },
            deep: true,
            immediate: true,
        }
        /*eslint-enable */
    },
};
</script>
