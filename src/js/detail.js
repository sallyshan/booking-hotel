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
    //console.log(countil.format());
    var param=getParam(),
        dateIn=param.date_in,
        dateOut=param.date_out,
        cityId=param.city,
        name=param.hotel_name;
    $("#datein").val(dateIn);
    $("#dateout").val(dateOut);
    $("#inText").text(dateIn);
    $("#outText").text(dateOut);
    /*点击返回按钮*/
    $("#lc").on("click",function(){
        //历史记录的后退之后的页面
        //history.go(-1);
        //链接调回首页
       var url='list.html?'+'city='+cityId+'&hotel_name='+name+'&date_in='+$("#datein").val()+'&date_out='+$("#dateout").val()+'';
        location.href=url;
    });
    function bindEvent(){
        $(".base_info").on("click","li",function(){
            $(this).addClass("on").siblings().removeClass("on");
            var index=$(this).index();
            $(".content_wrap>div").eq(index).addClass("cur_info").siblings().removeClass("cur_info")
        });
        //ajax渲染数据
        var stars=["","经济型","二星","三星","四星","五星"];
        $.when($.ajax('../data/hotelDetail.json'))
            .then(function(data){
               // console.log(data.result)
                //渲染文本框信息：
                var  str=data.result;
                Text(str);
                JSON(str);
            },function(err){
                console.log(err)
            });
        function Text(str){
            $("#description").html(str.desc);
            $("#sheshi").html(str.facilities);
            var img="../"+str.images.split(";")[0];
            localStorage.setItem("hotelImg",img);
            $("#hotel_img>img").attr("src",img);
            var $li=$("#hotel_info_list>li");
            $("#hotel_name").text(str.name);
            $li.eq(0).text(stars[str.star]);
            $li.eq(1).html(str.tel.replace(/,/g,"&nbsp;&nbsp;&nbsp;&nbsp;"));
            $li.eq(2).text(str.addr);
        }
        // 渲染房间信息
        var html='',btn='',price;
        function JSON(data){
            console.log(data)
            for(var i=0,len=data.room_types.length;i<len;i++){
                var obj=data.room_types[i];
                $.each(obj.goods,function(k,room){
                    price=Math.min.apply(null,room.price)/100;
                    //这是判断后面是预订还是客满，通过room_state状态来表示，1是还有，0是无
                    if(room.room_state==1){
                        btn='<span data-roomtype="'+obj.name+'" data-typeid="'+obj.type_id+'" data-roomid="'+room.room_id+'" data-price="'+price+'" data-type="'+obj.bed_type+'">预定</span>';
                    }else{
                        btn='<span class="full">客满</span>';
                    }
                    html+='<div class="detail_row">'
                        +'<dl>'
                        +'<dt>'+obj.name+'</dt>'
                        +'<dd>'+obj.bed_type+'</dd>'
                        +'</dl>'
                        +'<p>'+price+'</p>'
                        +btn
                        +'</div>'
                });
            }
            $(html).appendTo($("#detail_list"));
        }
        // 展开和收起
        $(".hotel_btn").on("click",function(){
            var $article=$(this).prev();
            if($(this).text()=="展开详情"){
                $(this).text("收起");
                $article.css("height","auto");
            }else{
                $(this).text("展开详情");
                $article.css("height","3.2rem");
            }
        });
        // 预定房间
        $("#detail_list").on("click","span",function(){
            var img=$(this).data("img"),
                price=$(this).data("price"),
                type=$(this).data("roomtype");
            if($(this).is(".full"))return;
            $(".mark").show();
            $("#layer").css({
                '-webkit-transition':'height 0.3s ease-in-out',
                'height':'21rem'
            });
            $("#pics").attr("src",img);
            $("#bed_name").text(type);
            $("#book_price").text(price);
            $("#bed_type").text($(this).data('type'));
            $("#room_name").val(type);
            $("#img").val(img);
            $("#room_id").val($(this).data("id"));
            $("#price").val($(this).data("price"));
            $(".close").on("click",function(){
                $(".mark").hide();
                $("#layer").css({
                    '-webkit-transition':'height 0.3s ease-in-out',
                    'height':'0rem'
                })
            });
            $("#gotoOrder").on("click",function(){
                // 找出订单页的地址
                var typeId=$(this).data("typeid"),
                    typeName=$("#bed_name").text(),
                    roomId=$(this).data("roomid"),
                    price=$("#price").val();
                url='order.html?city='+cityId+'&date_in='+$("#inText").text()
                    +'&date_out='+$("#outText").text()
                    +'&hotel_name='+encodeURI(name)+'&type_id='+typeId
                    +'&type_name='+encodeURI(typeName)+'&room_id='+roomId
                    +'&price='+price;
                window.location.href=url;
            });
        })
    }
    bindEvent();
});