<template>
  <section class="contents">
    <h1 class="topLogo">
      <Logo />
    </h1>
    <div class="c-postList">
      <div v-for="post in posts" class='c-postList_node'>
        <nuxt-link :key="`${post.id}`" :to="`/post/${post.id}`">
          <img :src="post['_embedded']['wp:featuredmedia'][0]['source_url']" :alt="post.title.rendered">
          <p>{{ post.title.rendered }}</p>
        </nuxt-link>
      </div>
    </div>
    <nuxt-link to="/post/" class="c-button topButton">一覧ページ</nuxt-link>
    <nuxt-link to="/login/" class="c-button topButton">ログインページ</nuxt-link>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import axios from 'axios'

export default {
  // REST APIバージョン
  async asyncData() {
      let result = await axios.get('https://www.e-begin.jp/wp-json/wp/v2/feature?_embed')
      return {posts: result.data}
  },

  // jsonバージョン
  // computed: {
  //   posts() {
  //     return this.$store.getters['post/getPosts']
  //   }
  // },
  components: {
    Logo
  }
}
</script>

<style lang="scss">
.topButton {
  margin-top: 60px;
}

.topLogo {
  margin-bottom: 20px;
}

.c-postList {
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
  margin: 0 auto;
}
.c-postList_node {
  width: calc(25% - 20px);
  margin: 10px;
  img {
    width: 100%;
  }
  p {
    margin-top: 10px;
  }
}
</style>
