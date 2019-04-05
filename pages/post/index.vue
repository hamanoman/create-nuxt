<template>
  <section class="contents">
    <div>
      <h1 class="archiveTitle">
        投稿一覧ページ
      </h1>
      <div class="c-postList">
        <div v-for="post in posts" class='c-postList_node'>
          <nuxt-link :key="`${post.id}`" :to="`/post/${post.id}`">
            <img :src="post['_embedded']['wp:featuredmedia'][0]['source_url']" :alt="post.title.rendered">
            <p>{{ post.title.rendered }}</p>
          </nuxt-link>
        </div>
      </div>
      <nuxt-link to="/" class="c-button newsButton">トップページ</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'post',
  computed: {
    posts() {
      return this.$store.getters['post/getPosts']
    }
  }
}
</script>

<style lang="scss">
.archiveTitle {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 60px;
}
.newsButton {
  margin-top: 60px;
}
</style>
