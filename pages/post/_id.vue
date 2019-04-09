<template>
  <div class="contents">
    <postdetail
      :data="data"
    />

    <div class="singlePager">
      <NuxtLink v-if="prevPage" :to="`/post/${prevPage.id}`" class="singlePager_node">
        &lt; Prev
      </NuxtLink>
      <div v-else class="singlePager_node"></div>
      <NuxtLink v-if="nextPage" :to="`/post/${nextPage.id}`" class="singlePager_node">
        Next &gt;
      </NuxtLink>
      <div v-else class="singlePager_node"></div>
    </div>


    <nuxt-link to="/" class="c-button">トップページへ戻る</nuxt-link>
  </div>
</template>

<script>
import PostDetail from '~/components/PostDetail'
export default {
  layout: 'post',
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

<style lang="scss">
.singlePager {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 60px auto;
}
</style>
