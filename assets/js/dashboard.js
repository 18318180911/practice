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
              chinaDatas.push([{name: item.county, value: 0}]);
              let i;
              if ((i = pieData.findIndex(v => v.name === item.province)) >= 0) {
                pieData[i].value++;
              }
              else {
                pieData.push({ value: 1, name: item.province });
              }
            });
            // console.log(pieData)
            renderLine(arr);
            pieChart(pieData);
            mapChart(chinaGeoCoordMap, chinaDatas);
            // barChart(arr);
        });
    }
    // 柱状图
    getStudentScore();
    function getStudentScore() {
      // const btn = document.querySelector('.btn');
      // const batch = document.querySelector('#batch');
      // btn.addEventListener('click', function () {
      //   batch.toggle();
      // })
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
      var planePath =
        "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
      //航线的颜色
      var color = ["#a6c84c", "#ffa022", "#46bee9"];
      var series = [];
      [['北京市', chinaDatas]]
      .forEach(function(item, i)
      {
        series.push(
          {
            name: item[0],
            type: "lines",
            zlevel: 1,
            effect: {
              period: 6,
              trailLength: 0.7,
              symbolSize: 3
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0],
            type: "lines",
            zlevel: 2,
            symbol: ["none", "arrow"],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: 15
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item[1])
          },
          {
            name: item[0],
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbolSize: function(val) {
              return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: color[i]
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
          }
        );
      });
      var option = {
        tooltip: {
          // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
          trigger: "item",
        },
        legend: {
          // 图例列表布局朝向垂直
          orient: "vertical",
          top: "bottom",
          left: "right",
          data: ["北京 Top3", "上海 Top3", "广州 Top3"],
          textStyle: {
            color: "#fff"
          }
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              // 是否显示省区的名字
              show: true,
              color: "#fff"
            }
          },
          // 把中国地图放大了1.2倍
          zoom: 1.2,
          roam: true,
          itemStyle: {
            normal: {
              // 地图省份的背景颜色
              areaColor: "#92959e",
              borderColor: "#eeeeee",
              borderWidth: 1
            },
            emphasis: {
              areaColor: "#2B91B7"
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