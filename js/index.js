$(function() {
    load();
    $("#title").on("keydown", function(event) {
        if (event.keyCode === 13) {
            if ($(this).val() === "") {
                alert("请输入内容");
            } else {
                var local = getData();
                // console.log(local);
                local.push({ title: $(this).val(), done: false });
                saveData(local);
                load();
                $(this).val("");
            }
        }
    });
    //3.todolist删除操作
    $("ol,ul").on("click", "a", function() {
        var data = getData();
        var index = $(this).attr("id");
        data.splice(index, 1);
        saveData(data);
        load();
    });
    $("ol,ul").on("click", "input", function() {
        var data = getData();
        // console.log(data);
        var index = $(this).siblings("a").attr("id");
        data[index].done = $(this).prop("checked");
        saveData(data);
        load();
    });
    //读取本地存储的数据
    function getData() {
        var data = localStorage.getItem("todolist");
        if (data !== null) {
            return JSON.parse(data);
        } else {
            return [];
        }
    }
    //保存数据到本地
    function saveData(data) {
        localStorage.setItem("todolist", JSON.stringify(data));
    }
    //渲染加载数据
    function load() {
        var data = getData();
        // 清空
        $("ol,ul").empty();
        var todoCount = 0;
        var doneCount = 0;
        $.each(data, function(i, n) {
            if (n.done) {
                $("ul").prepend("<li><input type='checkbox' checked='checkeds'><p>" + n.title + "</p><a href='javascript:;' id=" + i + "></a></li>");
                doneCount++;
            } else {
                $("ol").prepend("<li><input type='checkbox'><p>" + n.title + "</p><a href='javascript:;' id=" + i + "></a></li>");
                todoCount++;
            }
        })
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
    }
})