<template>
  <section class="contents">
    <div>
      <h1 class="title">
        NEWS一覧ページ
      </h1>
      <nuxt-link to="/" class="c-button newsButton">トップページ</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'post'
}
</script>

<style lang="scss">
.newsButton {
  margin-top: 60px;
}
</style>
