export const state = () => ({
  list: []
})

// 状態の操作
export const mutations = {
  add (state, text) {
    state.list.push({
      text: text,
      done: false,
      id: state.list.length + 1,
    })
  },
  remove (state, todo) {
    console.log(todo);
    console.log(state.list.indexOf(todo));
    state.list.splice(state.list.indexOf(todo), 1)
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
