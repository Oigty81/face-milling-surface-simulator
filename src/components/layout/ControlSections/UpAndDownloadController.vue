<template>
    <div class="row">
        <div class="col controller-box-container">
            <div class="row mt-0 mx-0">
                <div class="col-4">
                    <div class="pl-1">
                        <button
                            class="button-column-width mt-2"
                            @click="clickResetProfile()"
                        >reset profile</button>
                    </div>
                </div>
                <div class="col-4">
                    <div class="pl-1">
                        <button
                            class="button-column-width mt-2"
                            @click="clickDownloadProfile()"
                        >download Profile (json)</button>
                    </div>
                </div>
                <div class="col-4">
                    <div class="mt-2" id="profile-upload-box">
                        <b-tooltip target="profile-upload-box" placement="top" delay="500" custom-class="tooltip-color-info-box" offset="100">
                            <p>drag a profile file (*.json) into this field</p>
                        </b-tooltip>
                        <div
                            class="file-upload-drop-n-down pt-1"
                            id="file-upload-drop-n-down-profile"
                            ref="refDropBoxProfile"
                            @dragover="dragover($event)"
                            @dragleave="dragleave($event)"
                            @drop="drop($event)"
                        >
                            <h3 class="text-center"><i class="fas fa-upload"></i></h3>
                            <p class="text-center">upload profile-file</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col pt-2">
                    <hr class="hr-line-white">
                </div>
            </div>
            <div class="row mx-0">
                <div class="col-4">
                    <div class="pb-2 pl-1">
                        <button
                            class="button-column-width mt-2"
                            @click="clickClearNcProgram()"
                        >clear NC program</button>
                    </div>
                </div>
                <div class="col-4">
                    <div class="pb-2 pl-1">
                        <button
                            class="button-column-width mt-2"
                            @click="clickDownloadNcProgram()"
                        >download NC program (txt)</button>
                    </div>
                </div>
                <div class="col-4">
                    <div class="mt-2" id="ncprogram-upload-box">
                        <b-tooltip target="ncprogram-upload-box" placement="top" delay="500" custom-class="tooltip-color-info-box" offset="100">
                            <p>drag a cnc program file (*.txt) into this field</p>
                        </b-tooltip>
                        <div
                            class="file-upload-drop-n-down pt-1"
                            id="file-upload-drop-n-down-ncprogram"
                            ref="refDropBoxNcProgram"
                            @dragover="dragover($event)"
                            @dragleave="dragleave($event)"
                            @drop="drop($event)"
                        >
                            <h3 class="text-center"><i class="fas fa-upload"></i></h3>
                            <p class="text-center">upload nc-program</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'UpAndDownloadController',
    computed: {
        ...mapGetters('CommonModule', [
            'uploadStateProfile',
            'uploadStateNcProgram',
        ]),
    },
    methods: {
        clickResetProfile() {
            this.$emit("clickResetProfile");
        },
        clickDownloadProfile() {
            this.$emit("clickDownloadProfile");
        },
        clickClearNcProgram() {
            this.$emit("clickClearNcProgram");
        },
        clickDownloadNcProgram() {
            this.$emit("clickDownloadNcProgram");
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

            if(event.currentTarget.id === 'file-upload-drop-n-down-profile') {
                this.$store.dispatch('CommonModule/uploadProfileFile', [...files]);
            }

            if(event.currentTarget.id === 'file-upload-drop-n-down-ncprogram') {
                this.$store.dispatch('CommonModule/uploadNcProgramFile', [...files]);
            }
        }
    },
    watch: {
        uploadStateProfile(newValue, oldValue) {
            if(newValue === 0 && oldValue === 1) {
               this.$refs.refDropBoxProfile.classList.remove('file-upload-drop-n-down-draghover');
               this.$refs.refDropBoxProfile.classList.remove('file-upload-drop-n-down-mouse-drag');
            }
        },
        uploadStateNcProgram(newValue, oldValue) {
            if(newValue === 0 && oldValue === 1) {
               this.$refs.refDropBoxNcProgram.classList.remove('file-upload-drop-n-down-draghover');
               this.$refs.refDropBoxNcProgram.classList.remove('file-upload-drop-n-down-mouse-drag');
            }
        }
    }
};
</script>
