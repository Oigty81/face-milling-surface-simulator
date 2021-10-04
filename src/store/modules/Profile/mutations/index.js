export const mutations = {
    SET_FULL_PROFILE(state, payload) {
        state.data = payload;
    },
    TRIGGER_PROFILE_DATA(state, payload) {
        state.trigger = payload;
    },
};
