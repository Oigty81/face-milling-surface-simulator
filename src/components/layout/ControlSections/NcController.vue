<template>
    <div class="row">
        <div class="col controller-box-container">
            <div class="row mx-0">
                <div class="col-2">
                    <ImageButtonLed
                        :buttonImage="imageNcStart"
                        :buttonLedGlow="ledGlowNcStart"
                        @click="clickNcStart()"
                    ></ImageButtonLed>
                </div>
                <div class="col-2">
                    <ImageButtonLed
                        :buttonImage="imageNcStop"
                        :buttonLedGlow="ledGlowNcStop"
                        @click="clickNcStop()"
                    ></ImageButtonLed>
                </div>
                <div class="col-2">
                    <ImageButton
                        :buttonImage="imageNcReset"
                        @click="clickNcReset()"
                    ></ImageButton>
                </div>
                <div class="col-6">
                    <div class="simulation-velocity-container">
                        <div class="row">
                            <div class="col pt-1">
                                <p class="text-center">simulation velocity / feed override</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col pt-1 px-4">
                                <vue-slider
                                        v-model="velocityValue"
                                        :min="1"
                                        :max="10"
                                        :interval= "1"
                                        :tooltip="'none'"
                                        @change="velocitySliderChange()"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col pt-1">
                                <p class="text-center">{{velocityValue}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <hr class="hr-line-white">
                </div>
            </div>
            <div class="row mx-1 mb-1">
                <div class="col-4">
                    <p>NC-Position:</p>
                </div>
                <div class="col-4">
                    <p>X:{{'\xa0'}}{{ncPositionX.toFixed(3)}}</p>
                </div>
                <div class="col-4">
                    <p>Y:{{'\xa0'}}{{ncPositionY.toFixed(3)}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

import ImageButtonLed from '../../ui/ImageButtonLed';
import ImageButton from '../../ui/ImageButton';

export default {
    name: 'NcController',
    components: {
        VueSlider,
        ImageButtonLed,
        ImageButton
    },
    props: {
        ledGlowNcStart: {
            default: false
        },
        ledGlowNcStop: {
            default: false
        },
        ncPositionX: {
            default: 0
        },
        ncPositionY: {
            default: 0
        },
    },
    mounted: function() {
        this.$emit("changeVelocity", this.velocityValue);
    },
    data() {
      return {
        imageNcStart: require('../../../assets/buttonNcStart.png'),
        imageNcStop: require('../../../assets/buttonNcStop.png'),
        imageNcReset: require('../../../assets/buttonNcReset.png'),

        velocityValue: 3,
      };
    },
    methods: {
        clickNcStart() {
            this.$emit("clickNcStart");
        },
        clickNcStop() {
            this.$emit("clickNcStop");
        },
        clickNcReset() {
            this.$emit("clickNcReset");
        },
        velocitySliderChange() {
            this.$emit("changeVelocity", this.velocityValue);
        },
    }
};
</script>
