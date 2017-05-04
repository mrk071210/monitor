<template>
  <div class="suggest">
    <h2>你的计算机得分:<span class="score" :class="color">{{score}}</span>分,{{suggest}}</h2>
    <h2>{{disksuggest}}</h2>
  </div>
</template>

<script>
  export default {
    name: 'suggest',

    data () {
      return {
        score:0,
        color:"",
        suggest:"",
        disksuggest:""
      }
    },
    methods:{
      getSuggest(){
          let that = this;

          $.ajax({
            url:"/api/suggest",
            type:'post',
            data:{time:moment().subtract(2, "seconds").format("YYYY-MM-DD HH:mm:ss").toLocaleString()},
            dataType:'json',
            success:function (res) {
              if(res.code==200){
                let result=(res.data[0][0].usedmem/res.data[0][0].totalmem).toFixed(2);
                console.log(result);
                 if (result<0.5){
                     that.score=90;

                     that.suggest="计算机状态优秀，继续保持！";
                 }
                 else if(0.5<=result&&result<0.8){
                     that.score=80;
                   that.color="green";
                     that.suggest="计算机状态良好！";
                 }
                 else if(0.8<=result&&result<0.9){
                     that.score=70;
                   that.color="yellow";
                     that.suggest="内存负担较大，请注意";
                 }
                 else{
                     that.score=60;
                   that.color="red";
                     that.suggest="计算机内存已经快要占满啦！关闭一些不必要的程序吧！";
                 }
                if(res.data[1][0].diskInfo[0][1]/res.data[1][0].diskInfo[0][2]>0.85){
                    that.disksuggest="系统盘快要满了，会拖慢系统运行速度，可以清理掉里面一些不必要的文件。"
                }

              }
            }
          })
      }
    },
    mounted:function () {
        this.getSuggest();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.suggest{
  width: 80%;
  min-width: 600px;
  margin:0 auto;
}
 .score{
  font-size: 60px;
}
  .green{
    color: lawngreen;
  }
  .yellow{
    color:yellow;
  }
  .red{
    color:red;
  }
</style>
