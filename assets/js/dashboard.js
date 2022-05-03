window.onload = function () {
    getStudentOverview();
    function getStudentOverview() {
        axios.get('./student/overview').then((result) => {
            console.log(result);
            const { total, avgSalary, avgAge, proportion } = result.data;
            document.querySelector('.total').innerText = total;
            document.querySelector('.avgSalary').innerText = avgSalary;
            document.querySelector('.avgAge').innerText = avgAge;
            document.querySelector('.proportion').innerText = proportion;
        });
    }
}