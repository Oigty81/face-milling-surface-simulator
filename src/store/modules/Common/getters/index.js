export const getters = {
    navbarHeight: state => state.navbarHeight,
    showModalInfo: state => state.showModalInfo,
    
    uploadStateProfile: state => state.uploadStateProfile,
    uploadStateNcProgram: state => state.uploadStateNcProgram,
    uploadStateMainImage: state => state.uploadStateMainImage,
    uploadedMainImage: state => state.uploadedMainImage,
    currentUrlGetQuery: state => {
        if(state.currentUrlGetQuery === undefined) {
            return {};
        } else {
            return state.currentUrlGetQuery;
        }
    },
};
