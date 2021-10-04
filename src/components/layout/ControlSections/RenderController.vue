<template>
    <div class="row">
        <div class="col controller-box-container">
            <div class="row mx-0">
                <div class="col-2">
                    <ImageButton
                        :buttonImage="imageZoomPositive"
                        :smallButton="true"
                        @click="clickZoomPositive()"
                    ></ImageButton>
                </div>
                <div class="col-2">
                    <ImageButton
                        :buttonImage="imageZoomNegative"
                        :smallButton="true"
                        @click="clickZoomNegative()"
                    ></ImageButton>
                </div>
                <div class="col-2">
                    <ImageButton
                        :buttonImage="imageZoomReset"
                        :smallButton="true"
                        @click="clickZoomReset()"
                    ></ImageButton>
                </div>
                <div class="col-6">
                    <button
                        class="button-column-width mt-2"
                        @click="clickResetRoughnessTrack()"
                    >reset roughness</button>
                </div>
            </div>
            <div class="row mx-0">
                <div class="col-7 pr-0">
                    <div class="samples-per-refresh-slider-container">
                        <div class="row mx-0">
                            <div class="col pt-1">
                                <p class="text-center">NC-sample steps per canvas refresh: {{String(refreshSliderValue).padStart(2, '0')}}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col pt-0 px-4">
                                <vue-slider
                                        v-model="refreshSliderValue"
                                        :min="5"
                                        :max="20"
                                        :interval= "1"
                                        :tooltip="'none'"
                                        @change="ncSamplesPerRefreshSliderChange()"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-5 pl-0">
                    <div class="pt-1 pl-1">
                        <button
                            class="button-column-width mt-2"
                            @click="clickDownloadCanvas()"
                        >download current image</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

import ImageButton from '../../ui/ImageButton';

export default {
    name: 'RenderController',
    components: {
        VueSlider,
        ImageButton
    },
     mounted: function() {
        this.$emit("changeNcSamplesPerRefreshSliderChange", this.refreshSliderValue);
    },
    data() {
      return {
        imageZoomPositive: require('../../../assets/zoomPositive.png'),
        imageZoomNegative: require('../../../assets/zoomNegative.png'),
        imageZoomReset: require('../../../assets/zoomReset.png'),
        
        refreshSliderValue: 8,
      };
    },
    methods: {
        clickZoomPositive() {
            this.$emit("clickZoomPositive");
        },
        clickZoomNegative() {
            this.$emit("clickZoomNegative");
        },
        clickZoomReset() {
            this.$emit("clickZoomReset");
        },
        clickResetRoughnessTrack() {
            this.$emit("clickResetRoughnessTrack");
        },
        ncSamplesPerRefreshSliderChange() {
            this.$emit("changeNcSamplesPerRefreshSliderChange", this.refreshSliderValue);
        },
        clickDownloadCanvas() {
            this.$emit("clickDownloadCanvas");
        }
    }
};
</script>
