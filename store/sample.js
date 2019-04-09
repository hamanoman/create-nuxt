// 状態の管理
export const state = () => ({
}) // モジュールステートはすでにネストされており、名前空間のオプションによって影響を受けません

export const getters = {
  isAdmin () {
  } // -> getters['account/isAdmin']
}
export const actions = {
  login () {
  } // -> dispatch('account/login')
}
export const mutations = {
  login () {
  } // -> commit('account/login')
}
