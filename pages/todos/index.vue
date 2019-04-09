<template>
  <div class="contents">
    <ul>
      <li v-for="todo in todoList">
        <input type="checkbox" :checked="todo.done" @change="toggle(todo)">
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(todo)" class="removeButton">remove</button>
      </li>
    </ul>
    <input placeholder="What needs to be done?" @keyup.enter="addTodo" class="todoInput">
    <nuxt-link to="/" class="c-button">トップページ</nuxt-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    todoList () { return this.$store.state.todos.list }
  },
  methods: {
    removeTodo ( target ) {
      this.$store.commit('todos/remove', target);
    },
    addTodo ( e ) {
      this.$store.commit('todos/add', e.target.value)
      e.target.value = '' // add後、inputのテキストを削除する
    },
    ...mapMutations({
      toggle: 'todos/toggle'
    })
  }
}
</script>

<style>
.removeButton {
  padding: 5px 10px;
  border: solid 1px #000;
}
.todoInput {
  width: 300px;
  margin: 60px auto;
  border: solid 1px #ddd;
}
.done {
  text-decoration: line-through;
}
</style>
