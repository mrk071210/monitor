<template>
  <div>
  <div class="history-search">
    <div class='col-sm-6 input-group'>
      <input type='text' class="form-control" id='datetimepicker4' />
      <span class="input-group-addon btn" id="basic-addon2" @click="searchHistory(now)">查询</span>
    </div>
    <button class="btn" @clicl="searchHistory(before)">前一秒</button>
    <button class="btn" @clicl="searchHistory(after)" disabled="flag">后一秒</button>
  </div>
  <div class="sourceArea">
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#memory" aria-controls="memory" role="tab" data-toggle="tab">memory</a></li>
    <li role="presentation"><a href="#cpu" aria-controls="cpu" role="tab" data-toggle="tab">cpu</a></li>
    <li role="presentation"><a href="#disk" aria-controls="disk" role="tab" data-toggle="tab">disk</a></li>
    <li role="presentation"><a href="#process" aria-controls="process" role="tab" data-toggle="tab">process</a></li>
  </ul>
  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="memory"><div class="mem"></div></div>
    <div role="tabpanel" class="tab-pane" id="cpu"><span v-for="(item,index) in cpuarr" class="cpu"></span></div>
    <div role="tabpanel" class="tab-pane" id="disk"><span v-for="(item,index) in diskarr" class="disk"></span></div>
    <div role="tabpanel" class="tab-pane" id="process">
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
    </div>
  </div>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import '../assets/js/bootstrap-datetimepicker.min'
  import '../assets/css/bootstrap-datetimepicker.min.css'

  export default {
    name: 'history',
    data () {
      return {
        data:[],
        cpuarr:0,
        cpuData:[],
        cpuCharts:[],
        cpuoption : {
          title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },

          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series :
            {
              name:'访问来源',
              type:'pie',
              radius : '55%',
              center: ['50%', '50%'],
              startAngle:180,
              data:[
                {value:0, name:'用户态时间',
                  itemStyle: {
                    normal: {
                      color: '#c23531'
                    }
                  }},
                {value:0, name:'nice加权时间',
                  itemStyle: {
                    normal: {
                      color: '#ccc'
                    }
                  }},
                {value:0, name:'系统态时间',
                  itemStyle: {
                    normal: {
                      color: '#2f4554'
                    }
                  }},
                {value:0, name:'空闲时间',
                  itemStyle: {
                    normal: {
                      color: '666666'
                    }
                  }},
                {value:0, name:'软中断消耗时间',
                  itemStyle: {
                    normal: {
                      color: '#797979'
                    }
                  }}
              ].sort(function (a, b) { return a.value - b.value}),
              roseType: 'angle',
              label: {
                normal: {
                  textStyle: {
                    color: '#797979'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: '#797979'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              selectedMode:50,
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return 200;
              }
            }
        },
        memData:{},
        memChart:[],
        memoption : {
          title: {
            text: '内存数据'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },

          xAxis:
            {
              type: 'category',
              boundaryGap: false,
              data: [0,0,0,0,0,0,0,0,0,0]
            },
          yAxis:
            {
              type: 'value',
              min:0,
              max:32
            },
          series:
            {
              name:'当前可用内存/GB',
              type:'line',
              data:0,
              smooth:true,
              symbol: 'none',
              stack: 'a',
              areaStyle: {
                normal: {}
              }
            }
        },
        diskarr:0,
        diskData:[],
        diskCharts:[],
        diskoption: {
          title:{
            text:"",
            x:'center',
            y:'bottom'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['已用空间', '可用空间'],
            selectedMode:false
          },
          series:
            {
              name: '本机磁盘',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show:false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: 0, name: '已用空间'},
                {value: 0, name: '可用空间'}
              ]
            }

        },
        proData:[],
        flag:true
      }
    },
    updated:function () {
      let that=this;
      for (let i = 0; i < that.cpuarr; i++) {
        that.cpuCharts[i] = echarts.init(document.getElementsByClassName("cpu")[i]);
      }
      that.memChart[0]=echarts.init(document.getElementsByClassName("mem")[0]);
      for (let i = 0; i < that.diskarr; i++) {
        that.diskCharts[i] = echarts.init(document.getElementsByClassName("disk")[i]);
      }
      //内存

      //cpu
      for(let i=0;i<that.data[1][0].cpuInfo.length;i++) {
        that.cpuoption.series.data[i].value = that.data[1][0].cpuInfo[i].times.user;
        that.cpuoption.series.data[i].value = that.data[1][0].cpuInfo[i].times.nice;
        that.cpuoption.series.data[i].value = that.data[1][0].cpuInfo[i].times.sys;
        that.cpuoption.series.data[i].value = that.data[1][0].cpuInfo[i].times.idle;
        that.cpuoption.series.data[i].value = that.data[1][0].cpuInfo[i].times.irq;
        that.cpuCharts[i].setOption(that.cpuoption);
      }
      //磁盘
      for (let i = 0; i < that.data[2][0].diskInfo.length; i++) {
        that.diskoption.title.text = that.data[2][0].diskInfo[i][0];
        that.diskoption.series.data[0].value = that.data[2][0].diskInfo[i][1] - that.data[2][0].diskInfo[i][2];
        that.diskoption.series.data[1].value = that.data[2][0].diskInfo[i][2];
        if(that.diskCharts.length>0) {
          that.diskCharts[i].setOption(that.diskoption);
        }
      }
      //进程
      that.proData=that.data[3][0].proInfo;
    },
    methods:{
      searchHistory(time){
          let that=this;
        $.ajax({
          url:"api/searchHistory",
          type:"post",
          dataType:'json',
          data:{time:$("#datetimepicker4").val()},
          success:function (data) {
              if(data.code==200)
              that.data=data.data;
              that.cpuarr=data.data[1][0].cpuInfo.length;
              that.diskarr=data.data[2][0].diskInfo.length;
              if($("#datetimepicker4").val()==moment().format("YYYY-MM-DD HH:mm:ss").toLocaleString()){
                  that.flag=true
              }
              else{
                  that.flag==false
              }
          }
        })
      },
      datetimepicker(){
        $('#datetimepicker4').datetimepicker({
          format:"YYYY-MM-DD HH:mm:ss",
          maxDate:new Date(),
          sideBySide:true
        });
      }
    },
    mounted:function () {
      this.datetimepicker()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.history-search .input-group{
  margin-left: 50px;
  margin-bottom: 30px;
}
.sourceArea{
  width: 70%;
  margin: auto;
}
.tab-content>.active{
  display: -webkit-flex!important;
  -webkit-justify-content: space-around;
  display: flex!important;
  justify-content:space-around;
  flex-wrap:wrap;
}
.cpu{
  display: inline-block;
  width:	400px;
  height: 300px;
}
.mem{
  width: 400px;
  height:300px;
}
.disk{
  width: 300px;
  height:300px;
}
</style>
