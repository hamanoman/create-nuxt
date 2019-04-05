<template>
  <div>
    <Header/>
    <nuxt />
    <Footer/>
  </div>
</template>

<script type="text/javascript">
  import Header from '~/components/Header-post.vue'
  import Footer from '~/components/Footer-post.vue'
  export default {
    components: {
      Header,
      Footer
    }
  }
</script>
