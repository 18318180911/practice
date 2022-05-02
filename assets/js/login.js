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
        login.style.display = 'none';
        register.style.display = 'block';
    });
    registerA.addEventListener('click', function () {
        console.log('登录');
        register.style.display = 'none';
        login.style.display = 'block';
    })
    //#endregion
    //#region 登录功能
    const loginForm = document.querySelector('.login form');
     // 给登录表单 绑定 提交事件 submit 
    loginForm.addEventListener('submit', function(event) {
        // 阻止默认行为
        event.preventDefault();
        // 获取登录表单中用户名和密码
        const username = loginForm.querySelector('input[name=username]').value.trim();
        const password = loginForm.querySelector('input[name=password]').value.trim();
        // 根据接口的要求 发送网络请求 完成登录
        axios.post('/api/login', { username, password }).then(result => {
            console.log(result);
            // console.log('登录成功')
        })
    })
    //#endregion
}
