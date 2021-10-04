<template>
    <div>
        <b-modal
            ref="modal-info"
            size="lg"
            header-class="bg-dialog"
            content-class="bg-dialog"
            @hide="doHide"
        >
            <div class="d-block">
                <div class="row mt-1 px-1">
                    <div class="col my-auto">
                        <h3>Henry Voigt</h3>
                    </div>
                </div>
                <div class="row mt-1 px-1">
                    <div class="col my-auto">
                        <p><i class="fas fa-map-marker-alt"></i> Dresden, Germany</p>
                    </div>
                </div>
            </div>
            <template #modal-header="{}">
                <h2 class="text-center" style="color: white;"><i class="fas fa-info"></i>{{'\xa0\xa0'}}Info</h2>
            </template>
            <template #modal-footer="{ close }">
                <b-button size="lg" class="button-column-width float-right" @click="close()">
                    Close
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
    ],
    methods: {
        doHide() {
            this.$emit("closeModal");
            this.$refs['modal-info'].hide();
        },
    },
    watch: {
        /*eslint-disable */
        modalShow: {
            handler(newVal, oldVal) {
                if(newVal === true) {
                    this.$refs['modal-info'].show();
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
</style>
