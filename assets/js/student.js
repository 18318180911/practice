window.onload = function () {
    const tbody = document.querySelector('tbody');
    getStudentList();
    function getStudentList() {
        // 根据接口要求
        axios.get('/student/list').then((result) => {
            const arr = result.data;
            const html = arr.map((value) => `
            <tr>
            <th scopr="row">${value.id}</th>
            <td>${value.name}</td>
            <td>${value.age}</td>
            <td>${value.sex}</td>
            <td>${value.group}</td>
            <td>${value.phone}</td>
            <td>${value.salary}</td>
            <td>${value.truesalary}</td>
            <td>${value.province + value.city + value.county}</td>
            <td>
                <button data-id=${value.id} type="button" class="btn btn-primary btn-sm update">修改</button>
                <button data-id="${value.id}" type="button" class="btn btn-danger btn-sm del">删除</button>
            </td>
            </tr>
            `)
                .join('');
            tbody.innerHTML = html;
        });
    }
    // 学生名字验证
    function test() {
        return {
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '学生姓名不能为空.',
                        },
                        stringLength: {
                            min: 2,
                            max: 10,
                            message: '姓名长度2-10位',
                        },
                    },
                },
                age: {
                    validators: {
                        notEmpty: {
                            message: '年龄不能为空',
                        },
                        greaterThan: {
                            value: 18,
                            message: '年龄不能小于18岁',
                        },
                        lessThan: {
                            value: 100,
                            message: '年龄不能大于100岁',
                        },
                    },
                },
                //组号
                group: {
                    validators: {
                        notEmpty: {
                            message: '组号不能为空',
                        },
                    },
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: '手机号不能为空'
                        },
                        regexp: {
                            regexp: /^1[3|4|5|7|8][0-9]{9}$/,
                            message: '手机号码格式不对',
                        },
                    },
                },
                // 期望薪资
                salary: {
                    validators: {
                        notEmpty: {
                            message: '期望薪资不能为空',
                        },
                        greaterThan: {
                            value: 800,
                            message: '期望薪资不能低于800',
                        },
                        lessThan: {
                            value: 100000,
                            message: '期望薪资不能高于1000000',
                        },
                    },
                },
                // 实际薪资
                truesalary: {
                    validators: {
                        notEmpty: {
                            message: '实际薪资不能为空',
                        },
                        greaterThan: {
                            value: 800,
                            message: '实际薪资不能低于800',
                        },
                        lessThan: {
                            value: 100000,
                            message: '实际薪资不能高于1000000',
                        },
                    },
                },
                //省份
                province: {
                    validators: {
                        notEmpty: {
                            message: '省份不能为空',
                        },
                    },
                },
                // 市区
                city: {
                    validators: {
                        notEmpty: {
                            message: '市不能为空',
                        },
                    },
                },
                // 县
                county: {
                    validators: {
                        notEmpty: {
                            message: '县不能为空',
                        },
                    },
                },
            },
        };
    }

    $('.add-form')
        .bootstrapValidator(test())
        .on('success.form.bv', function (e) {
            e.preventDefault();
            console.log('添加');
            // 使用jq的序列化的方法，快速获取表单的数据
            const form = $('.add-form').serialize();
            axios.post('./student/add', form).then((result) => {
                console.log(result);
                // 刷新数据
                getStudentList();
                //关闭模态框
                $('#addModal').modal('hide');
            });
        });
    // 省市级联功能
    renderPosition();
    function renderPosition() {
        const province = document.querySelector('.add-form [name=province]');
        const city = document.querySelector('.add-form [name=city]');
        const county = document.querySelector('.add-form [name=county]');
        console.log("触发了",province)
        // 1.获取中国省份
        axios.get('/geo/province').then((result) => {
            
            // 渲染省份的数据
            let html = `<option value="">--省--</option>`;
            result.forEach(
                (value) => (html += `<option value="${value}">${value}</option>`)
            );
            province.innerHTML = html;
        });
        // 给省下拉列表绑定change事件
        province.addEventListener('change', function () {
            // console.log("当前内容：",this.value)
            // 当没有选择省份的时候，不再发送网络请求，重置市和县
                
            city.innerHTML = `<option value="">--市--</option>`;
            county.innerHTML = `<option value="">--县--</option>`;
            //如果选的是“--省--”这一项，就返回，因为这一项没有市那些数据
            if (!this.value) {
                return;
            }
            // console.log("还没有内容")
            // 1.获取中国省份
            axios.get('/geo/city', { params: { pname: this.value } }).then((result) => {
                // console.log("==" + result)
                // 渲染市的数据
                let html = `<option value="">--市--</option>`;
                result.forEach(
                    (value) => (html += `<option value="${value}">${value}</option>`)
                );
                city.innerHTML = html;
            });
        });

        // // 给市下拉列表绑定change事件
        city.addEventListener('change', function () {
            // 没有选中市时，不再发送网络请求，重置县；当前省份province.value;当前市this.value = city.value
            if (!this.value) {
                county.innerHTML = `<option value="">--县--</option>`;
                return;
            }
            // 1.获取市
            axios.get('/geo/county', {
                params: { pname: province.value, cname: city.value },
            }).then((result) => {
                // console.log("==" + result)
                // 渲染省份的数据
                let html = `<option value="">--县--</option>`;
                result.forEach(
                    (value) => (html += `<option value="${value}">${value}</option>`)
                );
                county.innerHTML = html;
            });
        });
    }
    document.querySelector('#studentAdd').addEventListener('click', function () {
        document.querySelector('.add-form').reset();
    });
    // 修改
    // 修改学员 --- 数据回填
    // 1.点击修改按钮
    $('tbody').on('click', '.update', function () {
        let id = $(this).data('id');
        // 发送请求，获取该学员的信息
        axios.get('/student/one', { params: { id } }).then((result) => {
            if (result.code === 0) {
            // console.log(res.data);
            // 得到数据后，设置每个输入框的value值。下拉框和单项按钮需设置选中状态。
            let { name, age, sex, group, phone, id, salary, truesalary, province, city, county } = result.data;
            $('#updateModal input[name=id]').val(id);
            $('#updateModal input[name=name]').val(name);
            $('#updateModal input[name=age]').val(age);
            $('#updateModal input[name=sex][value=' + sex + ']').prop('checked', true);
            $('#updateModal input[name=phone]').val(phone);
            $('#updateModal input[name=salary]').val(salary);
            $('#updateModal input[name=truesalary]').val(truesalary);
            $('#updateModal select[name=group]').children('[value=' + group + ']').prop('selected', true);
            $('#updateModal select[name=province]').html(`<option value="${province}">${province}</option>`);
            $('#updateModal select[name=city]').html(`<option value="${city}">${city}</option>`);
            $('#updateModal select[name=county]').html(`<option value="${county}">${county}</option>`);
            $('#updateModal').modal('show'); // 这行的意思是让模态框显示
            }
        })
    });
    // 修改学员 --- 确认修改
    $('.update-form').bootstrapValidator(test()).on('success.form.bv', function (e) {
        e.preventDefault();
        //提交逻辑
        // console.log(222);
        let data = $(this).serialize();
        // console.log(data);
        axios.put('/student/update', data).then((result) => {
        // console.log(res);
        if (result.code === 0) {
            toastr.success(result.message);
            getStudentList();
            $('#updateModal').modal('hide')
        }
        })
    });

    // 删除学员
    $('tbody').on('click', '.del', function () {
        if (!confirm('你确定要删除吗？')) return;
        let id = $(this).data('id');
        axios.delete('/student/delete', { params: { id } }).then((result) => {
            if (result.code === 0) toastr.success(result.message); getStudentList();
        })
    })
}