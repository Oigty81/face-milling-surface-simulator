export const getters = {
    profileData: (state) => {
        if(state.trigger === true) {
            return {
                    mainImage: '',
                    toolColor: '#ff0000',
                    roughnessColor: '#ff0000',
                    touchedColor: '#cccccc',
                    millDiameter: 40,
                    relationPixelPerMM: 1,
                    imageOrigin: { x: 0, y: 0 },
                    ncStartpoint: { x: 0, y: 0 },
                    defaultTR: 5,
                    defaultFeed: 1.0,
                    toolBlades: 1,
            };
        } else {
            return state.data;
        }
    }
};
