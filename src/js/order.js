define(['jquery','js/countil'],function($,countil){
    /*获取地址栏参数*/
    function getParam() {
        var url = location.search;
        if (!url) return false;
        url = url.substr(1);
        // city_id=143&city_name=%E5%8E%A6%E9%97%A8
        var params = url.split("&"),
            arr, param = {};
        $.each(params, function (i, obj) {
            arr = obj.split("=");
            param[arr[0]] = decodeURI(arr[1]);
        });
        return param;
    }
  $.ajax({
        url:'http://managepc.daodir.cn/mobile/user/getGuideList',
        success:function(data){
          console.log(data.obj)
        }
    })
    var param=getParam(),
        dateIn=param.date_in,
        dateOut=param.date_out,
        cityId=param.city,
        price=param.price,
        type=param.type_name,
        name=param.hotel_name;
    /*点击返回按钮*/
    $("#lis").on("click",function(){
        //历史记录的后退之后的页面
        //history.go(-1);
        //链接调回首页
        var url = 'detail.html?'+'city='+cityId+'&hotel_name='+name+'&date_in='+dateIn+'&date_out='+dateOut+'';
        window.location.href = url;
    });
    //把网页中所有内容补全 dateIn;dateOut
    function renderToDom(){
        $("#pics").attr("src",localStorage.getItem("hotelImg"));
        // 显示、设置入住和离店日期
        $("#date_in").val(dateIn);
        $("#date_out").val(dateOut);
        $("#inText").text(dateIn);
        $("#outText").text(dateOut);
        $("#tprice").text(price);
        $("#rprice").val(price);
        $("#type_name").text(type);
        $("#book_price").text("￥"+price);
    }
     renderToDom();
    function bindEvent(){
        // 加
        $("#add").on("click",function(){
            if($(this).hasClass("no")){
                $(".mark").show();
                countil.showDialog("您最多只能预定5间","关闭");
                return;
            }
            $("#sub").removeClass("no");
            var count=parseInt($("#roomcount").val());
            count++;
            if(count>=5){
                count=5;
                $(this).addClass("no");
            }
            $("#roomcount").val(count);
            changeTotalPrice(count);
            appendNode(count);
        });
        // 减
        $("#sub").on("click",function(){
            if($(this).hasClass("no")){
                $(".mark").show();
                countil.showDialog("您不能取消房间","关闭");
                return;
            }
            $("#add").removeClass("no");
            var count=parseInt($("#roomcount").val());
            count--;
            if(count<=1){
                count=1;
                $(this).addClass("no");
            }
            $("#roomcount").val(count);
            changeTotalPrice(count);
            removeNode();
        });
        // 清空文本框
        $("#info-boxs input[type=text]").focus(
            function(){
                $(this).next().css("display","block");
            });
        $("#info-boxs .clear_input").click(
            function(){
                $(this).prev().val("");
                $(this).css("display","none");
            });

        // 立即预定
        $(".submit").on("click",function(){
            if(!checkAll())return;
            var userInfo={};
            $("#info-boxs input[type=text]").each(function(i,input){
                var val=$(this).val();
                if(i%2!=0 && input.id!="phone"){

                    if(!countil.checkCard(val)){
                        var num=input.id.substr(input.id.length-1);
                        if(num=="1") num="";
                        countil.showDialog("证件"+num+'无效',"关闭");
                        return;
                    }
                }
                if(input.id=="phone"){
                    if(!countil.checkPhone(val)){
                        countil.showDialog("请输入有效的手机号码","关闭");
                        return;
                    }
                }
                userInfo[input.id]=val;
            });
            location.href='success.html';
        });

        function checkAll(){
            var $inputs=$("#info-boxs input[type=text]");
            for(var i=0,len=$inputs.length;i<len;i++){
                if($inputs[i].value==""){
                    $(".mark").show();
                    countil.showDialog("信息填写不完整，请重新填写","关闭");
                    return false;
                }
            }
            return true;
        }
    }
    bindEvent();
    // 添加信息
    function appendNode(count){
        var html='<div class="userInfo">'
            +'<ul class="infos">'
            +'<li><i>姓名'+count+'</i><input type="text" placeholder="每间只需填写一个姓名" id="userName'+count+'"><span class="clear_input">x</span></li>'
            +'</ul>'
            +'<ul class="infos">'
            +'<li><i>证件'+count+'</i><input type="text" placeholder="入住人身份证好/证件号" id="idcard'+count+'"><span class="clear_input">x</span></li>'
            +'</ul>'
            +'</div>';
        $(html).appendTo($("#info"));
        $("#info input").focus(
            function(){
                $(this).next().css("display","block");
            });
        $(".clear_input").click(
            function(){
                $(this).prev().val("");
                $(this).css("display","none");
            });
    }
    // 删除信息
    function removeNode(){
        $("#info>div").last().remove();
    }
    function changeTotalPrice(count){
        var total=price*count;
        $("#tprice").text(total);
        $("#rprice").val(total);
    }
});