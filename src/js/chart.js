define(['jquery','temp','js/countil'],function($,temp,util){
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
    var param=getParam(),
        dateIn=param.indate,
        dateOut=param.outdate,
        cityId=param.city,
        hotel_name=param.hotel_name;
    $("#date_in").val(dateIn);
    $("#date_out").val(dateOut);
    $("#inText").text(dateIn);
    $("#outText").text(dateOut);
    /*用artTemplate模板渲染数据*/
     var tpl='<%for (var i=0;i<hotel_list.length;i++) {%>'
         +'<div class="hotel_rows" distance="<%=hotel_list[i].distance%>" stars=<%=hotel_list[i].stars%>级 price=<%=hotel_list[i].low_price/100%> brand=<%=hotel_list[i].name%>>'
                 +'<a  href="detail.html?'+'city='+cityId+'&hotel_name='+hotel_name+'&date_in='+$("#date_in").val()+'&date_out='+$("#date_out").val()+'">'
                +'<dl>'
                 +'<dt>'
                     +'<img src="../<%=hotel_list[i].image%>" alt="">'
                 +'</dt>'
                 +'<dd>'
                    +'<h2><%=hotel_list[i].name%></h2>'
                    +'<ul>'
                    +'<li class="pf">4.5分</li>'
                    +'<li>礼</li>'
                    +'<li>促</li>'
                    +'<li>返</li>'
                    +'<li>￥<%=hotel_list[i].low_price/100%>起</li>'
                    +'</ul>'
                   +'<p class="ip"><em><%=hotel_list[i].stars%>级</em></p>'
                   +'<address><em><%=hotel_list[i].addr%></em><span><%=hotel_list[i].distance/1000%>km</span></address>'
                 +'</dd>'
               +'</dl>'
                +'</a>'
          +'</div>'
          +'<%}%>';
    var rend=temp.compile(tpl);
        util.showLoading($(".hotel_list"));
    $.when($.ajax('../data/hotel.json'))
        .then(function(data){
          //console.log(data.result)
         var  str=rend(data.result);
           setTimeout(function(){
               $(".hotel_list").html(str).trigger('render');
           },1000);
        },function(err){
          console.log(err)
        });
    /*点击返回按钮*/
    $("#back").on("click",'a',function(){
        //历史记录的后退之后的页面
        //history.go(-1);
        //链接调回首页
        location.href='index.html';
    });
   //点击底部导航的内容进行的操作：
    var screenDom=$('.item_layer');
    $('.ftnav').on('click','a',function(){
        var index=$(this).index();
        $("#item_layer").css({
            'height':"20rem",
            '-webkit-transition':'height 0.3s ease-in-out'
        });
        var ml=$('body')[0].querySelector('#ui-mark');
        if(!ml){
            var dom=document.createElement('div');
            dom.setAttribute('id','ui-mark');
            $('body')[0].appendChild(dom);
        }else{
            $(ml).show();
        }
        if($(this).hasClass('cur_item')){
            $(this).removeClass('cur_item');
            screenDom.hide();
            $(ml).hide();

        }else{
            $(this).addClass('cur_item').siblings().removeClass('cur_item');
            screenDom.children("div").eq(index).addClass("cur_layer").siblings().removeClass("cur_layer");
            screenDom.show();
        }
    });
    // 渲染排序方式
    function getSort(){
        var sort={
           /* "all":"不限",*/
            /*"hotMax":"人气最高",
            "priceMin":"价格最低",
            "priceMax":"价格最高",*/
            "disMin":"由远到近",
            "disMax":"由近到远"

        };
        var html='<ul>';
        $.each(sort,function(k,text){
            html+='<li class="'+k+'">'+
                '<a href="javascript:void(0)">'
                +'<b>'+text+'</b>'
                +'<span></span>'
                +'</a>'
                +'</li>';
        });
        html+='</ul>';
        $("#sort").html(html).children('li').eq(0).addClass("on");
    }
    // 隐藏弹出层
    function hideLayer(){
        setTimeout(function(){
            $('#ui-mark').remove();
            $("#item_layer").css({
                'height':'0',
                '-webkit-transition':"height 0.3s ease-in-out"
            })
        },500)
    }
    //点击排序的框，根据所选的内容进行筛选并隐藏掉弹出层
    var arr=[],arr1;
    $(".hotel_list").on("render",function(){
        var sbox=$(".hotel_rows");
        sbox.each(function(i,v){
            var iobj={};
            iobj['dom']=v;
            iobj['distance']=$(v).attr("distance");
            arr.push(iobj);
        });
       arr.sort(function(x,y){
             if((x.distance)*1> (y.distance)*1){
                 return 1;
             }else if((x.distance)*1< (y.distance)*1){
                 return -1;
             }else {
                 return 0;
             }
        });
    });
    $("#sort").on("click",'span',function(){
        var $cur=$(this),
            $text=$(this).parents('li').text();
        $cur.addClass("on").parents('li').siblings().find('span').removeClass("on");
        //console.log($text)
        if($text=="由近到远"){
            arr.reverse();
            arr.forEach(function(i){
               $(".hotel_list").append(i.dom);
            })
        }else if($text=="由远到近"){
            arr.reverse();
            arr.forEach(function(i){
                //console.log(i);
                $(".hotel_list").append(i.dom);
            })
        }
        hideLayer();
    });
    getSort();
    // 渲染价格
    function getPrice(){
        var price={
                "0":["不限",-100,-100],
                "1":["0-100",0,100],
                "2":["101-200",101,200],
                "3":["201-300",201,300],
                "4":["301-400",301,400],
                "5":["401-500",401,500],
                "6":["500以上",500,-100]
            },
            html=["<ul>"];
        $.each(price,function(key,arr){
            html.push('<li class="'+key+'" price='+arr[1]+','+arr[2]+'>',
                '<a href="javascript:void(0)">',
                '<b>'+arr[0]+'</b>',
                '<span></span>',
                '</a>',
                '</li>');
        });
        $("#price").html(html.join(""));
    }
    //点击价格的框，根据所选的内容进行筛选并隐藏掉弹出层
    getPrice();
    // 渲染品牌
    function getBrand(){
        var hotelBrands = {
            0:'不限',
            12:'喜来登',
            15:'北京如家酒店',
            18:"北京万豪酒店",
            35:"香格里拉",
            39:"北京桔子酒店",
            44:"北京格林豪泰酒店",
            48:"北京汉庭酒店",
            49:"北京翠微酒店",
            50:"北京锦江之星酒店",
            51:"北京尚客优酒店",
            52:"北京布丁酒店",
            53:"北京7天酒店"
        }
        var html='<ul>';
        $.each(hotelBrands,function(k,text){
            html+='<li class="'+k+'" brand='+text+'>'+
                '<a href="javascript:void(0)">'
                +'<b>'+text+'</b>'
                +'<span></span>'
                +'</a>'
                +'</li>';
        })
        html+='</ul>';
        $("#brand").html(html).children('li').eq(0).addClass("on");
    }
    getBrand();
    // 渲染星级
    function getStar(){
        var stars = {
            "0":"不限",
            "1":"经济型级",
            "2":"二星级",
            "3":"三星级",
            "4":"四星级",
            "5":"五星级"
        }
        var html='<ul>';
        $.each(stars,function(k,text){
            html+='<li class='+k+' stars='+text+'>'+
                '<a href="javascript:void(0)">'
                +'<b>'+text+'</b>'
                +'<span></span>'
                +'</a>'
                +'</li>';
        });
        html+='</ul>';
        $("#star").html(html).children('li').eq(0).addClass("on");
        $("#star").html(html).children('li').eq(0).addClass("on");
    }
    $("#star").on("click",'span',screenClick);
    $("#price").on("click",'span',screenClick);
    $("#brand").on("click",'span',screenClick);
    //筛选
    function screenClick(){
        if($(this).parents('li').hasClass('0')){
            $(this).addClass('on').parents('li').siblings().find('span').removeClass("on");
        }else{
            $(this).parents('.lay-child').find(".0").find("span").removeClass('on');
            if($(this).hasClass('on')){
                $(this).removeClass('on');
            }else{
                $(this).addClass('on');
            }
        }
        var str="";
        $(this).parents("#star").find(".on").each(function(i,v){
            /*  str+=$(this).parents('li').attr("stars")+' ';*/
            if($(this).parents('li').attr("stars") =="不限") {
                str="[stars],";
            }else{
                str+="[stars='"+$(this).parents('li').attr("stars")+"'],"
            }

        });
        $(this).parents("#price").find(".on").each(function(i,v){
            /*  str+=$(this).parents('li').attr("stars")+' ';*/
            if($(this).parents('li').attr("price") =="不限") {
                str="[price],";
            }else{
                str+="[price='"+$(this).parents('li').attr("price")+"'],"

            }
        });
        $(this).parents("#brand").find(".on").each(function(i,v){
            /*  str+=$(this).parents('li').attr("stars")+' ';*/
            if($(this).parents('li').attr("brand") =="不限") {
                str="[brand],";
            }else{
                str+="[brand='"+$(this).parents('li').attr("brand")+"'],"
            }

        });
        filter(str.substr(0,str.length-1));
    }
    function filter(str){
        console.log(str)
        var divs=$(".hotel_list div").show();
         // console.log(divs.not("[stars='三星级']").hide());
       divs.not(str).hide();
    };
    getStar();
});