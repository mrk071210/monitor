<template>
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
      <div role="tabpanel" class="tab-pane active" id="memory"><div class="memm"></div></div>
      <div role="tabpanel" class="tab-pane" id="cpu"><span v-for="(item,index) in cpuarr" class="cpu"></span></div>
      <div role="tabpanel" class="tab-pane" id="disk"><span v-for="(item,index) in diskarr" class="disk"></span></div>
      <div role="tabpanel" class="tab-pane" id="process">
        <process></process>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import echarts from 'echarts';
  import process from '@/components/process'

  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
  });
  $(function () {
        var socket = io.connect('http://localhost:8082');
        var freeMem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          totalMem;
        var memChart = echarts.init(document.getElementsByClassName('memm')[0]);
        var memoption = {
          title: {
            text: '可用内存/GB'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 32
          },
          series: {
            name: '当前可用内存/GB',
            type: 'line',
            data: freeMem,
            smooth: true,
            symbol: 'none',
            stack: 'a',
            areaStyle: {
              normal: {}
            }
          }

        };
        socket.on('memData', function (updata) {
          totalMem = updata.totalMem;
          freeMem.shift();
          freeMem.push(updata.freeMem);
          //内存
          var axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');
          memoption.series.data = freeMem;
          memoption.xAxis.data.shift();
          memoption.yAxis.max = totalMem;
          memoption.xAxis.data.push(axisData);
          memChart.setOption(memoption);
        });
  });



  export default{

    data:()=>({
      author:"mrk",
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
      flag:true
    }),
    components:{process},
    updated:function(){
      let that=this;

      for (let i = 0; i < that.cpuarr; i++) {
        that.cpuCharts[i] = echarts.init(document.getElementsByClassName("cpu")[i]);
      }
      for (let i = 0; i < that.diskarr; i++) {
        that.diskCharts[i] = echarts.init(document.getElementsByClassName("disk")[i]);
      }
    },
    methods: {
      connect(){
        let that = this;
        this.socket = io.connect('http://localhost:8082');
        this.socket.emit('ensure', 1);
        this.socket.on('constData', function (data) {
          that.cpuarr = data.cpuarr;
        });
        this.socket.on('diskData',function (data) {
            if(data.length>0) {
              that.diskarr = data.length;
            }
        });
      },
      //接收CPU信息
      getCpu(){
        let that = this;
        this.socket.on('cpuUpdata', function (data) {
          that.cpuData=data;
        });
      },
      showCpu(){
        let that = this;
        if (that.cpuCharts.length > 0) {
          for (let i = 0; i < this.cpuData.length; i++) {
            that.cpuoption.series.data[0].value = that.cpuData[i].times.user;
            that.cpuoption.series.data[1].value = that.cpuData[i].times.nice;
            that.cpuoption.series.data[2].value = that.cpuData[i].times.sys;
            that.cpuoption.series.data[3].value = that.cpuData[i].times.idle;
            that.cpuoption.series.data[4].value = that.cpuData[i].times.irq;
            that.cpuCharts[i].setOption(that.cpuoption);
          }
        }
      },
      //接收磁盘信息
      getDisk(){
        let that= this;
        this.socket.on('diskData',function (data) {
            if(data.length>0) {
              that.diskData = data;
            }
        });
      },
      showDisk(){
        let that= this;
        if(that.diskData.length>0){
          for (let i = 0; i < that.diskData.length; i++) {
            that.diskoption.title.text = that.diskData[i][0];
            that.diskoption.series.data[0].value = that.diskData[i][1] - that.diskData[i][2];
            that.diskoption.series.data[1].value = that.diskData[i][2];
            if(that.diskCharts.length>0) {
              that.diskCharts[i].setOption(that.diskoption);
            }
          }
        }
      }
    },
    mounted:function () {
      this.connect();
      this.getCpu();
      this.showCpu();
      this.getDisk();
      this.showDisk();
    },
    watch:{
      cpuData:{
        handler:function (nowVal,oldVal) {
          this.getCpu();
          this.showCpu();
        },
        deep:true
      },
      diskData:{
        handler:function (nowVal,oldVal) {
          this.getDisk();
          this.showDisk();
        },
        deep:true
      }
    }
  }
</script>

<style>
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
  .memm{
    width: 800px;
    height:500px;
  }
  .disk{
    width: 300px;
    height:300px;
  }
  ul li>a:hover{
    color: #337ab7 !important;
  }
  ul li>a:focus{
    color: #555 !important;;
  }
</style>
