<template>
    <div>
        <b-modal
            ref="modal-tool-setting"
            size="lg"
            header-class="bg-dialog"
            content-class="bg-dialog"
            @hide="doHide"
            no-close-on-backdrop
        >
            <div class="d-block">
                <div class="row mt-1 px-1">
                    <div class="col-9 my-auto">
                        <p>Milltool-Diameter (1 - 400 mm): </p>
                    </div>
                    <div class="col-3">
                        <input
                            ref="input-1"
                            class="modal-input"
                            type="text"
                            v-model="millDiameter"
                            @input="changeTextbox"
                            @change="changeTextbox"
                            @keyup="keyup"
                        >
                    </div>
                </div>
            </div>
            <template #modal-header="{}">
                <h2 class="text-center" style="color: white;"><i class="fas fa-tools"></i> Set Milltool-Diameter</h2>
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
    name: 'ModalToolSetting',
    props: [
        "modalShow",
        "currentDiameter"
    ],
    computed: {
        applyButtonDisabled: function () {
            if(this.millDiameter < 1.0 || this.millDiameter > 400.0) {
                return true;
            } else {
                return false;
            }
        }
    },
    data: function () {
        return {
            millDiameter: "1.0",
            millDiameterOldValue: "1.0",
        };
    },
    methods: {
        changeTextbox(event) {
            const val = event.target.value.trim();
            const test = /^(?:\d*)(?:\.?)(?:\d*)$/.test(val);

            if (test) {
                this.millDiameter = val;
                this.millDiameterOldValue = val;
            } else {
                this.millDiameter = this.millDiameterOldValue;
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
            this.$refs['modal-tool-setting'].hide();
        },
        applySettings() {
            this.$emit("closeModalApply", parseFloat(this.millDiameter));
            this.$refs['modal-tool-setting'].hide();
        },
    },
    watch: {
        /*eslint-disable */
        modalShow: {
            handler(newVal, oldVal) {
                if(newVal === true) {
                    this.$refs['modal-tool-setting'].show();
                    setTimeout(() => {
                        this.$refs['input-1'].focus();
                    }, 200);
                    this.millDiameter = "".concat(this.currentDiameter);
                    this.millDiameterOldValue = "".concat(this.currentDiameter);
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
