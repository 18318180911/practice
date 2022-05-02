// 等待页面资源全部加载完毕，就触发
window.onload = function () {
    //#region 登录注册表单点击切换
    const loginA = document.querySelector('.login a');
    const registerA = document.querySelector('.register a');
    const login = document.querySelector('.login');
    const register = document.querySelector('.register');
    loginA.addEventListener('click', function () {
        console.log('登录');
        // 事件触发， 控制一个表单显示 另外一个表单隐藏 
        // 隐藏登录 显示注册
        login.style.display = 'none';
        register.style.display = 'block';
    });
     // 注册表单中的a 点击
    registerA.addEventListener('click', function () {
        console.log('登录');
         // 隐藏注册 显示登录
        register.style.display = 'none';
        login.style.display = 'block';
    })
    //#endregion

      //#region 登录表单的验证规则

  // 比如，验证一个用户名和密码
  function test() {
    return {
      fields: {
        // 我们的登录表单的 input 标签的name = username
        username: {
          // 这里username是 input 的name属性值，表示对这个输入框进行验证
          validators: {
            notEmpty: {
              //不能为空
              message: '用户名不能为空.',
            },
            stringLength: {
              //检测长度
              min: 2,
              max: 15,
              message: '用户名需要2~15个字符',
            },
            // regexp: {
            //   regexp: /^\d{2,15}$/,
            //   message: '格式不符合要求，2-15个数字',
            // },
          },
        },
        password: {
          validators: {
            notEmpty: {
              message: '密码不能为空',
            },
            stringLength: {
              //检测长度
              min: 6,
              max: 15,
              message: '密码需要6~15个字符',
            },
          },
        },
      },
    };
  }

  //#endregion

    //#region 登录功能
    const loginForm = document.querySelector('.login form');
     // 给登录表单 绑定 提交事件 submit 
    // loginForm.addEventListener('submit', function(event) {
    //     // 阻止默认行为
    //     event.preventDefault();
    //     // 获取登录表单中用户名和密码
    //     const username = loginForm.querySelector('input[name=username]').value.trim();
    //     const password = loginForm.querySelector('input[name=password]').value.trim();
    //     // 根据接口的要求 发送网络请求 完成登录
    //     axios.post('/api/login', { username, password }).then(result => {
    //         console.log(result);
    //         // console.log('登录成功')
    //     })
    // })
    //#endregion
    // 获取一下 表单元素
  // 调用 表单验证中 的一个方法 bootstrapValidator 接收一个 对象 - 表单验证 - test()
  // 以上的代码 已经开启了表单验证
  // on 绑定 一个事件 （不是我们学习的浏览器中自带事件）  表单通过验证 了 就会触发的事件
  $('.login form')
  .bootstrapValidator(test())
  .on('success.form.bv', function (e) {
    e.preventDefault();
    // 通过验证，这里的代码将会执行。我们将Ajax请求的代码放到这里即可
    // console.log('登录表单通过验证了， 可以发送请求 完成登录啦');
    // 获取登录表单中用户名
    const username = loginForm
      .querySelector('input[name=username]')
      .value.trim();
    const password = loginForm
      .querySelector('input[name=password]')
      .value.trim();

    // 根据接口的要求 发送网络请求 完成登录
    axios.post('/api/login', { username, password }).then((result) => {
      console.log(result);
      toastr.success(result.message);
      localStorage.setItem('token', result.token);
      setTimeout(() => {
          location.href = './index.html'
      }, 1500);
      // console.log("登录成功");
      //  调整到的在后台页面- 敏感数据
    });
//     axios.get('/student/list').then((resutl) => {
//         console.log(resutl);
//       });
  });
}
