import {Map as immutableMap} from 'immutable';
import {getField, updateField} from 'vuex-map-fields';

const STATE = immutableMap({
  date: Date.now(),
  already_mined: null,
  reward: null,
  remaining: null,
  difficulty: null,
  bitsPerSecond: null,
  encryptionsPerSecond: null
});

export const state = () => STATE.toJS();

export const getters = {
  getField,
};

export const mutations = {
  updateField,
  clean(state) {
    Object.assign(state, {
      ...STATE.toJS(),
      date: Date.now(),
    });
  },
};

export const actions = {
  async load({ commit }) {
    try {
      // { alreadyMined, reward, remaining }
      const data = await this.$axios.$get('https://pkt.cash/api/v1/PKT/pkt/stats/coins');
      // /api/v1/PKT/pkt/chain/down
      const difficulty = await this.$axios.$get('https://pkt.cash/api/v1/PKT/pkt/chain/down/1')
      const stats = await this.$axios.$get('https://pkt.cash/api/v1/PKT/pkt/packetcrypt/stats/1/')

      commit('updateField', { path: 'already_mined', value: data.alreadyMined })
      commit('updateField', { path: 'reward', value: data.reward })
      commit('updateField', { path: 'remaining', value: data.remaining })
      commit('updateField', { path: 'difficulty', value: Math.floor(difficulty.results[0].difficulty) })
      commit('updateField', { path: 'bitsPerSecond', value: stats.results[0].bitsPerSecond })
      commit('updateField', { path: 'encryptionsPerSecond', value: stats.results[0].encryptionsPerSecond * 1000000 })
    } catch (e) {
      // commit('updateField', { path: 'status', value: 'error' })
    }
  },
  async update_data({ commit }) {
    try {
      const data = await this.$axios.$get('https://pkt.cash/api/v1/PKT/pkt/stats/coins');
      const difficulty = await this.$axios.$get('https://pkt.cash/api/v1/PKT/pkt/chain/down/1')

      commit('updateField', { path: 'already_mined', value: data.alreadyMined })
      commit('updateField', { path: 'reward', value: data.reward })
      commit('updateField', { path: 'remaining', value: data.remaining })
      commit('updateField', { path: 'difficulty', value: Math.floor(difficulty.results[0].difficulty) })
    } catch (e) {

    }
  }
}
