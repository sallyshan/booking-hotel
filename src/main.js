require.config({
    paths:{
        'jquery':'lib/jquery',
        'swiper':'lib/swiper',
        'fastclick':'lib/fastclick',
        'temp':'lib/template.native'
    }
});
//依赖fastclick和index/chart所代表的js文件
require(['fastclick','js/index','js/chart','js/detail','js/order'],function(FastClick,index){
    FastClick.attach(document.body,{});
    var cur = new Date();
    $('.date-in').text(cur.getFullYear()+'-'+(cur.getMonth()+1)+'-'+cur.getDate());
    $('.date-out').text(cur.getFullYear()+'-'+(cur.getMonth()+1)+'-'+(cur.getDate()+2))
});
