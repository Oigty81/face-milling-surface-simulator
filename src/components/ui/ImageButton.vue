<template>
    <div
        :class="[smallButton ? 'image-button-container-sm' : 'image-button-container']"
    >
        <button
            :class="[smallButton ? 'image-button-sm' : 'image-button']"
            @click="clickButton()"
        ><img
            alt="-"
            :src="buttonImage"
            :class="[smallButton ? 'image-button-image-sm' : 'image-button-image']"
        ></button>
    </div>
</template>

<script>
export default {
    name: 'ImageButton',
    props: {
        buttonImage: {
            default: null
        },
        smallButton: {
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
