<template>
  <div class="hello">
    <ul>
      <li ><router-link to="monitor">monitor</router-link></li>
      <li ><router-link to="suggest">suggest</router-link></li>
      <li ><router-link to="history">history</router-link></li>
    </ul>
    <button class="btn" @click="testPost">post</button>
    <button class="btn" @click="testGet">get</button>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods:{
      testPost(){
        let that=this;
        $.ajax({
          type:'post',
          url:'/api/post',
          success:(res)=>{
            console.log(res);
          }
        })
      },
      testGet(){
        let that=this;
        $.ajax({
          type:'get',
          url:'/api/get',
          success:(res)=>{
            console.log(res);
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
