window.onload = function () {
  // 获取一级菜单的a标签
  const topAList = document.querySelectorAll('.nav>li>a');
  topAList.forEach((aDom) =>
    aDom.addEventListener('click', function () {
      // 根据被点击的a标签的获取到下一个ul标签
      // 下一个兄弟元素dom.nextElementSibling
      // this.nexrElementSibling获取到了ul
      // 只能获取到dom元素的行内样式，无法直接获取到dom元素通过class设置的样式
      // console.log(this.nexrElementSibling.style.display);
      this.nextElementSibling.classList.toggle('show');
    })
  );
  // 获取二级菜单的a标签
  const subAList = document.querySelectorAll('.nav ul a');
  subAList.forEach((aDom) =>
    aDom.addEventListener('click', function () {
  //     // 获取到 身上有active类的a标签 -> 移除它 这个 类
      document.querySelector('.nav ul a.active').classList.remove('active');
  //     // 再给自己添加 这个 active
      this.classList.add('active');
    })
  );
  //#region  控制左侧菜单切换显示
  const menu = document.querySelector('.menu');
  menu.addEventListener('click', function () {
    document.querySelector('.leftside').classList.toggle('w0');
  });
  // 初始化数据
  const initBtn = document.querySelector('.init');
  initBtn.addEventListener('click', function () {
    console.log('初始化');
    axios.get('./init/data', {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    })
    .then((result) => {
      console.log(result)
    })
  });
  //#region 退出功能
  const logout = document.querySelector('.logout');
  logout.addEventListener('click', function () {
    // 弹出一个确认框 （确认框也应该要找一些好看的确认）
    if (confirm('您确定退出吗😶')) {
      // console.log('退出');
      localStorage.removeItem('token');
      location.href = './login.html';
    }
  });
  //#endregion

  //#region 页面打开的时候 开始发送请求 加载数据
  getInitData();
  function getInitData() {
    axios
      .get('/student/list', {
        // 在请求头中 来携带token
        headers: {
          authorization: localStorage.getItem('token'),
        },
      })
      .then((result) => {
        console.log(result);
      });
  }
  //#endregion
};

