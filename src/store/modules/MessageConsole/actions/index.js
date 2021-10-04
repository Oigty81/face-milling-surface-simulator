import moment from 'moment';

export const actions = {
    addMessage({ commit, state }, { text, color }) {
        const messageList = state.messageList;
        const newEntry = {
                timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                text: text,
                color: color,
        };
        messageList.unshift(newEntry);

        commit('CHANGE_MESSAGES_LIST', messageList);
    },
    clearMessage({ commit }) {
        commit('CHANGE_MESSAGES_LIST', []);
    },
};
