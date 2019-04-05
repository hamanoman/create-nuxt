<template>
  <div>
    <ul>
      <li v-for="ccc in bbb">
        <input type="checkbox" :checked="ccc.done" @change="toggle(ccc)">
        <span :class="{ done: ccc.done }">{{ ccc.text }}</span>
      </li>
      <li><input placeholder="What needs to be done?" @keyup.enter="addTodo"></li>
    </ul>
    <nuxt-link to="/">トップページ</nuxt-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    bbb () { return this.$store.state.todos.list }
  },
  methods: {
    addTodo (e) {
      this.$store.commit('todos/add', e.target.value)
      e.target.value = ''
    },
    ...mapMutations({
      toggle: 'todos/toggle'
    })
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
</style>
