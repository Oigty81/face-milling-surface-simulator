export const mutations = {
    SET_NAVBAR_HEIGHT (state, payload) {
        state.navbarHeight = payload;
    },
    SET_MODAL_INFO (state, payload) {
        state.showModalInfo = payload;
    },
    UPDATE_UPLOAD_STATE_PROFILE (state, payload) {
        state.uploadStateProfile = payload;
    },
    UPDATE_UPLOAD_STATE_NC_PROGRAM (state, payload) {
        state.uploadStateNcProgram = payload;
    },
    UPDATE_UPLOAD_STATE_MAIN_IMAGE (state, payload) {
        state.uploadStateMainImage = payload;
    },
    SET_UPLOADED_MAIN_IMAGE (state, payload) {
        state.uploadedMainImage = payload;
    },
    SET_URL_GET_QUERY (state, payload) {
        state.currentUrlGetQuery = payload;
    },
};
