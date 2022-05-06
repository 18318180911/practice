window.onload = function () {
  getStudentOverview();
  function getStudentOverview() {
      axios.get('./student/overview').then((result) => {
          console.log(result);
          const { total, avgSalary, avgAge, proportion } = result.data;
          document.querySelector('.total').innerText = total;
          document.querySelector('.avgSalary').innerText = avgSalary;
          document.querySelector('.avgAge').innerText = avgAge;
          document.querySelector('.proportion').innerText = proportion;
      });
  }

  // 获取全部学员信息
  getStudentList();
  function getStudentList() {
      axios.get('/student/list').then((result) => {
          const arr = result.data;
          // 地图，第一组数据
          let chinaGeoCoordMap = { '北京市': [116.4551, 40.2539] };
          // 地图，第二组数据
          let chinaDatas = []
          const pieData = [];
          arr.forEach(item => {
            chinaGeoCoordMap[item.county] = [item.jing, item.wei];
            // 通过push把转换后的数据，添加到数组中
            chinaDatas.push([{name: item.county, value: 0}]);
            // 饼图
            let i;
            if ((i = pieData.findIndex(v => v.name === item.province)) >= 0) {
              pieData[i].value++;
            }
            else {
              pieData.push({ value: 1, name: item.province });
            }
          });
          console.log(chinaDatas)
          // console.log(pieData)
          renderLine(arr);
          pieChart(pieData);
          mapChart(chinaGeoCoordMap, chinaDatas);
          // barChart(arr);
      });
  };
  // 下拉菜单
// $('.bar .btn').on('click', function () {
//   $(this).next('ul').toggle();
// })
const btn = document.querySelector('.btn');
// const ul = document.querySelector('.btn ul')
//给那三个点加一个点击事件，点击后，让下一个兄弟元素ui切换状态（隐藏/显示）
btn.addEventListener('click', function() {
  let _ul = this.nextElementSibling;
  if(_ul.style.display == "none") {
    _ul.style.display = "block";
  }else {
    _ul.style.display = "none";
  }
  // $(this).next('ul').toggle(); 
});

// 点击 “第n次成绩” 按钮，获取该次考试成绩
$('#batch li').on('click', function () {
  // 取得当前li元素在兄弟间的位置，即索引，加1后，刚好当做考试次数
  let batch = $(this).index() + 1; 
  $(this).parent().hide(); // 让ul列表隐藏，这行也可以省略，即不隐藏
  axios.get('/score/batch', { params: { batch:2 } }).then(({ data: res }) => {
    let { data, code } = res;
    if (code === 0) {
      // console.log(data);
      barChart(data);
    }
  })
})

// 页面加载后，触发第一个li的单击事件
$('#batch li').eq(0).trigger('click');
  // 柱状图
  getStudentScore();
  function getStudentScore() {
    axios.get('score/batch', { params: {batch :2}}).then((result) => {
      console.log(result)
      if (result.code === 0) {
        barChart(result.data);
      }
    })
  };
  //地图

  //折线图
  function renderLine(arr) {
      const myChart = echarts.init(document.querySelector('.line'));
      const  salaryList = arr.map((value) => value.salary);
      const trueSalaryList = arr.map((value) => value.truesalary);
      const names = arr.map((value) => value.name);
      // 指定图标
      option = {
          title: {
            text: '薪资Salary'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {data: ['期望薪资', '实际薪资']},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
          },
           dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 20,
              xAxisIndex: [0, 1]
            }],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: names,
          },
          yAxis: {},
          series: [
            {
              name: '期望薪资',
              type: 'line',
              symbol: 'circle',
              smooth: true,
              data: salaryList,
              itemStyle : {
                color: '#ee6666',
              },
            },
            {
              name: '实际薪资',
              type: 'line',
              symbol: 'circle',
              smooth: true,
              data: trueSalaryList,
              itemStyle: {
                color: '#5470c6',
              }
            }
          ]
        };
        myChart.setOption(option);
  };
  // 柱状图
  function barChart({ avgScore, group, gt60, lt60, gt80 }) {
    const myChart = echarts.init(document.querySelector('.barChart'));
    let option = {
      // 网格（整个图表区域设置）
      grid: {
        top: 30,
        bottom: 30,
        left: '7%',
        right: '7%'
      },
      // 鼠标移入的提示
      tooltip: {
        trigger: 'axis', // 触发方式，axis表示轴触发，item表示每一项
        axisPointer: { // 坐标轴指示器配置项
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      legend: {},
      xAxis: [
        {
          type: 'category',
          data: group,
          // data: ['1组', '2组', '3组', '4组', '5组', '6组', '7组'],
          axisPointer: { // 坐标轴指示器为阴影，配合tooltip中的设置，组成十字准星
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value}分',
          }
        },
        {
          type: 'value',
          min: 0,
          max: 10,
          interval: 1,
          axisLabel: {
            formatter: '{value} 人',
          }
        }
      ],
      // 数据部分（4组数据）
      series: [
        {
          name: '平均分',
          type: 'bar',
          data: avgScore,
          // data: [83, 57, 90, 78, 66, 76, 77, 87, 69, 92, 88, 78],
          barWidth: '15',
        },
        {
          name: '低于60分人数',
          type: 'bar',
          data: lt60,
          // data: [2, 1, 3, 4, 2, 5, 2, 2, 4, 1, 6, 2],
          barWidth: '15',
          yAxisIndex: 1, // Y轴索引，1表示使用第2个Y轴
        },
        {
          name: '60到80分之间',
          type: 'bar',
          yAxisIndex: 1, // Y轴索引，1表示使用第2个Y轴
          barWidth: '15',
          // data: [1, 4, 2, 4, 5, 2, 1, 3, 3, 2, 2, 4]
          data: gt60
        }
        ,
        {
          name: '高于80分人数',
          type: 'bar',
          yAxisIndex: 1, // Y轴索引，1表示使用第2个Y轴
          barWidth: '15',
          // data: [3, 2, 1, 5, 1, 2, 3, 4, 5, 2, 2, 4]
          data: gt80
        }
      ]
    };
    myChart.setOption(option);
  };

  // 地图
  function mapChart(chinaGeoCoordMap, chinaDatas) {
    const myChart = echarts.init(document.querySelector('.map'));
    var convertData = function (data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = chinaGeoCoordMap[dataItem[0].name];
        var toCoord = [116.4551, 40.2539]; // 目标点 经纬度（北京市）
        if (fromCoord && toCoord) {
          res.push([{
            coord: fromCoord,
            value: dataItem[0].value
          }, {
            coord: toCoord,
          }]);
        }
      }
      return res;
    };
    var series = [];
	[['北京市', chinaDatas]].forEach(function(item, i) {
	    console.log(item)
      series.push({
          type: 'lines',
          zlevel: 2,
          effect: {
            show: true,
            period: 4, //箭头指向速度，值越小速度越快
            trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: 'arrow', //箭头图标
            symbolSize: 5, //图标大小
          },
          lineStyle: {
            normal: {
              width: 1, //尾迹线条宽度
              opacity: 1, //尾迹线条透明度
              curveness: .3 //尾迹线条曲直度
            }
          },
          data: convertData(item[1])
        }, {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: { //涟漪特效
            period: 4, //动画时间，值越小速度越快
            brushType: 'stroke', //波纹绘制方式 stroke, fill
            scale: 4 //波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: true,
              position: 'right', //显示位置
              offset: [5, 0], //偏移设置
              formatter: function(params){//圆环显示文字
                return params.data.name;
              },
              fontSize: 13
            },
            emphasis: {
              show: true
            }
          },
          symbol: 'circle',
          symbolSize: function(val) {
            return 5+ val[2] * 5; //圆环大小
          },
          itemStyle: {
            normal: {
              show: false,
              color: '#f00'
            }
          },
          data: item[1].map(function(dataItem) {
            return {
              name: dataItem[0].name,
              value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
            };
          }),
        },
        //被攻击点
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          rippleEffect: {
            period: 4,
            brushType: 'stroke',
            scale: 4
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              //offset:[5, 0],
              color: '#0f0',
              formatter: '{b}',
              textStyle: {
                color: "#0f0"
              }
            },
            emphasis: {
              show: true,
              color: "#f60"
            }
          },
          symbol: 'pin',
          symbolSize: 50,
          data: [{
            name: item[0],
            value: chinaGeoCoordMap[item[0]].concat([10]),
          }],
        }
      );
	});

	option = {
    title: {
      text: '来京路线 From',
      textStyle: {
        color: '#6d767e'
      }
    },
		tooltip: {
			trigger: 'item',
			backgroundColor: '#eeeeee',
			borderColor: '#eeeeee',
			showDelay: 0,
			hideDelay: 0,
			enterable: true,
			transitionDuration: 0,
			extraCssText: 'z-index:100',
			formatter: function(params, ticket, callback) {
				//根据业务自己拓展要显示的内容
				var res = "";
				var name = params.name;
				var value = params.value[params.seriesIndex + 1];
				res = "<span style='color:#fff;'>" + name + "</span><br/>数据：" + value;
				return res;
			}
		},
		geo: {
			map: 'china',
			zoom: 1.2,
			label: {
				emphasis: {
					show: false
				}
			},
			roam: true, //是否允许缩放
			itemStyle: {
				normal: {
					color: '#eeeeee', //地图背景色
					borderColor: '#516a89', //省市边界线00fcff 516a89
					borderWidth: 1
				},
				emphasis: {
					color: 'rgba(37, 43, 61, .5)' //悬浮背景
				}
			}
		},
		series: series
	};
    myChart.setOption(option)
  }

// 饼图
function pieChart(pieData) {
  const myChart = echarts.init(document.querySelector('.pie'));
  let option = {
    tooltip: {
      formatter: '{a} <br />{b} <strong>{c}</strong>人 占比{d}%'
    },
    title: {
      text: '籍贯 Hometown',
      textStyle: {
        color: '#6d767e'
      },
    },
    series: [
      {
        name: '各地人员分布',
        type: 'pie', // pie 表示饼图
        radius: ['10%', '65%'], // 内外圈的半径
        center: ['50%', '50%'], // 中心点
        roseType: 'area', // area表示面积模式，radius表示半径模式
        itemStyle: { // 每一项的设置
          borderRadius: 4, // 扇形边缘圆角设置
        },
        data: pieData
      }
    ]
  };
  myChart.setOption(option)
}
}