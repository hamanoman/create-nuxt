<template>
  <div class="contents">
    <postdetail
      :data="data"
    />

    <NuxtLink v-if="prevPage" :to="`/post/${prevPage.id}`">
      &lt; Prev
    </NuxtLink>

    <NuxtLink v-if="nextPage" :to="`/post/${nextPage.id}`">
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
  async asyncData({ store, params }) {
    const jsonData = store.getters['post/getPosts'];
    let prevPage, nextPage;

    const data = jsonData.filter(function(item) {
      return (item.id == params.id);
    })
    for ( let i = 0; i < jsonData.length; i++ ) {
      if ( jsonData[i].id == params.id ) {
        prevPage = jsonData[i - 1];
        nextPage = jsonData[i + 1];
      }
    }

    return {
      prevPage: prevPage,
      nextPage: nextPage,
      data: data[0]
    }
  }
}
</script>
