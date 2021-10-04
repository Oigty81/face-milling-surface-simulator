import parseProgramText from '../../../../utilities/Nc/parseProgramText';
import generateSamples from '../../../../utilities/Nc/generateSamples';

export const actions = {
    loadNcProgramText({ commit, dispatch, rootState }, { ncProgramText }) {
        commit('SET_NC_LOAD_AND_INITIALIZE', true);
        
        dispatch('stopNc');
        dispatch('resetNc');
        
        const ncBlockData = parseProgramText(
            ncProgramText, rootState.ProfileModule.data.ncStartpoint.x, rootState.ProfileModule.data.ncStartpoint.y, rootState.ProfileModule.data.defaultTR, rootState.ProfileModule.data.defaultFeed
        );

        if(ncBlockData.errorList !== undefined && ncBlockData.errorList.length > 0) {
            ncBlockData.errorList.forEach(e => {
                 dispatch('MessageConsoleModule/addMessage', { text: e.errorText, color: 2 }, { root: true });
            });
            commit('SET_NC_LOAD_AND_INITIALIZE', false);
            commit('SET_NC_MEMORY', undefined);
        } else {
            dispatch('MessageConsoleModule/addMessage', { text: "load nc program ... successfully", color: 1 }, { root: true });
            
            const ncSamples = generateSamples(ncBlockData, rootState.ProfileModule.data.ncStartpoint.x, rootState.ProfileModule.data.ncStartpoint.y, rootState.ProfileModule.data.toolBlades);
            if(ncSamples.error > 0) {
                dispatch('MessageConsoleModule/addMessage', { text: ncSamples.error.errorText, color: 2 }, { root: true });
                commit('SET_NC_LOAD_AND_INITIALIZE', false);
                commit('SET_NC_MEMORY', undefined);
            } else {
                dispatch('MessageConsoleModule/addMessage', { text: "generate nc samples ... successfully", color: 1 }, { root: true });
                const ncMemory = {
                    blocksAsText: ncBlockData.blocksAsText,
                    samples: ncSamples.ncSampleList
                };
                commit('SET_NC_LOAD_AND_INITIALIZE', false);
                commit('SET_NC_MEMORY', ncMemory);
            }
        }
    },
    clearNc({ commit, dispatch, state }) {
        if(state.ncRun === true) {
            dispatch('MessageConsoleModule/addMessage', { text: "stop nc first!!!", color: 2 }, { root: true });
        } else {
            dispatch('MessageConsoleModule/addMessage', { text: "clear nc memory", color: 0 }, { root: true });
            commit('SET_NC_MEMORY', undefined);
        }
    },
    startNc({ commit, dispatch, state }) {
        if(state.ncMemory !== undefined && state.ncMemory.samples !== undefined && state.ncMemory.samples.length > 0) {
            if(state.ncRun === false) {
                dispatch('MessageConsoleModule/addMessage', { text: "start nc", color: 0 }, { root: true });
                state.ncRun = true;
                state.intervalHandle = setInterval(() => {
                    // TODO: decouple ncSimulationVelocity count current samples, instead use ncSimulationVelocity to reset set timer
                    const v = state.currentTickerValue + state.ncSimulationVelocity;
                    if(state.currentNcSamplePosition >= state.ncMemory.samples.length - state.ncSimulationVelocity) {
                        dispatch('stopNc');
                        dispatch('resetNc');
                    } else {
                        commit('SET_NC_CURRENT_TICKER_VALUE', v);
                        commit('SET_CURRENT_NC_SAMPLEPOSITION', state.currentTickerValue);
                    }
                }, 1);
            }
        } else {
            dispatch('MessageConsoleModule/addMessage', { text: "no nc program found", color: 2 }, { root: true });
        }
    },
    stopNc({ dispatch, state }) {
        if(state.ncRun === true) {
            dispatch('MessageConsoleModule/addMessage', { text: "stop nc", color: 0 }, { root: true });
            state.ncRun = false;
            clearInterval(state.intervalHandle);
        }
    },
    resetNc({ commit, dispatch, state }) {
        if(state.ncRun === true) {
            dispatch('MessageConsoleModule/addMessage', { text: "stop nc first!!!", color: 2 }, { root: true });
        } else {
            dispatch('MessageConsoleModule/addMessage', { text: "reset nc", color: 0 }, { root: true });
            commit('SET_NC_CURRENT_TICKER_VALUE', 0);
            commit('SET_CURRENT_NC_SAMPLEPOSITION', 0);
        }
    },
    setNcSimulationVelocity({ commit }, velocity) {
        if(velocity > 0 && velocity < 11) {
            commit('SET_NC_SIMULATION_VELOCITY', velocity);
        } else {
             commit('SET_NC_SIMULATION_VELOCITY', 1);
        }
    }
};
