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
            renderLine(arr);
        });
    }
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
    }
}