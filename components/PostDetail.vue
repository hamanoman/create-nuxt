<template>
  <div class="singleContents">
    <h1 class="singleTitle">
      {{ data.title.rendered }}
    </h1>
    <template v-if="data['_embedded']['wp:featuredmedia']">
      <figure class="singleVisual">
        <img :src="data['_embedded']['wp:featuredmedia'][0]['source_url']" :alt="data.title.rendered">
      </figure>
    </template>

    <div v-html="data.content.rendered" class="singlePostContents"></div>

    <p>{{ count }}</p>
    <p>{{ oddOrEven }}</p>
    <button @click="handleClick">Click!</button>
  </div>
</template>


<script>
export default {
  // 親から受け取る状態
  props: {
    data: {
      type: Object
    }
  },

  // コンポーネント内の状態
  data() {
    return {
      count: 0
    }
  },

  // 算出プロパティ
  computed: {
    oddOrEven() {
      return this.count % 2 === 0 ? '偶数' : '奇数'
    }
  },

  // プロパティの監視
  watch: {
    count(newCount, oldCount) {
      console.log(`countが${oldCount}から${newCount}になりました。`)
    }
  },

  // コンポーネント内のメソッド
  methods: {
    handleClick() {
      this.count++
    }
  },

  // ライフサイクル
  mounted() {
    console.log('mounted!!')
  }
}
</script>

<style lang="scss">
.singleContents {
  max-width: 600px;
  margin: 0 auto;
}
.singleVisual {
  text-align: center;
  img {
    width: 100%;
  }
}
.singleTitle {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 60px;
}
.singlePostContents {
  line-height: 1.6;
  margin-top: 60px;
}
</style>
