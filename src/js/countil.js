define(['jquery'],function($){
    return {
        transitionEnd:function (){
            var ele = document.createElement('bootstrap');
            var obj = {
                WebkitTransform : 'webkitTransitionEnd',
                MozTransform : 'TransitionEnd',
                MsTransform : 'msTransitionEnd',
                OTransform : 'oTransitionEnd',
                Transform : 'transitionEn'
            };

            for(var i in obj){
                if(ele.style[i] !== undefined ){
                    return obj[i];
                }
            }

        }(),
        inArray : function(target, arr){
            if(typeof target=='object' || typeof target=='function' || typeof target== 'NaN' || typeof target== 'null' || typeof target == 'undefined'){
                return false
            }else{
                for(var i=0; i<arr.length; i++){
                    if(target == arr[i]){
                        return true
                    }
                }
            }
            return false;
        },
        // 显示加载动画
        showLoading: function () {
            this.showMark();
            // 生成加载动画
            if ($("#ui-id-loading").length == 0) {
                var $loading = $('<div class="ui-id-loading" id="ui-id-loading"><img></div>');
                $loading.children('img').attr("src", "../img/loading.gif");
                $loading.appendTo($(".hotel_list"));
            }
        },
        // 删除加载动画
        hideLoading: function () {
            $('#ui-id-mark').remove();
            $('#ui-id-loading').remove();
        },
        showMark: function () {
            if ($('#ui-id-mark').length == 0) {
                $('<div id="ui-id-mark" class="ui-id-mark"></div>').appendTo($(".hotel_list"));
            }
        },
        // 显示弹出框
        showDialog: function (msg, btn, callback) {
            var _this = this;
            if ($("#ui-id-dialog").length == 0) {
                var html = '<div class="ui-id-dialog" id="ui-id-dialog">' + '<div class="tipcontainer">' + '<div class="content">' + msg + '</div>' + '<p class="btns">' + '<a href="javascript:void(0)" id="dialog-btn">' + btn + '</a>' + '</p>' + '</div>' + '</div>';
                $(html).appendTo($("body"));
                $("#dialog-btn").on("click", function () {
                    _this.hideDialog();
                    $(".mark").hide();
                    callback && callback();
                })
            }
        },
        // 隐藏弹出框
        hideDialog: function () {
            this.hideMark();
            $("#ui-id-dialog").remove();
        },
        // 检测手机号码
        checkPhone: function (phone) {
            var reg = /^1[3578]\d{9}$/;
            if (reg.test(phone)) {
                return true;
            }
            return false;
        },
        hideMark: function () {
            $('#ui-id-mark').remove();
        },
        // 检测身份证号码
        checkCard: function (card) {
        var reg = /^\d{17}(x|\d)$/;
        if (reg.test(card)) {
            return true;
        }
        return false;
        }
    }

});