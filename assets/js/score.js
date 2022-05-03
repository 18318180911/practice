window.onload = function () {
    const tbody = document.querySelector('tbody');
    // 发送请求，获取数据，实现页面渲染
    getScoreList();
    function getScoreList() {
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
                <th class="score">${value.score[0]}</th>
                <th class="score">${value.score[1]}</th>
                <th class="score">${value.score[2]}</th>
                <th class="score">${value.score[3]}</th>
                <th class="score">${value.score[4]}</th>
                </tr>
                `;
            }
            tbody.innerHTML = html;
        });
    }
};