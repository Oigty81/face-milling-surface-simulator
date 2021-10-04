<template>
    <div class="pr-2" style="width:99.5vw;">
        <div class="row mt-1 px-1">
            <div class="col-lg-6">
                <div class="row controller-box-container mx-0 pb-2">
                    <div class="col-6">
                        <button
                            class="button-column-width mt-2"
                            @click="applySettings()"
                        ><i class="far fa-thumbs-up"></i>{{'\xa0\xa0'}}Apply Settings and return</button>
                    </div>
                    <div class="col-6">
                        <button
                            class="button-column-width mt-2"
                            @click="cancelSettings()"
                        ><i class="fas fa-window-close"></i>{{'\xa0\xa0'}}Cancel Settings and return</button>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="row controller-box-container mx-0 pb-2">
                    <div class="col-6">
                        <button
                            class="button-column-width mt-2"
                            @click="clickClearImage()"
                        >clear image</button>
                    </div>
                    <div class="col-6">
                        <div class="mt-2" id="image-upload-box">
                            <b-tooltip target="image-upload-box" placement="top" delay="500" custom-class="tooltip-color-info-box" offset="100">
                                <p>drag a image file (*.png | *.bmp) into this field</p>
                            </b-tooltip>
                            <div
                                class="file-upload-drop-n-down pt-1"
                                id="file-upload-drop-n-down-image"
                                ref="refDropBoxImage"
                                @dragover="dragover($event)"
                                @dragleave="dragleave($event)"
                                @drop="drop($event)"
                            >
                                <h3 class="text-center"><i class="fas fa-upload"></i></h3>
                                <p class="text-center">upload image-file</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-1">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row mt-1 px-1">
            <div class="col-lg-4">
                <div class="row controller-box-container mx-0">
                    <div class="col-6 my-auto">
                        <h3 class="text-right">change tool-color: </h3>
                    </div>
                    <div class="col-6">
                        <ColorPicker
                            :colorValue="toolColor"
                            @change="onChangeToolColor($event)"
                        ></ColorPicker>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="row controller-box-container mx-0">
                    <div class="col-6 my-auto">
                        <h3 class="text-right">change roughness-color: </h3>
                    </div>
                    <div class="col-6">
                         <ColorPicker
                            :colorValue="roughnessColor"
                            @change="onChangeRoughnessColor($event)"
                        ></ColorPicker>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="row controller-box-container mx-0">
                    <div class="col-6 my-auto">
                        <h3 class="text-right">change touched-color: </h3>
                    </div>
                    <div class="col-6">
                        <ColorPicker
                        :colorValue="touchedColor"
                        @change="onChangeTouchedColor($event)"
                        ></ColorPicker>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-1">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row">
            <div class="col-xl-6">
                <div class="row justify-content-center controller-box-container py-2">
                    <div class="col-xl text-line-content-container mx-2">
                        <h3 class="text-center py-2">NC-Origin on image: X: {{imageOrigin.x.toFixed(0)}} Y: {{imageOrigin.y.toFixed(0)}} </h3>
                    </div>
                    <div class="col-xl text-line-content-container mx-2">
                        <h3 class="text-center py-2">Relation: (pixel / mm): {{relationPixelPerMM.toFixed(3)}}</h3>
                    </div>
                </div>
            </div>
            <div class="col-xl-6">
                <div class="row pr-3 justify-content-center">
                    <div class="col-sm controller-box-container">
                        <div class="row justify-content-center">
                            <div class="col-sm-8 my-auto">
                                <h3 class="text-center">Milltool-Diameter: {{millDiameter.toFixed(2)}} mm</h3>
                            </div>
                            <div class="col-sm-3">
                                <button
                                    class="button-fontawesome-icon my-1"
                                    @click="setMilldiameter()"
                                ><i class="fas fa-cog"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm controller-box-container">
                        <div class="row justify-content-center">
                            <div class="col-sm-8 my-auto">
                                <h3 class="text-center">NC-Startpoint: X: {{ncStartpoint.x.toFixed(3)}} Y: {{ncStartpoint.y.toFixed(3)}} </h3>
                            </div>
                            <div class="col-sm-3 my-auto">
                                <button
                                    class="button-fontawesome-icon my-1"
                                    @click="setNcStartpoint()"
                                ><i class="fas fa-cog"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row my-1">
            <div class="col">
                <hr class="hr-line-white">
            </div>
        </div>
        <div class="row mt-2 px-3">
            <div class="col-lg-6 pl-1">
                <div class="row">
                    <div class="col">
                        <h3>Set NC-Origin on Image</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <DetermineDrawingOriginAutoResizeWrapper
                            :viewportRelation="2.2"
                            :imageData="mainImage"
                            :originPosition="originPosition"
                            :originVisible="true"
                            :workpieceOriginImage="workpieceOriginImage"
                            @send-click-position="receiveDrawingOriginClickPosition($event)"
                            @send-error="receiveDrawingOriginError($event)"
                        ></DetermineDrawingOriginAutoResizeWrapper>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 pl-1 pr-2">
                <div class="row">
                    <div class="col">
                        <h3>Set Relation (pixel / mm)</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                         <DetermineDrawingRelationAutoResizeWrapper
                            :viewportRelation="2.2"
                            :imageData="mainImage"
                            :crosshairImage="crosshairImage"
                            @send-click-drawing-length="receiveDrawingRelationClickDrawingLength($event)"
                            @send-error="receiveDrawingRelationError($event)"
                        ></DetermineDrawingRelationAutoResizeWrapper>
                    </div>
                </div>
            </div>
        </div>

        <ModalToolSetting
            :modalShow="showModalToolSetting"
            :currentDiameter="millDiameter"
            @closeModal="closeModalToolSetting()"
            @closeModalApply="closeModalApplyToolSetting($event)"
        ></ModalToolSetting>

        <ModalNcStartpointSetting
            :modalShow="showModalNcStartpointSetting"
            :ncStartpoint="ncStartpoint"
            @closeModal="closeModalNcStartpointSetting()"
            @closeModalApply="closeModalApplyNcStartpointSetting($event)"
        ></ModalNcStartpointSetting>

        <ModalRelationSetting
            :modalShow="showModalRelationSetting"
            :currentPixelLength="currentPixelLength"
            @closeModal="closeModalRelationSetting()"
            @closeModalApply="closeModalApplyRelationSetting($event)"
        ></ModalRelationSetting>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ColorPicker from '../components/ui/ColorPicker';
import DetermineDrawingOriginAutoResizeWrapper from '../components/ui/DetermineDrawingOrigin/DetermineDrawingOriginAutoResizeWrapper';
import DetermineDrawingRelationAutoResizeWrapper from '../components/ui/DetermineDrawingRelation/DetermineDrawingRelationAutoResizeWrapper';

import ModalToolSetting from '../components/layout/ModalToolSetting';
import ModalNcStartpointSetting from '../components/layout/ModalNcStartpointSetting';
import ModalRelationSetting from '../components/layout/ModalRelationSetting';

export default {
    name: 'Settings',
    components: {
        ColorPicker,
        DetermineDrawingOriginAutoResizeWrapper,
        DetermineDrawingRelationAutoResizeWrapper,
        ModalToolSetting,
        ModalNcStartpointSetting,
        ModalRelationSetting
    },
    mounted: function() {
        const woImg = new Image(64, 64);
        woImg.src = require('../assets/workpieceOrigin_sm.png');
        woImg.onload = () => {
            this.workpieceOriginImage = woImg;
        };

        const chImg = new Image(32, 32);
        chImg.src = require('../assets/crosshair.png');
        chImg.onload = () => {
            this.crosshairImage = chImg;
        };

        this.$store.dispatch('ProfileModule/triggerProfilData');
    },
    computed: {
        ...mapGetters('CommonModule', [
            'uploadStateMainImage',
            'uploadedMainImage',
        ]),
        ...mapGetters('MessageConsoleModule', [
            'messageList',
        ]),
        ...mapGetters('ProfileModule', [
            'profileData',
        ]),
        originPosition: function () {
            return { X: this.imageOrigin.x, Y: this.imageOrigin.y };
        },
    },
    data: function () {
        return {
            workpieceOriginImage: null,
            crosshairImage: null,

            mainImage: '',
            toolColor: '#ff0000',
            roughnessColor: '#0000ff',
            touchedColor: '#404040',
            millDiameter: 40,
            relationPixelPerMM: 1.5,
            imageOrigin: { x: 0, y: 0 },
            ncStartpoint: { x: 0, y: 0 },
            defaultTR: 5,
            defaultFeed: 1.0,
            toolBlades: 1,

            currentPixelLength: 1,

            showModalToolSetting: false,
            showModalNcStartpointSetting: false,
            showModalRelationSetting: false,
        };
    },
    methods: {
        applySettings() {
            this.$store.dispatch('ProfileModule/loadProfile', {
                mainImage: this.mainImage,
                toolColor: this.toolColor,
                roughnessColor: this.roughnessColor,
                touchedColor: this.touchedColor,
                millDiameter: this.millDiameter,
                relationPixelPerMM: this.relationPixelPerMM,
                imageOrigin: this.imageOrigin,
                ncStartpoint: this.ncStartpoint
            });
            this.$router.push({ path: '/Home' });
        },
        cancelSettings() {
            this.$router.push({ path: '/Home' });
        },
        clickClearImage() {
            this.mainImage = '';
        },
        dragover(event) {
            event.preventDefault();
            if (!event.currentTarget.classList.contains('file-upload-drop-n-down-draghover')) {
                event.currentTarget.classList.add('file-upload-drop-n-down-draghover');
            }
        },
        dragleave(event) {
            event.preventDefault();
            event.currentTarget.classList.remove('file-upload-drop-n-down-draghover');
        },
        drop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('file-upload-drop-n-down-mouse-drag');
            
            const dataTransfer = event.dataTransfer;
            const files = dataTransfer.files;

            if(event.currentTarget.id === 'file-upload-drop-n-down-image') {
                this.$store.dispatch('CommonModule/uploadMainImageFile', [...files]);
            }
        },
        onChangeToolColor(e) {
            this.toolColor = e;
        },
        onChangeRoughnessColor(e) {
            this.roughnessColor = e;
        },
        onChangeTouchedColor(e) {
            this.touchedColor = e;
        },
        setMilldiameter() {
            this.showModalToolSetting = true;
        },
        closeModalToolSetting() {
            this.showModalToolSetting = false;
        },
        closeModalApplyToolSetting(e) {
            this.showModalToolSetting = false;
            this.millDiameter = e;
        },
        setNcStartpoint() {
           this.showModalNcStartpointSetting = true;
        },
        closeModalNcStartpointSetting() {
            this.showModalNcStartpointSetting = false;
        },
        closeModalApplyNcStartpointSetting(e) {
            this.showModalNcStartpointSetting = false;
            this.ncStartpoint = e;
        },
        receiveDrawingOriginClickPosition(e) {
            this.imageOrigin = { x: e.X, y: e.Y };
        },
        receiveDrawingOriginError(e) {
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'Error (DrawingOrigin): '.concat(e), color: 2 });
        },
        receiveDrawingRelationClickDrawingLength(e) {
            this.currentPixelLength = e;
            this.showModalRelationSetting = true;
        },
        closeModalRelationSetting() {
            this.showModalRelationSetting = false;
        },
        closeModalApplyRelationSetting(e) {
            this.showModalRelationSetting = false;
            this.relationPixelPerMM = e;
        },
        receiveDrawingRelationError(e) {
            this.$store.dispatch('MessageConsoleModule/addMessage', { text: 'Error (DrawingRelation): '.concat(e), color: 2 });
        },
    },
    watch: {
        /*eslint-disable */
        profileData: {
            handler(newVal, oldVal) {
                this.mainImage = this.profileData.mainImage;
                this.toolColor = this.profileData.toolColor;
                this.roughnessColor = this.profileData.roughnessColor;
                this.touchedColor = this.profileData.touchedColor;
                this.millDiameter = this.profileData.millDiameter;
                this.relationPixelPerMM = this.profileData.relationPixelPerMM;
                this.imageOrigin = this.profileData.imageOrigin;
                this.ncStartpoint = this.profileData.ncStartpoint;
            },
            deep: false
        },
        uploadStateMainImage(newValue, oldValue) {
            if(newValue === 0 && oldValue === 1) {
               this.$refs.refDropBoxImage.classList.remove('file-upload-drop-n-down-draghover');
               this.$refs.refDropBoxImage.classList.remove('file-upload-drop-n-down-mouse-drag');
            }
        },
        uploadedMainImage(newValue, oldValue) {
            this.mainImage = newValue;
        }
        /*eslint-enable */
    },
};
</script>
