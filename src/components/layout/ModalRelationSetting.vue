<template>
    <div>
        <b-modal
            ref="modal-relation-setting"
            size="lg"
            header-class="bg-dialog"
            content-class="bg-dialog"
            @hide="doHide" no-close-on-backdrop
        >
            <div class="d-block">
                <div class="row mt-1 px-1">
                    <div class="col">
                        <h3>current picked pixel length is <span class="text-warning header-text-3">{{currentPixelLength.toFixed(0)}}</span> pixel </h3>
                    </div>
                </div>
                <div class="row mt-3 px-1">
                    <div class="col-9 my-auto">
                        <p class="">set length in mm for the current pixel length: </p>
                    </div>
                    <div class="col-3">
                        <input
                            ref="input-1"
                            class="modal-input"
                            type="text"
                            v-model="lengthInMM"
                            @input="changeTextbox"
                            @change="changeTextbox"
                            @keyup="keyup"
                        >
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col px-0">
                        <hr class="hr-line-white">
                    </div>
                </div>
                <div class="row mt-2 px-1">
                    <div class="col">
                        <p class="text-center">preview relation <span class="text-warning"> {{currentRelation.toFixed(2)}} </span> (pixel / mm) </p>
                    </div>
                </div>
            </div>
            <template #modal-header="{}">
                <h2 class="text-center" style="color: white;"><i class="fas fa-tools"></i> Set Relation (pixel / mm)</h2>
            </template>
            <template #modal-footer="{ close }">
                 <b-button ref="btn-apply" :disabled="applyButtonDisabled" size="lg" class="button-column-width float-right" @click="applySettings()">
                    Apply
                </b-button>
                <b-button size="lg" class="button-column-width float-right" @click="close()">
                    Cancel
                </b-button>
            </template>
            
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ModalRelationSetting',
    props: [
        "modalShow",
        "currentPixelLength"
    ],
    computed: {
        applyButtonDisabled: function () {
            if(this.lengthInMM < 0.1 || this.lengthInMM > 1000.0) {
                return true;
            } else {
                return false;
            }
        },
        currentRelation: function () {
            if(this.lengthInMM < 0.1 || this.lengthInMM > 1000.0 || this.lengthInMM === "") {
                return 1.0;
            } else {
                return this.currentPixelLength / this.lengthInMM;
            }
        }
    },
    data: function () {
        return {
            lengthInMM: "5.0",
            lengthInMMOldValue: "5.0",
        };
    },
    methods: {
        changeTextbox(event) {
            const val = event.target.value.trim();
            const test = /^(?:\d*)(?:\.?)(?:\d*)$/.test(val);

            if (test) {
                this.lengthInMM = val;
                this.lengthInMMOldValue = val;
            } else {
                this.lengthInMM = this.lengthInMMOldValue;
            }
        },
        keyup(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.$refs['btn-apply'].click();
            }
        },
        doHide() {
            this.$emit("closeModal");
            this.$refs['modal-relation-setting'].hide();
        },
        applySettings() {
            this.$emit("closeModalApply", parseFloat(this.currentRelation));
            this.$refs['modal-relation-setting'].hide();
        },
    },
    watch: {
        /*eslint-disable */
        modalShow: {
            handler(newVal, oldVal) {
                if(newVal === true) {
                    this.$refs['modal-relation-setting'].show();
                    setTimeout(() => {
                        this.$refs['input-1'].focus();
                    }, 200);
                    this.lengthInMM = "".concat(this.currentPixelLength.toFixed(1));
                    this.lengthInMMOldValue = "".concat(this.currentPixelLength.toFixed(1));
                }
            },
            deep: false
        },
        /*eslint-enable */
    },
};
</script>

<style scoped>
    /deep/ .modal {
        overflow-y: hidden !important;
    }

    /deep/ .modal-dialog {
        max-width: 340px;
        border-radius: 0.3rem;
    }

    /deep/ .modal-dialog input{
        max-width: 60px;
    }
</style>
