<template>
  <section class="news">
      {{$route.params.id}}
      <nuxt-link to="/">トップページへ戻る</nuxt-link>
  </section>
</template>

<script>
  export default {
    validate (routeData) {
      return routeData.params.id.match(/^\d+$/);
    }
  }
</script>
