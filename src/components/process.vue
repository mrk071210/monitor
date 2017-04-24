<template>
  <div id="proArea">
            <table class="table table-striped table-hover">
              <tr>
                <th>Name</th>
                <th>ProcessId</th>
                <th>ThreadCount</th>
                <th>WorkingSetSize</th>
              </tr>
              <tbody class="table table-striped processInfo">
                <tr v-for="item in proData">
                  <td v-for="item2 in item">{{item2}}</td>
                </tr>
              </tbody>
            </table>
          </div>
</template>

<script>
  export default {
    name: 'process',
    data () {
      return {
        proData:[]
      }
    },
    methods:{
      connect(){
        this.socket = io.connect('http://localhost:8082');
      },
      //接收磁盘信息
      getPro(){
        let that= this;
        this.socket.on('proData',function (data) {
          if(data.length>0) {
            that.proData = data;
          }
        });
      }
    },
    mounted:function () {
      this.connect();
      this.getPro();
    },
    watch:{
      proData:{
        handler:function (nowval,oldval) {
          this.getPro();
        },
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>
