<template>
    <div class="row">
        <div class="col controller-box-container">
            <div class="row px-3">
               <div class="col-sm-6 px-0">
                   <div class="text-line-content-container">
                       <p class="text-center">NC-Origin on image: X: {{ncOriginOnImage.x.toFixed(0)}} Y: {{ncOriginOnImage.y.toFixed(0)}} </p>
                   </div>
               </div>
               <div class="col-sm-6 px-0">
                   <div class="text-line-content-container">
                       <p class="text-center">NC-Startpoint: X: {{ncStartpoint.x.toFixed(3)}} Y: {{ncStartpoint.y.toFixed(3)}} </p>
                   </div>
               </div>
            </div>
            <div class="row px-3">
                <div class="col-4 px-0">
                    <ColorInfoBox
                        :color="toolColor"
                        :content="'Tool-Color'"
                    ></ColorInfoBox>
                </div>
                <div class="col-4 px-0">
                    <ColorInfoBox
                        :color="roughnessColor"
                        :content="'Roughness-Color'"
                    ></ColorInfoBox>
                </div>
                <div class="col-4 px-0">
                    <ColorInfoBox
                        :color="touchedColor"
                        :content="'Touched-Color'"
                    ></ColorInfoBox>
                </div>
            </div>
            <div class="row px-3">
                <div class="col-4 mt-3 px-1">
                    <div class="text-line-content-container">
                       <p class="text-center">Milltool-Diameter: {{millDiameter.toFixed(2)}} mm</p>
                   </div>
                </div>
                <div class="col-5 mt-3 px-1">
                    <div class="text-line-content-container">
                       <p class="text-center">Relation (pixel / mm): {{relationPixelPerMM.toFixed(3)}}</p>
                   </div>
                </div>
                <div class="col-3 mt-1 px-1" id="profile-settings">
                        <b-tooltip target="profile-settings" placement="top" delay="500" custom-class="tooltip-color-info-box" offset="100">
                            <p>open profile settings <i class="fas fa-tools"></i></p>
                        </b-tooltip>
                        <button
                            class="button-fontawesome-icon"
                            @click="clickSettings()"
                        ><i class="fas fa-tools"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ColorInfoBox from '../../ui/ColorInfoBox';

export default {
    name: 'ProfileController',
    components: {
       ColorInfoBox
    },
    props: {
        ncOriginOnImage: {
            default() {
                return { x: 12, y: 24 };
            }
        },
        ncStartpoint: {
            default() {
                return { x: 12, y: 24 };
            }
        },
        toolColor: {
            default: '#ff0000'
        },
        roughnessColor: {
            default: '#111155'
        },
        touchedColor: {
            default: '#cceecc'
        },
        millDiameter: {
            default: 100
        },
        relationPixelPerMM: {
            default: 0.5432
        }
    },
     methods: {
        clickSettings() {
            this.$emit("clickSettings");
        },
     }
};
</script>
