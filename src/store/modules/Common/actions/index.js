import axios from 'axios';

export const actions = {
    uploadProfileFile({ commit, dispatch }, files) {
        commit('UPDATE_UPLOAD_STATE_PROFILE', 1);

        if(files.length > 1) {
            dispatch('MessageConsoleModule/addMessage', { text: 'profile file multi upload not allowed!', color: 2 }, { root: true });
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_PROFILE', 0);
            }, 500);
            return;
        }

        if(files[0].size > process.env.VUE_APP_MAX_FILE_SIZE_UPLOAD) {
            dispatch('MessageConsoleModule/addMessage', { text: "profile file: '".concat(files[0].name).concat("' file size limit exceeded!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_PROFILE', 0);
            }, 500);
            return;
        }

        if(files[0].type !== 'application/json') {
            dispatch('MessageConsoleModule/addMessage', { text: "profile file: '".concat(files[0].name).concat("' wrong file type!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_PROFILE', 0);
            }, 500);
            return;
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
       
        reader.onload = function(content) {
            try {
                const destData = content.target.result.replace('data:application/json;base64,', '');
                const o = JSON.parse(atob(destData));
                
                dispatch('ProfileModule/loadProfile', {
                    mainImage: o.mainImage,
                    toolColor: o.toolColor,
                    roughnessColor: o.roughnessColor,
                    touchedColor: o.touchedColor,
                    millDiameter: o.millDiameter,
                    relationPixelPerMM: o.relationPixelPerMM,
                    imageOrigin: { x: o.imageOrigin.x, y: o.imageOrigin.y },
                    ncStartpoint: { x: o.ncStartpoint.x, y: o.ncStartpoint.y }
                }, { root: true });
            } catch (e) {
                dispatch('MessageConsoleModule/addMessage', { text: "error loading profile file: '".concat(e.toString()), color: 2 }, { root: true });
            }
             
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_PROFILE', 0);
            }, 500);
        };
    },
    uploadNcProgramFile({ commit, dispatch }, files) {
        commit('UPDATE_UPLOAD_STATE_NC_PROGRAM', 1);

        if(files.length > 1) {
            dispatch('MessageConsoleModule/addMessage', { text: 'nc program file multi upload not allowed!', color: 2 }, { root: true });
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_NC_PROGRAM', 0);
            }, 500);
            return;
        }

        if(files[0].size > process.env.VUE_APP_MAX_FILE_SIZE_UPLOAD) {
            dispatch('MessageConsoleModule/addMessage', { text: "nc program file: '".concat(files[0].name).concat("' file size limit exceeded!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_NC_PROGRAM', 0);
                }, 500);
            return;
        }

        if(files[0].type !== 'text/plain') {
            dispatch('MessageConsoleModule/addMessage', { text: "nc program file: '".concat(files[0].name).concat("' wrong file type!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_NC_PROGRAM', 0);
                }, 500);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = function(content) {
            try {
                const destData = content.target.result.replace('data:text/plain;base64,', '');
            
                dispatch('NcModule/loadNcProgramText', { ncProgramText: atob(destData) }, { root: true });
                
                setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_NC_PROGRAM', 0);
                }, 500);
            } catch (e) {
                dispatch('MessageConsoleModule/addMessage', { text: "error loading nc program file: '".concat(e.toString()), color: 2 }, { root: true });
            }
        };
    },
    uploadMainImageFile({ commit, dispatch }, files) {
        commit('UPDATE_UPLOAD_STATE_MAIN_IMAGE', 1);

        if(files.length > 1) {
            dispatch('MessageConsoleModule/addMessage', { text: 'image file multi upload not allowed!', color: 2 }, { root: true });
            setTimeout(function() {
                commit('UPDATE_UPLOAD_STATE_MAIN_IMAGE', 0);
            }, 500);
            return;
        }

        if(files[0].size > process.env.VUE_APP_MAX_FILE_SIZE_UPLOAD) {
            dispatch('MessageConsoleModule/addMessage', { text: "image file: '".concat(files[0].name).concat("' file size limit exceeded!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_MAIN_IMAGE', 0);
                }, 500);
            return;
        }

        if(files[0].type !== 'image/png' && files[0].type !== 'image/bmp') {
            dispatch('MessageConsoleModule/addMessage', { text: "image file: '".concat(files[0].name).concat("' wrong file type!"), color: 2 }, { root: true });
            
            setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_MAIN_IMAGE', 0);
                }, 500);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(files[0]);

        reader.onload = function(content) {
            try {
                const img = new Image();
                img.src = content.target.result;
                img.onload = () => {
                    if((img.width > 2048) || (img.height > 2048)) {
                        dispatch('MessageConsoleModule/addMessage', { text: "image to large! (" + img.width + " x " + img.height + ")", color: 2 }, { root: true });
                    } else {
                        commit('SET_UPLOADED_MAIN_IMAGE', content.target.result);
                    }
                };
                setTimeout(function() {
                    commit('UPDATE_UPLOAD_STATE_MAIN_IMAGE', 0);
                    }, 500);
            } catch (e) {
                dispatch('MessageConsoleModule/addMessage', { text: "error loading image file: '".concat(e.toString()), color: 2 }, { root: true });
            }
        };
    },
    loadDemo({ dispatch }, { profile, ncProgram }) {
        axios({
            method: 'get',
            url: profile
        })
        .then((response) => {
            const o = response.data;
            dispatch('ProfileModule/loadProfile', {
                mainImage: o.mainImage,
                toolColor: o.toolColor,
                roughnessColor: o.roughnessColor,
                touchedColor: o.touchedColor,
                millDiameter: o.millDiameter,
                relationPixelPerMM: o.relationPixelPerMM,
                imageOrigin: { x: o.imageOrigin.x, y: o.imageOrigin.y },
                ncStartpoint: { x: o.ncStartpoint.x, y: o.ncStartpoint.y }
            }, { root: true });
            dispatch('MessageConsoleModule/addMessage', { text: 'load new profile', color: 1 }, { root: true });

            axios({
                method: 'get',
                url: ncProgram
            })
            .then((response) => {
                dispatch('NcModule/loadNcProgramText', { ncProgramText: response.data }, { root: true });
            })
            .catch((error) => {
                dispatch('MessageConsoleModule/addMessage', { text: ''.concat("error load demo nc program: ").concat(error), color: 2 }, { root: true });
                dispatch('NcModule/clearNc', null, { root: true });
            });
        })
        .catch((error) => {
            dispatch('MessageConsoleModule/addMessage', { text: ''.concat("error load demo demo profile: ").concat(error), color: 2 }, { root: true });
            dispatch('NcModule/clearNc', null, { root: true });
        });
    }
};
