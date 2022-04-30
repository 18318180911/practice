// 设置基地地址
axios.defaults.baseURL = 'http://www.itcbc.com:8000';
// 添加拦截器
axios.interceptors.request.use(function (config) {
    document.querySelector('.vir-wrap').style.display = 'flex';
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    document.querySelector('.vir-wrap').style.display = 'none';
    return response;
}, function (error) {
    return Promise.reject(error);
})