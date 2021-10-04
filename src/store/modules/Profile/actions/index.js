export const actions = {
    loadProfile({ commit, dispatch }, {
        mainImage,
        toolColor,
        roughnessColor,
        touchedColor,
        millDiameter,
        relationPixelPerMM,
        imageOrigin,
        ncStartpoint
    }) {
        dispatch('NcModule/stopNc', null, { root: true });
        dispatch('NcModule/resetNc', null, { root: true });
    
        const data = {
            mainImage: mainImage,
            toolColor: toolColor,
            roughnessColor: roughnessColor,
            touchedColor: touchedColor,
            millDiameter: millDiameter,
            relationPixelPerMM: relationPixelPerMM,
            imageOrigin: imageOrigin,
            ncStartpoint: ncStartpoint,
            defaultTR: 1,
            defaultFeed: 1.0,
            toolBlades: 1,
        };
        commit('SET_FULL_PROFILE', data);
    },

    triggerProfilData({ commit }) {
        commit('TRIGGER_PROFILE_DATA', true);
        setTimeout(() => {
            commit('TRIGGER_PROFILE_DATA', false);
        }, 400);
    }
};
