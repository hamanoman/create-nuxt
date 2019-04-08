import pkg from './package'

import jsonData from './assets/json/data.json'

export default {
  mode: 'universal',

  generate: {
    routes() {
      return jsonData.map(item => {
        return `post/${item.id}`
      })
    }
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    { src: '~/src/scss/common.scss', lang: 'scss' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],

  manifest: {
    name: 'nuxt-start',
    lang: 'ja',
    short_name: 'nuxt',
    title: 'nuxt-startです',
    'og:title': 'nuxt-startです',
    description: 'nuxt-startです',
    'og:description': 'nuxt-startです',
    theme_color: '#ffffff',
    background_color: '#ffffff'
  },

  workbox: {
    dev: true, //開発環境でもPWA
  },

  axios: {

  },

  api: {
    baseURL: ''
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
