<template>
  <div id="app">
    <header>
      <ul class="navbar">
        <li @click="reflash"><router-link to="monitor">monitor</router-link></li>
        <li ><router-link to="suggest">suggest</router-link></li>
        <li ><router-link to="history">history</router-link></li>
        </ul>
    </header>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app',
  methods:{
      reflash(){
        window.location.reload()
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
  .navbar{
    height:50px;
    width: 100%;
    background-color: #2aabd2;
    text-align: left;
    border-radius:0px!important;
  }
.navbar li{
  display: inline-block;
  width: 200px;
}
.navbar li:hover{
  background-color: #1b6d85;
}
.navbar a{
  text-align: center;
  color: #fff;
  display: inline-block;
  width: 200px;
  line-height: 49px;
  height:49px;
}
a:focus,a:hover{
  color: #fff!important;
  text-decoration: none!important;
}
</style>
