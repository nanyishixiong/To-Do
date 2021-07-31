$(function() {
    load();
    $("#title").on("keydown", function(event) {
        if (event.keyCode === 13) {
            if ($(this).val() === "") {
                alert("请输入内容");
            } else {
                var local = getData();
                // console.log(local);
                local.push({ title: $(this).val(), done: false, important: false });
                saveData(local);
                load();
                $(this).val("");
            }
        }
    });
    //3.todolist删除操作
    $("ol,ul").on("click", "a", function(event) {
        var data = getData();
        var index = $(this).attr("id");
        data.splice(index, 1);
        saveData(data);
        load();
    });
    //点击打勾
    $("ol,ul").on("click", "input", function(event) {
        var data = getData();
        // console.log(data);
        let index = $(this).siblings("a").attr("id");
        data[index].done = $(this).prop("checked");
        saveData(data);
        load();
        event.stopPropagation();
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
                $("ul").prepend("<li><input type='checkbox' checked='checkeds'><p>" + n.title + "</p><i title='important'></i><a href='javascript:;' id=" + i + "></a></li>");
                doneCount++;
            } else {
                $("ol").prepend("<li><input type='checkbox'><p>" + n.title + "</p><i title='important'></i><a href='javascript:;' id=" + i + "></a></li>");
                todoCount++;
            }
            if (n.important) {
                $("#" + i).siblings("i").css("backgroundColor", "skyblue");
            }
        })
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
        // $("ul,ol").children("li").each(function(index, element) {
        //     $(element).stop().fadeIn(300 * (index + 1));
        // })
        console.log();
        //渲染后给小圆圈绑定事件&&优先级
        $("li i").on("click", function(event) {
            let data = getData();
            let index = $(this).siblings("a").attr("id");
            if ($(this).css("backgroundColor") === 'rgba(0, 0, 0, 0)') {
                $(this).css("backgroundColor", "skyblue");
                data[index].important = true;
                let obj = data.splice(index, 1);
                data.push(obj[0]);
                saveData(data);
                load();
            } else {
                $(this).css("backgroundColor", "rgba(0, 0, 0, 0)");
                data[index].important = false;
                let obj = data.splice(index, 1);
                data.unshift(obj[0]);
                saveData(data);
                load();
            }
            event.stopPropagation();
        });

        //点击显示文本域
        let dex = undefined; //用来存索引号
        $("ul,ol").children("li").click(function() {
            if ($(this).children("a").attr("id") == dex) {
                $("aside").slideUp(500);
                dex = undefined;
                return;
            }
            $("aside").stop().slideDown(500);
            let data = getData();
            let index = $(this).children("a").attr("id");
            $("textarea").val($(this).children("p").text());
            $("textarea").siblings("input").prop("checked", data[index].done);
            $("textarea").siblings("a").attr("id", index);
            if (data[index].important) {
                $("textarea").siblings("i").css("backgroundColor", "skyblue");
            } else {
                $("textarea").siblings("i").css("backgroundColor", "rgba(0, 0, 0, 0)");
            }
            dex = index;
        });
        //修改todo
        $("textarea").blur(function() {
            let data = getData();
            data[dex].title = $(this).val();
            saveData(data);
            load();
        });
    }

    //文本域自适应
    $("textarea").change(function() {
        $(this).css("height", $(this)[0].scrollHeight + "px");
    });




    //清除已完成
    $(".clearall").on("click", function() {
        let data = getData();
        let arr = [];
        $.each(data, function(index, element) {
            if (element.done === false) {
                arr.push(element);
            }
        });
        saveData(arr);
        load();
    });
})