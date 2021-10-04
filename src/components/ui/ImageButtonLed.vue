<template>
    <div class="image-button-container-led">
        <div class="row">
            <div class="col">
                <button
                    class="image-button"
                    @click="clickButton()"
                ><img :src="buttonImage" alt="-" class="image-button-image"></button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div
                    class="image-button-led"
                    :class="{'image-button-led-highlighting': buttonLedGlow}"
                >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImageButtonLed',
    props: {
        buttonImage: {
            default: null
        },
        buttonLedGlow: {
            default: false
        },
    },
    methods: {
        clickButton() {
            this.$emit("click");
        }
    }
};
</script>
