define(['jquery','swiper','js/city','js/canlendar'],function($,swiper,city,canlendar){
    var searchHistory = localStorage.getItem('search-history');
    if(searchHistory){
        searchHistory = JSON.parse(searchHistory);
        $('.local-city').text(searchHistory.city);
        $('.date-in').text(searchHistory.inDate);
        $('.date-out').text(searchHistory.outDate);
    }else{
        var cur = new Date();
        $('.date-in').text(cur.getFullYear()+'-'+(cur.getMonth()+1)+'-'+cur.getDate());
        $('.date-out').text(cur.getFullYear()+'-'+(cur.getMonth()+1)+'-'+(cur.getDate()+1))
        console.log($(".date-out").text())
    }

    new swiper('.swiper-container',{
        loop:true,
        autoplay:4000
    });
    $('.local-city').on('click',function(){
        city.show($(this));
    });
    //判断时间是否符合规范
    function checkDate(){
        var dateIn = $('.date-in').text();
        var dateOut = $('.date-out').text();
        var inText = $('#inText').text();
        var outText = $('#outText').text();
        if((new Date(dateOut) - new Date(dateIn))/(1000*60*60*24)<0 || (new Date(outText) - new Date(inText))/(1000*60*60*24)<0){
            alert('时间不符合')
        }
    }
    $('.local-time').on('click',function(){
        canlendar.show($('.date-in'),function(){
            checkDate();
        });
    });
    $('.leave-time').on('click',function(){
        canlendar.show($('.date-out'),function(){
            checkDate();
        });
    });
    /*页面中modify修改内容的，应该这样设置*/
    $("#modify").on("click", function () {
        //判断如果离店日比住店日时间小，肯定改的就是离店日，相反就是住店日
           if($('#outText').text()<$('#inText').text()){
               canlendar.show($("#outText"),function(){
                   checkDate();
               })
           }else{
               canlendar.show($("#inText"),function(){
                   checkDate();
               })
           }
    });
    $('.search-btn').on('click',function(){
        var city = $.trim($('.local-city').text()),
            inDate = $.trim($('.date-in').text()),
            outDate = $.trim($('.date-out').text()),
            hotel_name= $.trim($("#hotel_name").val());
        if(city=='' || inDate=='' || outDate == ''){
            alert('请填写完整信息')
        }else{
            var obj={
                city:city,
                inDate:inDate,
                outDate:outDate,
                hotel_name:hotel_name
            };

            var ls = window.localStorage;
            ls.setItem('search-history',JSON.stringify(obj));

            var url = 'list.html?'+'city='+city+'&hotel_name='+hotel_name+'&indate='+inDate+'&outdate='+outDate;

            window.location.href = url;
        }
    })
});