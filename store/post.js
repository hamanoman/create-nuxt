import jsonData from '~/assets/json/data.json'

// 状態管理
export const state = () => ({
  data: jsonData,
})

// getters
export const getters = {
  getPosts (state) {
    return state.data;
  }
}
