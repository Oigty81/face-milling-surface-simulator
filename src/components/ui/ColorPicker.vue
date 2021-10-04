<template>
    <div class="color-picker-container pt-1">
        <div class="row mx-0">
            <div class="col-5 pl-1">
                <input
                    type="color"
                    name="colorpicker"
                    class="button-color-picker"
                    :value="colorValue"
                    @change="changeColorValue($event)"
                >
            </div>
            <div class="col-7 pl-1">
                <p class="my-2"> {{'\xa0\xa0'}}{{colorValue}} </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ColorPicker',
    props: {
        colorValue: {
            default: '#ff0000'
        },
    },
    methods: {
        changeColorValue(e) {
           this.$emit("change", e.target.value);
        }
    }
};
</script>
