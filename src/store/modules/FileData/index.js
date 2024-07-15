import axios from 'axios';

const state = {
    
};

const actions = {
    intendLoadProfile({ dispatch }) {
        axios({
            method: 'get',
            url: 'api/data/intendLoadProfile'
        })
        .then(() => {
            dispatch('MessageConsoleModule/addMessage', { text: "intend load profile", color: 1 }, { root: true });
        })
        .catch((error) => {
            console.log("error intendLoadProfile() ", error);
        });
    },

    intendLoadCncFile({ dispatch }) {
        axios({
            method: 'get',
            url: 'api/data/intendLoadCncFile'
        })
        .then(() => {
            dispatch('MessageConsoleModule/addMessage', { text: "intend load nc program", color: 1 }, { root: true });
        })
        .catch((error) => {
            console.log("error intendLoadCncFile()", error);
        });
    },

    intendLoadImageFile({ dispatch }) {
        axios({
            method: 'get',
            url: 'api/data/intendLoadImageFile'
        })
        .then(() => {
            dispatch('MessageConsoleModule/addMessage', { text: "intend load image file", color: 1 }, { root: true });
        })
        .catch((error) => {
            console.log("error intendLoadImageFile()", error);
        });
    },

    saveProfile({ dispatch }, content) {
        axios({
            method: 'post',
            url: 'api/data/saveProfile',
            data: { content: content }
        })
        .then(() => {
            dispatch('MessageConsoleModule/addMessage', { text: "save profile", color: 1 }, { root: true });
        })
        .catch((error) => {
            console.log("error saveProfile()", error);
        });
    },

    saveCnc({ dispatch }, content) {
        axios({
            method: 'post',
            url: 'api/data/saveCnc',
            data: { content: content }
        })
        .then(() => {
            dispatch('MessageConsoleModule/addMessage', { text: "save nc program", color: 1 }, { root: true });
        })
        .catch((error) => {
            console.log("error saveCnc()", error);
        });
    },

};

const mutations = {

};
  
const getters = {
    
};

const FileDataModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default FileDataModule;
