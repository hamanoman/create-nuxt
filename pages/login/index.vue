<template>
  <section class="contents">
    <div>
      <h1 class="archiveTitle">
        ログイン
      </h1>
      <nuxt-link to="/" class="c-button loginButton">トップページ</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'post'
}
</script>

<style lang="scss">
.archiveTitle {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 60px;
}
.loginButton {
  margin-top: 60px;
}
</style>
