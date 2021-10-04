export const mutations = {
    SET_NC_LOAD_AND_INITIALIZE(state, payload) {
        state.ncLoadAndInitialize = payload;
    },
    SET_NC_MEMORY(state, payload) {
        state.ncMemory = payload;
        state.currentNcSamplePosition = 0;
    },
    SET_CURRENT_NC_SAMPLEPOSITION(state, payload) {
        state.currentNcSamplePosition = payload;
    },
    SET_NC_SIMULATION_VELOCITY(state, payload) {
        state.ncSimulationVelocity = payload;
    },
    SET_NC_CURRENT_TICKER_VALUE(state, payload) {
        state.currentTickerValue = payload;
    }
};
