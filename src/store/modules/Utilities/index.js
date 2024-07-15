import axios from 'axios';

const state = {
    
};

const actions = {
    
    appMinimize() {
        axios({
            method: 'get',
            url: 'api/utilities/minimize'
        });
    },

    appQuit() {
        axios({
            method: 'get',
            url: 'api/utilities/quit'
        });
    },
};

const mutations = {

};
  
const getters = {
    
};

const UtiliesModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default UtiliesModule;
