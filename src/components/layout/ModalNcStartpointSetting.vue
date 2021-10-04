<template>
    <div>
        <b-modal
            ref="modal-nc-position-setting"
            size="lg"
            header-class="bg-dialog"
            content-class="bg-dialog"
            @hide="doHide"
            no-close-on-backdrop
        >
            <div class="d-block">
                <div class="row mt-1 px-1">
                    <div class="col-9 my-auto">
                        <p>Position X (-1000 - 1000 mm): </p>
                    </div>
                    <div class="col-3">
                        <input
                            ref="input-1"
                            class="modal-input"
                            type="text"
                            v-model="positionX"
                            @input="changeTextboxX"
                            @change="changeTextboxX"
                            @keyup="keyup"
                        >
                    </div>
                </div>
                <div class="row mt-1 px-1">
                    <div class="col-9 my-auto">
                        <p>Position Y (-1000 - 1000 mm): </p>
                    </div>
                    <div class="col-3">
                        <input
                            class="modal-input"
                            type="text"
                            v-model="positionY"
                            @input="changeTextboxY"
                            @change="changeTextboxY"
                            @keyup="keyup"
                        >
                    </div>
                </div>
            </div>
            <template #modal-header="{}">
                <h2 class="text-center" style="color: white;"><i class="fas fa-tools"></i> Set NC-Startpoint</h2>
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
    name: 'ModalNcStartpointSetting',
    props: [
        "modalShow",
        "ncStartpoint"
    ],
    computed: {
        applyButtonDisabled: function () {
            if(this.positionX < -1000.0 || this.positionX > 1000.0 || this.positionY < -1000.0 || this.positionY > 1000.0 ||
                isNaN(this.positionX) || isNaN(this.positionY) || this.positionX === "" || this.positionY === "") {
                return true;
            } else {
                return false;
            }
        }
    },
    data: function () {
        return {
            positionX: "1.0",
            positionXOldValue: "1.0",
            positionY: "1.0",
            positionYOldValue: "1.0",
        };
    },
    methods: {
        changeTextboxX(event) {
            const val = event.target.value.trim();
            const test = /^-?(?:\d*)(?:\.?)(?:\d*)$/.test(val);

            if (test) {
                this.positionX = val;
                this.positionXOldValue = val;
            } else {
                this.positionX = this.positionXOldValue;
            }
        },
        changeTextboxY(event) {
            const val = event.target.value.trim();
            const test = /^-?(?:\d*)(?:\.?)(?:\d*)$/.test(val);

            if (test) {
                this.positionY = val;
                this.positionYOldValue = val;
            } else {
                this.positionY = this.positionYOldValue;
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
            this.$refs['modal-nc-position-setting'].hide();
        },
        applySettings() {
            this.$emit("closeModalApply", { x: parseFloat(this.positionX), y: parseFloat(this.positionY) });
            this.$refs['modal-nc-position-setting'].hide();
        },
    },
    watch: {
        /*eslint-disable */
        modalShow: {
            handler(newVal, oldVal) {
                if(newVal === true) {
                    this.$refs['modal-nc-position-setting'].show();
                    setTimeout(() => {
                        this.$refs['input-1'].focus();
                    }, 200);
                    this.positionX = "".concat(this.ncStartpoint.x);
                    this.positionXOldValue = "".concat(this.ncStartpoint.x);
                    this.positionY = "".concat(this.ncStartpoint.y);
                    this.positionYOldValue = "".concat(this.ncStartpoint.y);
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
