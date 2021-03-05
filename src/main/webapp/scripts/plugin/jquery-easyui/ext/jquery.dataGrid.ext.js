/**
 * Created by Administrator on 2016/3/18.
 */

var autoChangeSideColor = {

    changeLeftColor : function () {                 //参数
        var  tableId  = "datagrid";              //tableID,必选，改table的id
        var t;                                   // t（可选）:类型   1：连续点击要么选中，要么不选中，2：连续点击永远选中
        var i;                                   // i（可选）:easyui生成表格后".datagrid-btable"table下的tr的id值；
                                                 // 例如：id = "datagrid-row-r1-2-0" 此时，i的值应为"-r1-"中的 1;
        if(!arguments.length){
            var tableRow = $("." + tableId + "-view2").find("."+tableId + "-row");
            if(tableRow.length){
                var rowIdArr = $(tableRow[0]).attr("id").split("-");
                if(rowIdArr[2].toLowerCase() == "r1"){
                    t = 2;
                    i = 1;
                }else if(rowIdArr[2].toLowerCase() == "r2"){
                    t = 1;
                    i = 2;
                }
            }
        }else if(arguments.length == 1){
            if(arguments[0] == 1){
                t = 1;
                i = 2;
            }else if(arguments[1] == 2){
                t = 2;
                i = 1;
            }
        }else if(arguments.length == 2){
            t = arguments[0];
            i = arguments[1];
        }
        $("." + tableId + "-view2").find("."+tableId + "-row").each(function(){
            $(this).on("click", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                if(t == "1"){
                    if($("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").hasClass(tableId+"-row-selected")){
                        $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").removeClass(tableId+"-row-selected")
                    }else{
                        $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-selected")
                    }
                }else if(t == "2"){
                    $("."+tableId+"-row-selected").removeClass(tableId+"-row-selected");
                    $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-selected")
                }
            })
            $(this).on("mouseenter", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                if(!($("#"+tableId+"-row-r"+i+"-2-"+index).hasClass(""+tableId+"-row-alt"))){
                    $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-over")
                }
            });
            $(this).on("mouseleave", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").removeClass(tableId+"-row-over")
            });
        });

        $("." + tableId + "-view1").find("."+tableId + "-row").each(function(){
            $(this).on("click", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                if(t == "1"){
                    if($("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").hasClass(tableId+"-row-selected")){
                        $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").removeClass(tableId+"-row-selected")
                    }else{
                        $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-selected")
                    }
                }else if(t == "2"){
                    $("."+tableId+"-row-selected").removeClass(tableId+"-row-selected");
                    $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-selected")
                }
            });
            $(this).on("mouseenter", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                if(!($("#"+tableId+"-row-r"+i+"-2-"+index).hasClass(tableId+"-row-alt"))){
                    $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").addClass(tableId+"-row-over")
                }
            });
            $(this).on("mouseleave", function (e) {
                var index = $(this).attr(tableId+"-row-index");
                $("#"+tableId+"-row-r"+i+"-1-"+index).find("."+tableId+"-cell-rownumber").removeClass(tableId+"-row-over")
            });
        });
        $("."+tableId+"-header-check input").on("click", function (e) {
            if(!$(this).is(':checked')){
                $("."+tableId+"-cell-rownumber").removeClass(tableId+"-row-selected");
            }else{
                $("."+tableId+"-cell-rownumber").addClass(tableId+"-row-selected");
            }
        })
    },
    changeRightColor : function () {
        var  tableId  = "datagrid";
        $("."+ tableId + "-view2").find(tableId+"-body").css({
            width:"100%"
        })
        $("."+tableId + "-btable").css({
            width:"100%"
        })
    }
};