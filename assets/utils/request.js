// 设置基地地址
axios.defaults.baseURL = 'http://www.itcbc.com:8000';
// 添加拦截器
axios.interceptors.request.use(function (config) {
    // document.querySelector('.vir-wrap').style.display = 'flex';
    common.load.show();
    if (localStorage.getItem('token')) {
        config.headers.authorization = localStorage.getItem('token');
      }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    console.log("http状态码 正常 业务码可能正确-错误");
    // document.querySelector('.vir-wrap').style.display = 'none';
    common.load.hide();
    if (response.data.code !== undefined && response.data.code !== 0) {
        // 不正常业务码
        toastr.error(response.data.message);
        return Promise.reject(response); 
    }
    // return 返回登录成功后的数据（简化数据返回结果）
    return response.data;
}, function (error) {
    // 对响应错误做点什么  http不正确的时候 就会触发 
    console.log('http状态码不正确');
    if (error.response.status === 401) {
        // token失效没有携带登录过
        // location.href = './login.html';
        // window.top获取到最外层的window，对象
        window.top.location.href = './login.html';
    }
    // message 后端返回的错误信息
    toastr.error(error.response.data.message);
    // 关闭加载中
    // document.querySelector('.vir-wrap').style.display = 'none';
    common.load.hide();
    return Promise.reject(error);
});