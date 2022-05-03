const common = {
    // 加载
    load: {
        show() {
            const div = document.createElement('div');
            div.className = 'vir-wrap';
            div.innerHTML = `
                <div id="loadding" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `;
            const bodyFirst = document.body.children[0];
            document.body.insertBefore(div, bodyFirst);
        },
        // 隐藏加载中
        hide() {
            document.querySelector('.vir-wrap').remove();
        },
    },
};