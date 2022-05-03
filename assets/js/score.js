window.onload = function () {
    const tbody = document.querySelector('tbody');
    // 发送请求，获取数据，实现页面渲染
    getScoreList();
    function getScoreList(calback) {
        axios.get('./score/list').then((result) => {
            const obj = result.data;
            // 对obj遍历
            let html = ``;
            for (const key in obj) {
                const value = obj[key];
                console.log(value);
                html +=`
                <tr>
                <th scope="row">${key}</th>
                <td>${value.name}</td>
                <td class="score">${value.score[0]}<input type="text" /></td>
                <td class="score">${value.score[1]}<input type="text" /></td>
                <td class="score">${value.score[2]}<input type="text" /></td>
                <td class="score">${value.score[3]}<input type="text" /></td>
                <td class="score">${value.score[4]}<input type="text" /></td>
                </tr>
                `;
            }
            tbody.innerHTML = html;
            // 给input绑定失去焦点事件
            inputEvents();
        });
    }
    // 双击
    tbody.addEventListener('dblclick', function (event) {
        // 判断当前点击的是不是想要的td
        if (event.target.nodeName === 'TD' && event.target.className === 'score') {
             console.log('业务'); //让td 里面的input标签 显示出来
            const td = event.target;
            const input = td.querySelector('input');
            input.style.dislay = 'block';
            // 让input标签显示td内容
            input.value = td.innerText;
            // 设置输入框自动获得光标的方法
            input.focus();
        }
    });
    // 获取input标签数组, 遍历来绑定失去焦点事件
    function inputEvents() {
        const inputList = document.querySelectorAll('input');
        inputList.forEach((input) => 
        input.addEventListener('blur', function () {
            console.log('input失去焦点了');
            this.style.display = 'none';
        }));
    }
};