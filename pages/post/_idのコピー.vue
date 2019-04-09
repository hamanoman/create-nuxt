<template>
  <div class="contents">
    <postdetail
      :data="post"
    />

    <NuxtLink v-if="page > 1" :to="'?page=' + (page - 1)">
      &lt; Prev
    </NuxtLink>

    <NuxtLink v-if="page < totalPages" :to="'?page=' + (page + 1)">
      Next &gt;
    </NuxtLink>

    <nuxt-link to="/" class="c-button">トップページへ戻る</nuxt-link>
  </div>
</template>

<script>
import PostDetail from '~/components/PostDetail'
export default {
  components: {
    'postdetail': PostDetail
  },
  computed: {
    post() {
      const post = this.$store.getters['post/getPosts'].filter(item => {
        return (item.id == this.$route.params.id);
      })
      return post[0]
    }
  }
}
</script>
