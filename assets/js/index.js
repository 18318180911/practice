window.onload = function () {
  // 获取一级菜单的a标签
  const topAList = document.querySelectorAll('.nav>li>a');
  topAList.forEach((aDom) =>
    aDom.addEventListener('click', function () {
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
};

