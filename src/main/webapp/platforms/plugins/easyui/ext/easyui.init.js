/**
 * 包含easyui的扩展和常用的方法
 * 
 * @author Administrator
 */


/**
 * @requires jQuery,EasyUI
 * 使panel和datagrid在加载时提示
 */
$.fn.panel.defaults.loadingMessage = '加载中....';
$.fn.datagrid.defaults.loadMsg = '加载中....';


/**
 * 
 * @requires jQuery,EasyUI
 * 
 * 通用错误提示
 * 
 * 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作
 */
var easyuiErrorFunction = function(XMLHttpRequest) {
	$.messager.progress('close');
	var formResult = XMLHttpRequest.responseText;
	if(platform.isNotEmpty(formResult)){
		if(formResult.startWith("e")) formResult = formResult.substring(1);
		var formResultObj = new FormResult(formResult);
		if("exception" == formResultObj.operateResult){
			platform.msgTip("body", {msg:formResultObj.exStack, level:"exception"});
		}
	}
};
$.fn.datagrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.treegrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.tree.defaults.onLoadError = easyuiErrorFunction;
$.fn.combogrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.combobox.defaults.onLoadError = easyuiErrorFunction;
$.fn.form.defaults.onLoadError = easyuiErrorFunction;

/**
 * @requires jQuery,EasyUI
 * 扩展tree，使其支持平滑数据格式
 */
$.fn.tree.defaults.loadFilter = function(data, parent) {
	var opt = $(this).data().tree.options;
	var idFiled, textFiled, parentField;
	if (opt.parentField) {
		idFiled = opt.idFiled || 'id';
		textFiled = opt.textFiled || 'text';
		parentField = opt.parentField;
		var i, l, treeData = [], tmpMap = [];
		for (i = 0, l = data.length; i < l; i++) {
			tmpMap[data[i][idFiled]] = data[i];
		}
		for (i = 0, l = data.length; i < l; i++) {
			if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
				if (!tmpMap[data[i][parentField]]['children'])
					tmpMap[data[i][parentField]]['children'] = [];
				data[i]['text'] = data[i][textFiled];
				tmpMap[data[i][parentField]]['children'].push(data[i]);
			} else {
				data[i]['text'] = data[i][textFiled];
				treeData.push(data[i]);
			}
		}
		return treeData;
	}
	return data;
};

/**
 * @requires jQuery,EasyUI
 * 
 * 防止panel/window/dialog组件超出浏览器边界
 * @param left
 * @param top
 */
var easyuiPanelOnMove = function(left, top) {
	var l = left;
	var t = top;
	if (l < 1) {
		l = 1;
	}
	if (t < 1) {
		t = 1;
	}
	var width = parseInt($(this).parent().css('width'));
	var height = parseInt($(this).parent().css('height'));
	var right = l + width;
	var buttom = t + height;
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	if (right > browserWidth) {
		l = browserWidth - width;
	}
	if (buttom > browserHeight) {
		t = browserHeight - height;
	}
	$(this).parent().css({/* 修正面板位置 */
		left : l,
		top : t
	});
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
$.fn.window.defaults.onMove = easyuiPanelOnMove;
$.fn.panel.defaults.onMove = easyuiPanelOnMove;


/**
 * 初始化每页记录数列表
 */
var pageList=[10,20,30,50,100,200];

/**
 * 初始化每页记录数
 */
var pageSize=20;
	
/** 
 * 初始化常用的datagrid属性，初始的属性与easyUI的原始属性不同
 * 默认选中datagrid的第一行
 */  
 $.extend($.fn.datagrid.defaults,
	{	//标题前图标显示样式 
		iconCls:'icon-table',
		//设置为true将自动使列适应表格宽度以防止出现水平滚动。
		fitColumns:true,
		//设置为true将交替显示行背景。
		striped:true,
		//设置true将在数据表格底部显示分页工具栏。
		pagination:true,
		//当设置分页属性时，初始化每页记录数列表。
		pageList:this.pageList,
		//当设置分页属性时，初始化每页记录数。
		pageSize:this.pageSize,
		//设置为true将显示行数。
		rownumbers:true,
		//设置为true将只允许选择一行。
		singleSelect:true,
		//设置为true时，面版的大小将铺满它所在的容器（浏览器）。
		fit:true,
		//定义是否显示控制面板边框。
		border:false,
		//自定义工具
		tools:'#tools',
		//数据表格顶部面板的工具栏,主要用于搜索框
     	toolbar:'#toolbar',
     	//数据加载成功之后，无数据时显示无数据
     	loader:function(param,success,error){
	 		var datagrid = $(this);
	 		if(!$.data(this,"datagrid"))return false;
	 		var opts = datagrid.datagrid("options");
	 		if(!opts.url) return false;
	 		var onLoadSuccess = opts.onLoadSuccess;
	 		$.ajax({
	 			type:opts.method,
	 			url:opts.url,
	 			data:param,
	 			dataType:"json",
	 			success:function(data){
	 				if(param && param.isLoadSuccess == false){
	 					opts.onLoadSuccess = function(){};
	 					success(data);
	 					opts.onLoadSuccess = onLoadSuccess;
	 					if(opts.fn && $.isFunction(opts.fn)){
	 						opts.fn(datagrid);
	 					}
	 					opts.queryParams.isLoadSuccess = true;//只覆盖一次定义的onLoadSuccess避免多次加载
	 				}else{
	 					success(data);
	 				}	 				
					//无数据时显示无数据
	 				if(!(($.isArray(data) && data.length > 0) || (data.rows && data.rows.length > 0))){
	 					try{
		 					var panel = datagrid.datagrid("getPanel");
		 					var html = "<div class='datagrid-none' style=\"font-size: 13px;color:red;\">暂无数据</div>";
		 					panel.find(".datagrid-row").first().html("");
		 					panel.find(".datagrid-body").eq(1).css({textAlign:'center'}).html(html);
	 					}catch(e){}
	 				}
	 				//显示更新排序列
	 				if(opts.moreSortName){
	 					var $a = $("<span class='icon-order' style='cursor:pointer;display:block;height:18px;' > </span>");
		 				var rownumber = datagrid.datagrid("getPanel").find(".datagrid-header-rownumber"); 
		 				rownumber.empty();
		 				$a.tooltip({
	 						content:function(){
	 							var $content = $("<div></div>")
	 								,name = platform.UUID()
	 								,radioName = platform.UUID()
	 								,inputs = "";
	 			 				$.each(opts.moreSortName, function(index, data){
	 			 					inputs += "<label style='cursor:pointer;'><input type='radio' value='"+ index +"' name='"+ name +"' style='cursor:pointer;' >" + data + "</label>";
	 			 				});
	 			 				inputs += "<br />";
	 			 				inputs += "<label style='cursor:pointer;'><input type='radio' value='ASC' name='"+ radioName +"' checked='checked' style='cursor:pointer;' >顺序</label>"
	 			 						+ "&nbsp;&nbsp;<label style='cursor:pointer;'><input type='radio' value='DESC' name='"+ radioName +"' style='cursor:pointer;' >倒序</label>"
	 			 						+ "&nbsp;&nbsp;<span class='icon-search' style='cursor:pointer;display:inline-block;height:18px;width:18px;position:relative;top:3px;' > </span> ";
	 			 				$content.html(inputs);
	 			 				$content.find("span").bind("click", function(){
	 			 					datagrid.datagrid("options").sortName = $("input[name="+ name +"]:checked").val();
	 			 					datagrid.datagrid("options").sortOrder = $("input[name="+ radioName +"]:checked").val();
	 			 					plat.datagrid.loadGrid(datagrid);
 			 						$a.tooltip('hide');
 			 					});
	 							return $content;
	 						},
	 						position:"right",
	 						onShow:function(){
	 							var t = $(this);
	 		                    t.tooltip('tip').unbind().bind('mouseenter', function(){
	 		                    	t.tooltip('show');
	 		                    }).bind('mouseleave', function(){
	 		                        t.tooltip('hide');
	 		                    });
	 						}
	 					});
		 				$a.appendTo(rownumber);
	 				}
	 				if($.isFunction(opts.onAfterLoadSuccess)) opts.onAfterLoadSuccess(data);
	 			},
	 			error:function(){
	 				error.apply(this,arguments);
	 			}
	 		});
 		}
     },{
    	 onLoadSuccess : function(){
    	 	if($(this).datagrid("getRows").length > 0){
				$(this).datagrid("selectRow",0);
			}else{
				$(this).datagrid("clearSelections");
			} 
     	}
     }
  );

/**
*扩展jQuery easyui datagrid增加动态改变列编辑的类型 
*/
$.extend($.fn.datagrid.methods, {
    addEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item.field);
                e.editor = item.editor;
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param.field);
            e.editor = param.editor;
        }
    },
    removeEditor : function(jq, param) {
        if (param instanceof Array) {
            $.each(param, function(index, item) {
                var e = $(jq).datagrid('getColumnOption', item);
                e.editor = {};
            });
        } else {
            var e = $(jq).datagrid('getColumnOption', param);
            e.editor = {};
        }
    },
	editCell: function(jq,param){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
			for(var i = 0; i < fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field){
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
			for(var i = 0; i < fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	},
	tooltip : function (jq, fields) {
        return jq.each(function () {
            var panel = $(this).datagrid('getPanel');
            if (fields && typeof fields == 'object' && fields.sort) {
                $.each(fields, function () {
                    var field = this;
                    bindEvent($('.datagrid-body td[field=' + field + '] .datagrid-cell', panel));
                });
            } else {
                bindEvent($(".datagrid-body .datagrid-cell", panel));
            }
        });

        function bindEvent(jqs) {
            jqs.mouseover(function () {
                var content = $(this).html();
                $(this).tooltip({
                    content : content,
                    trackMouse : true,
                    onHide : function () {
                        $(this).tooltip('destroy');
                    }
                }).tooltip('show');
            });
        }
    },
    getSelecteds: function(jq){
    	var _ea=$.data(jq[0],"datagrid");
    	var _eb=_ea.options;
    	var _ed=[];
    	_eb.finder.getTr(jq[0],"","selected",2).each(function(){
    		_ed.push(_eb.finder.getRow(jq[0],$(this)));
    	});
    	return _ed;
    }
});

//layout折叠后显示标题
$.extend($.fn.layout.paneldefaults, {
	onCollapse:function () {
		//获取layout容器
		var layout = $(this).closest(".layout");
		if(layout.length == 0) layout = $(this).parents("body.layout");
		//获取当前region的配置属性
		var opts = $(this).panel("options");
		//获取key
		var expandKey = "expand" + opts.region.substring(0, 1).toUpperCase() + opts.region.substring(1);
		//从layout的缓存对象中取得对应的收缩对象
		var expandPanel = layout.data("layout").panels[expandKey];
		//针对横向和竖向的不同处理方式
		if (opts.region == "west" || opts.region == "east") {
			if(opts.iconCls) icon = '<div class="'+ opts.iconCls +'" style="width:20px">&nbsp</div>';
			//竖向的文字打竖,其实就是切割文字加br
			var split = [];
			if(opts.title == null) return;
			for (var i = 0; i < opts.title.length; i++) {
				split.push(opts.title.substring(i, i + 1) + "<br />");
			}
			if(opts.iconCls){
				expandPanel.panel("body").addClass("panel-title").css("text-align", "center").css("line-height", "16px").html('<div style="padding-left: 2px; background-position: left center;width:20px"><div class="'+ opts.iconCls +'" style="width:20px">&nbsp</div>' + split.join("") +'</div>');
			}else{
				expandPanel.panel("body").addClass("panel-title").css("text-align", "center").css("line-height", "16px").html(split.join(""));
			}
		}else{
			if(opts.iconCls){
				expandPanel.panel("setTitle", '<div class="panel-title panel-with-icon">'+ opts.title +'</div><div class="panel-icon '+ opts.iconCls +'"></div>');
			}else{
				expandPanel.panel("setTitle", opts.title);
			}
		}
	}
});

/**
 * 扩展datagrid editor
 */
$.extend($.fn.datagrid.defaults.editors, { 
	/**
	 * 扩展date editor
	 * 支持格式 
	 * yyyy, yyyy-MM, yyyy-MM-dd, yyyy-MM-dd hh, yyyy-MM-dd hh:mm, yyyy-MM-dd hh:mm:ss
	 */
	date:{
		init: function(container, options){
			var input = $('<input >').appendTo(container); 
			options = options || {};
			var fmt = options.fmt || "yyyy-MM-dd";
			if(fmt.startWith("yyyy-MM-dd hh")){
				return input.datetimebox($.extend(options,{ 
					showSeconds:"yyyy-MM-dd hh:mm" != fmt,
					formatter:function(date){ 
						return new Date(date).dateFormat(fmt); 
					} 
				})); 	
			}else{
				return input.datebox($.extend(options,{ 
					formatter:function(date){ 
						return new Date(date).dateFormat(fmt); 
					} 
				})); 
			}
		}, 
		getValue: function(target){ 
			var options;
			try{
				options = $(target).datebox("options");
			}catch(e){
				options = $(target).datetimebox("options");
			}
			options = options || {};
			fmt = options.fmt || "yyyy-MM-dd";
			var value;
			try{
				value = $(target).datebox("getValue");
			}catch(e){
				value = $(target).datetimebox("getValue");
			}
			if(!value)	return ;
			value = value.replace(/-/g, '/'); // 格式化为格式"2010/08/01";
			return new Date(value).dateFormat(fmt); 
		}, 
		setValue: function(target, value){ 
			var options;
			try{
				options = $(target).datebox("options");
			}catch(e){
				options = $(target).datetimebox("options");
			}
			options = options || {};
			var fmt = options.fmt || "yyyy-MM-dd";
			if(platform.isNotEmpty(value)) {
				if(typeof value == "object"){
					value = new Date(value.time).dateFormat(fmt);
				}else{
					value = new Date(value).dateFormat(fmt);
				}
				try{
					$(target).datetimebox("setValue",value); 
				}catch(e){
					$(target).datebox("setValue",value); 
				}
			}
		}, 
		resize: function(target, width){ 
			var input = $(target); 
			if ($.boxModel == true){ 
				input.width(width - (input.outerWidth() - input.width())); 
			}else{
				input.width(width);
			} 
			try{
				input.datebox("resize", width);
			}catch(e){
				input.datetimebox("resize", width);
			}
		} 
	},
	/**
	 * 扩展searchbox editor
	 */
	
	searchbox:{
		init: function(container, options){
			var input = $('<input >').appendTo(container); 
			options = options || {};
			var $searchbox = input.searchbox(options); 
			var textbox = $(input).searchbox("textbox");
			var required = options.required;
			if(required){
				$(textbox).addClass('searchboxValidate');
				$(textbox).validatebox({    
				    required: true,
				    missingMessage: '该输入项为必输项'
				});
			}
			$(textbox).attr("readonly", Boolean(options.readonly));
			return $searchbox;
		}, 
		getValue: function(target){ 
			return $(target).searchbox("getValue"); 
		}, 
		setValue: function(target, value){ 
			return $(target).searchbox("setValue", value); 
		}, 
		resize: function(target, width){ 
			var input = $(target); 
			if ($.boxModel == true){ 
				input.width(width - (input.outerWidth() - input.width())); 
			}else{
				input.width(width);
			} 
			input.searchbox("resize", width);
		} 
	},
	/**
	 * 扩展下拉框 editor
	 */
	select:{
		init: function(container, options){
			options = options || {};
			var required = options.required;
			var textField = options.textField || "DMNR";
			var valueField = options.valueField || "DM";
			var data = options.data;
			var option = "";
			$(data).each(function(){
				option += "<option value='" + this[valueField] + "'>" + this[textField] + "</option>";
			});
			var $select = $("<select > ");
			$select.addClass("datagrid-editable-input");
			if(required){
				$select.addClass("easyui-validatebox");
				$select.attr("required", true);
			}
			var returnInput = $select.appendTo(container); 
			$(option).appendTo(returnInput);
			$.parser.parse();
			return returnInput; 	
		}, 
		getValue: function(target){ 
			return $(target).val(); 
		}, 
		setValue: function(target, value){ 
			return $(target).val(value); 
		}, 
		resize: function(target, width){ 
			var input = $(target); 
			if ($.boxModel == true){ 
				input.width(width - (input.outerWidth() - input.width())); 
			}else{
				input.width(width);
			} 
			input.width(width - 7);
		} 
	},
	/**
	 * 文本框editor，可添加事件
	 */
	selectText:{
		init: function(container, options){
			options = options || {};
			var required = options.required;
			//初始化所有事件
			var $input = $("<input >")
				,events = ["onblur", "onchange", "onclick", "ondblclick", "onfocus", "onhelp" , 
							 "onkeydown", "onkeypress", "onkeyup", "onmousedown", "onmousemove", 
							 "onmouseout", "onmouseover", "onmouseup", "onselect"];
			for(var i = 0; i < events.length; i++){
				var event = events[i];
				var optEvent = options[event];
				if(platform.isNotEmpty(optEvent)){
					if($.isFunction(optEvent)){
						event = event.substring(2);
						$input.bind(event, optEvent);
					}
				};
			}
			$input.addClass("datagrid-editable-input");
			if(required){
				$input.addClass("easyui-validatebox");
				$input.attr("required", true);
			}
			var returnInput = $input.appendTo(container); 
			$.parser.parse();
			return returnInput; 	
		}, 
		getValue: function(target){ 
			return $(target).val(); 
		}, 
		setValue: function(target, value){ 
			return $(target).val(value); 
		}, 
		resize: function(target, width){ 
			var input = $(target); 
			if ($.boxModel == true){ 
				input.width(width - (input.outerWidth() - input.width())); 
			}else{
				input.width(width);
			} 
			input.width(width - 6);
		} 
	}
});

$.extend($.fn.tabs.methods, {  
        //显示遮罩   
        loading: function (jq, msg) {  
            return jq.each(function () {  
                var panel = $(this).tabs("getSelected");  
                if (platform.isEmpty(msg)) {  
                    msg = "正在加载数据，请稍候...";  
                }  
                $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: panel.width(), height: panel.height() }).appendTo(panel);  
                $("<div class=\"datagrid-mask-msg\"></div>").html(msg).appendTo(panel).css({ display: "block", left: (panel.width() - $("div.datagrid-mask-msg", panel).outerWidth()) / 2, top: (panel.height() - $("div.datagrid-mask-msg", panel).outerHeight()) / 2 });  
            });  
        },  
        //隐藏遮罩   
        loaded: function (jq) {  
            return jq.each(function () {  
                var panel = $(this).tabs("getSelected");  
                panel.find("div.datagrid-mask-msg").remove();  
                panel.find("div.datagrid-mask").remove();  
            });  
        },
        //根据id获取tab
        getTabById:function(jq,tid){
        	var tab = undefined;
        	var allTabs = $(jq[0]).tabs('tabs');
        	 $.each(allTabs, function() {
        		var opt = $(this).panel('options');
        		if(tid == opt.id){
        			tab = $(this);
        			return false;
        		}
        	 }); 
        	 return tab; 
        } 
 }); 

$.extend($.fn.combobox.methods, {  
    //根据Value获取显示的值
    getTextByValue: function(jq,value) {  
    	 var opts = $(jq[0]).combobox("options");
         var data = $.data(jq[0],"combobox").data;
         var valueField = opts.valueField;
         var textField = opts.textField;
         if(data && data.length > 0){
      	   for(var i = 0;i < data.length;i++){
      		   var row = data[i];
      		   if(row[valueField] == value){
      			   return row[textField];
      		   }
      	   }
         }
         return '';
    }
}); 

/*$.extend($.fn.tabs.defaults,{
	onUnselect:function(title, index){
		var $this = $(this), tab = $this.tabs("getTab",index);
		var panel = tab.panel('panel');
		var frame = panel.find('iframe');
		if(platform.isNotEmpty(frame[0])){
			var win = frame[0].contentWindow;
			if($.isFunction(win.isChange)){
				if(win.isChange()){
					platform.confirm("提示信息","当前页面数据已有修改，是否保存。",function(r){
						if(r){
							$this.tabs("select",index);
							frame[0].contentWindow.saveForm();
						}
					});
				}
			}
		}
	}
});*/

/**
 * dialog的初始化宽度设置
 */
function initWidth(){
	var dialogWidth = "";
	try{
		dialogWidth = $(window)._outerWidth() > 800 ? 800 : $(window)._outerWidth();
	}catch(e){
		
	}
	return dialogWidth;
}

/**
 * dialog的初始化高度设置
 */
function initHeight(){
	var dialogHeight = "";
	try{
		dialogHeight = $(window)._outerHeight() > 500 ? 500 : $(window)._outerHeight();
	}catch(e){
		
	}
	return dialogHeight;
}

/** 
 * 初始化常用的datagrid属性，初始的属性与easyUI的原始属性不同
 * 默认选中datagrid的第一行
 */  
 $.extend($.fn.dialog.defaults,
	{	
		//设置面板宽度。如果当前窗口的宽度大于800px,则设置为800px,否则设置为当前窗口宽度
		width:initWidth(),
		//设置面板高度。如果当前窗口的高度大于500px,则设置为500px,否则设置为当前窗口高度
		height:initHeight(),
		//设置一个16x16图标的CSS类ID显示在面板左上角。
		iconCls:'icon-table',
		//定义是否将窗体显示为模式化窗口。
		modal:true,
		//dialog标题
		title:' '
     } 
  );

 /**
  * 释放iframe内存
  */
 $.fn.panel.defaults = $.extend($.fn.panel.defaults,{
	 onBeforeDestroy:function(){
	     var frame=$('iframe', this);
	     if(frame.length>0){
	    	 platform.cleanIframe(frame);
	     }
     }
 });
 
/* 
  初始化分页插件的默认属性
   
$.extend($.fn.pagination.defaults,
 	{	
		//定义是否显示刷新按钮。
	  	showRefresh:false,
	  	//在输入组件之后显示一个label标签。
	  	afterPageText:'',
	  	//在输入组件之前显示一个label标签。
	  	beforePageText:'',
	  	//显示页面信息。
	  	displayMsg:'共{total}条'
     } 
);*/ 

//初始化为不验证
$.extend($.fn.validatebox.defaults,
	{
		//为true时关闭验证功能
		novalidate:true
	}
);

$.extend($.fn.datebox.defaults,
	{
		//设置时间输入框不能编辑
		editable:false,
		novalidate:true
	}
);

$.extend($.fn.datetimebox.defaults,
	{
		//设置时间输入框不能编辑
		editable:false,
		novalidate:true
	}
);


$.extend($.fn.combobox.defaults,
	{
		panelHeight:'auto',
		novalidate:true,
		onShowPanel:function(){
			var $this = $(this), 
				$panelHeight = $($this.combobox("panel")[0]).height(),
				initHeight = 300;
			if($panelHeight > initHeight){
				$this.combobox({panelHeight:initHeight});
			}
		}
	}
);

$.extend($.fn.combotree.defaults,
	{
		novalidate:true
	}
);

$.extend($.fn.timespinner.defaults,
		{
			novalidate:true,
			missingMessage: '该输入项为必输项'
		}
);

$.extend($.fn.numberbox.defaults,
	{
		novalidate:true
	}
);
 
/**
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展validatebox
 */
$.extend($.fn.validatebox.defaults.rules, {
	checked :{//验证复选框与单选框的必填 
		validator : function(value, param){
			var groupname = this.name, ok = false;
			var position = $(this).validatebox("options").tipPosition;
			$('input[name="' + groupname + '"]').each(function () { 
		        if (this.checked) {
		        	ok = true;
		        	return false;
		        }
		    });
			$('input[name="' + groupname + '"]').filter(".easyui-validatebox").each(function(){
				var obj = $(this), objParent = obj.parents("td");
				if (!ok){
					objParent.addClass('validatebox-invalid');
					objParent.css({border:"2px solid #BE7E7E"});
				}else{
					objParent.removeClass('validatebox-invalid');
					objParent.css({border:"0px"});
				}
				objParent.mouseover(function(){
					objParent.tooltip({content:"请至少选择一项！",position : position}).tooltip(ok ? "destroy" : "show");
					try{
						objParent.tooltip("tip").css({color:"#000",borderColor:"#CC9933",backgroundColor:"#FFFFCC"});
					}catch(e){}
				});
			});
		    return true
		},
		message : ''	
	},
	eqPwd : {//验证两次密码是否相同
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '密码不一致！'
	},
	minLength: {//验证字符最小长度   
        validator: function(value, param){   
            return value.replace(/[^\x00-\xff]/g,"**").length >= param[0];   
        },   
        message: '请最少输入{0}个字符！'  
    },
	maxLength: {//验证字符最大长度   
        validator: function(value, param){   
            return value.replace(/[^\x00-\xff]/g,"**").length <= param[0];   
        },   
        message: '长度不能超过{0}个字符！'  
    },
    integer: {//验证整型   
        validator: function(value){   
        	if(value == parseInt(value)){
				value = parseInt(value);
			}
            return (/^[+|-]?\d+$/).test(value); 
        },   
        message: '必须是整数!如: 88'  
    },
    floatType: {//验证浮点型   
        validator: function(value){   
        	if(value == parseFloat(value)){
				value = parseFloat(value);
			}
            return (/^[-|\+]?\d+\.\d+$/).test(value);
        },   
        message: '必须是浮点数!如: 88.88'  
    },
    intOrFloat:{// 验证整数或小数
		validator:function(value) {
			if(value == parseFloat(value)){
				value = parseFloat(value);
			}
			return (/^\d+(\.\d+)?$/i).test(value);
		},
		message:'请输入数字,并确保格式正确'
	},
	intAndFloat:{//验证负数，整数，浮点
		validator:function(value) {
			if(value == parseFloat(value)){  //对科学计数法，进行判断
				value = parseFloat(value);
			}
			return (/^[-|\+]?\d+(\.\d+)?$/).test(value);
		},
		message:'请输入数字,并确保格式正确'
	},
	minNum: {//验证最小值
		validator : function(value, param) {
			return parseFloat(value) >= param[0];
		},
		message : '不能小于{0}'
	},
	maxNum:{//验证最大值
		validator : function(value, param) {
			return parseFloat(value) <= param[0];
		},
		message : '不能大于{0}'
	},
	btwNum:{//验证区间值
		validator : function(value, param) {
			return (parseFloat(value) >= param[0]) && (parseFloat(value) <= param[1]);
		},
		message : '必须在{0}到{1}之间'
	},
	minVal:{//验证最小值(传入jquery对象)
		validator : function(value, param) {
			var obj = $(param[0]);
			if(obj.size() == 0)	return true;
			if(obj.val() == '')	return true;
			return parseFloat(value) >= obj.val();
		},
		message : '所填值超出范围'
	},
	maxVal:{//验证最大值(传入jquery对象)
		validator : function(value, param) {
			var obj = $(param[0]);
			if(obj.size() == 0)	return true;
			if(obj.val() == '')	return true;
			return parseFloat(value) <= obj.val();
		},
		message : '所填值超出范围'
	},
	greaterThan:{//大于
		validator : function(value, param) {
			return parseFloat(value) > param[0];
		},
		message : '必须大于{0}'
	},
	lessThan:{//小于
		validator : function(value, param) {
			return parseFloat(value) < param[0];
		},
		message : '必须小于{0}'
	},
    phone: {//验证电话号码   
        validator: function(value){   
             return (/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)/).test(value);
        },   
        message: '必须是电话号码!如: 0755-2923256 或 2923256'  
    },
    mobile: {//验证手机号   
        validator: function(value){   
            return (/^1[3|4|5|7|8][\d]{9}$/).test(value);
        },   
        message: '必须是手机号码!如: 13502731773'  
    },
    phoneOrMobile:{
    	validator: function(value){   
            return (/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)/).test(value) || (/^1[3|4|5|7|8][\d]{9}$/).test(value);
        },   
        message: '必须是手机号码或电话号码!如: 13502731773 或 0755-2923256' 
    },
    idcard: {//验证身份证号   
        validator: function(value){
        	var rules = $.fn.validatebox.defaults.rules;  
        	var ret = checkIdcard(value);
        	if(ret != null){
        		rules.idcard.message = ret;  
        		return false;
        	}
            return ret == null;
        },   
        message: ''  
    },
    chinese:{// 验证中文
		validator:function(value) {
			return (/^[\u0391-\uFFE5]+$/i).test(value);
		},
		message:'请输入中文'
	},
	english:{// 验证英语
		validator:function(value) {
			return (/^[A-Za-z]+$/i).test(value);
		},
		message:'请输入英文字母'
	},
    faxno:{// 验证传真
		validator:function(value) {
			return (/^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i).test(value);
		},
		message:'传真号码不正确'
	},
	postcode:{// 验证邮政编码
		validator:function(value) {
			return (/^[1-9]\d{5}$/i).test(value);
		},
		message:'邮政编码格式不正确'
    },
	carNo:{//验证车牌号
		validator:function(value){
			return (/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/).test(value); 
		},
		message:'车牌号码无效（例：粤J12350）'
	},
	msn:{//验证msn账号
		validator:function(value){
			return (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(value); 
		},
		message:'请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
	},
	date:{//验证日期
		 validator: function(value, format){
        	var rules = $.fn.validatebox.defaults.rules;  
        	var ret = checkDate(value, format);
        	if(platform.isNotEmpty(ret)){
        		rules.date.message = ret;  
        		return false;
        	}
            return true;
        },   
        message: ''  
	},
	equalsDate:{
		/**
		 * 比较时间或日期的前后
		 * 编辑页面使用：validType="equalsDate['#RZKSSJ', '任职开始时间不能大于结束时间']" ，
		 * 					参数一：需要比较的控件，参数二：提示信息
		 * 子表页面使用：validType:'equalsDate[gzjl_datagrid, \'工作经历开始日期不能大于结束日期\', \'equalDate\']'， 
		 * 					参数一：需要验证的datagrid表格对象，参数二：提示信息，参数三：需要比较的日期的字段名
		 */
		validator: function(value, params){
			var obj = "", msg = "结束时间不能大于开始时间", equalsField, equalsValue;
        	if(platform.isNotEmpty(params)){
        		obj = params[0] || obj;
        		msg = params[1] || msg;
        		equalsField =  params[2];
        	}
        	obj = platform.getObject(obj);
        	try{
        		var index = $(this).parents('.datagrid-row').attr('datagrid-row-index');
        		equalsField = obj.datagrid("getEditor", {index:index,field:equalsField});
				try{
					equalsValue = $(equalsField.target).datebox("getValue");
				}catch(e){
					equalsValue = $(equalsField.target).datetimebox("getValue");
				}
        	}catch(e){
        		try{
        			equalsValue = obj.datebox("getValue");
				}catch(e){
					equalsValue = obj.datetimebox("getValue");
				}
        	}
			var rules = $.fn.validatebox.defaults.rules;  
			rules.equalsDate.message = msg;
			return value >= equalsValue;
        },    
        message: ''   
	},
	equalsNum:{
		/**
		 * 比较两个数字的大小
		 * 编辑页面使用：validType="equalsNum['#maxNum', '最小值不能大于最大值']" ，
		 * 					参数一：需要比较的控件，参数二：提示信息
		 * 子表页面使用：validType:'equalsNum[gzjl_datagrid, \'最小值不能大于最大值\', \'minNum\']'， 
		 * 					参数一：需要验证的datagrid表格对象，参数二：提示信息，参数三：需要比较的数字的字段名
		 */
		validator: function(value, params){
			var obj = "", msg = "最小值不能大于最大值", equalsField, equalsValue;
        	if(platform.isNotEmpty(params)){
        		obj = params[0] || obj;
        		msg = params[1] || msg;
        		equalsField =  params[2];
        	}
        	obj = platform.getObject(obj);
        	try{
        		var index = $(this).parents('.datagrid-row').attr('datagrid-row-index');
        		equalsField = obj.datagrid("getEditor", {index:index,field:equalsField});
        		$(equalsField.target).numberbox("getValue");
        	}catch(e){
        		equalsValue = obj.numberbox("getValue");
        	}
			var rules = $.fn.validatebox.defaults.rules;  
			rules.equalsNum.message = msg;
			return parseFloat(value) > parseFloat(equalsValue);
        },    
        message: ''   
	},
	/**
	 * 验证combobox等控件不为空，可扩展
	 * 使用方法isNotEmpty['#id','combobox']
	 */
	isNotEmpty:{
		validator: function(value, params){
			var obj, type = "combobox";
			if(platform.isNotEmpty(params)){
        		obj = params[0] || obj;
        		type = params[1] || type;
        	}
        	obj = platform.getObject(obj);
        	if("combobox" == type){
        		value = obj.combobox("getValue");
        	}
			return platform.isNotEmpty(value);
		},
		message: '该输入项为必填项'   
	}
});

/**
 * 校验日期
 * @param string 被校验的字符串
 */
function checkDate(string,format) {
	if(format == null || format == '' || format == 'yyyy-MM-dd'){
	    if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(string)) {
	        var arr = string.split("-");
	        var date = new Date(arr[0], arr[1] - 1, arr[2]);
	        if (date.getFullYear() == arr[0] && date.getMonth() + 1 == arr[1] && date.getDate() == arr[2]) {
	            return '';
	        }
	    }
	    return '必须是日期格式!如: 2008-08-08';
    }else if(format == 'yyyy'){
    	if (/^\d{4}$/.test(string)) {
	        return '';
	    }
	    return '必须是年份!如: 2008';
    }else if(format == 'yyyy-MM'){
    	if (/^\d{4}-\d{1,2}$/.test(string)) {
	        var arr = string.split("-");
	        var date = new Date(arr[0], arr[1] - 1, 1);
	        if (date.getFullYear() == arr[0] && date.getMonth() + 1 == arr[1]) {
	            return '';
	        }
	    }
	    return '必须是年月!如: 2008-08';
    }else if(format == 'yyyy-MM-dd HH:mm'){
    	if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}$/.test(string)) {
    		var arr = string.split(" ");
	        var arr1 = arr[0].split("-");
	        var arr2 = arr[1].split(":");
	        var date = new Date(arr1[0], arr1[1] - 1, arr1[2], arr2[0], arr2[1]);
	        if (date.getFullYear() == arr1[0] && date.getMonth() + 1 == arr1[1] && date.getDate() == arr1[2]){
	            return '';
	        }
	    }
	    return '必须是日期格式!如: 2008-08-08 08:08';
    }else if(format == 'yyyy-MM-dd HH:mm:ss'){
    	if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/.test(string)) {
    		var arr = string.split(" ");
	        var arr1 = arr[0].split("-");
	        var arr2 = arr[1].split(":");
	        var date = new Date(arr1[0], arr1[1] - 1, arr1[2], arr2[0], arr2[1], arr2[2]);
	        if (date.getFullYear() == arr1[0] && date.getMonth() + 1 == arr1[1] && date.getDate() == arr1[2]){
	            return '';
	        }
	    }
	    return '必须是日期格式!如: 2008-08-08 08:08:08';
    }
    return '日期格式不正确!';
}

/**
 * 检验身份证号码是否有效
 */
function checkIdcard(idcard){ 
	 var Errors=new Array("身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证号码有误!"); 
	 var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
	 var S; //校验和

	 var Y; //校验序号
	 var JYM; //校验规则
	 var M; //校验码

	 var idcard_array = new Array(); 
	 idcard_array = idcard.split(""); 
	 if(area[parseInt(idcard.substr(0,2))]==null) { 
	     return Errors[3];
	 } //验证地区
	 switch(idcard.length){ 
		  case 15: 
			if ((parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 && (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){ 
				ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; 
			} else { 
			    ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; 
			} 
			if(!ereg.test(idcard)) {
			    return Errors[1]; 
			} 
			break; 
		  case 18: 
			if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 && parseInt(idcard.substr(6,4))%4 == 0 )){ 
				ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式 
			} else { 
				ereg=/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式 
			} 
			if(ereg.test(idcard)){ 
				S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 
				+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 
				+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 
				+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 
				+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 
				+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 
				+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 
				+ parseInt(idcard_array[7]) * 1 
				+ parseInt(idcard_array[8]) * 6 
				+ parseInt(idcard_array[9]) * 3 ; 
				Y = S % 11; 
				M = "F"; 
				JYM = "10X98765432"; 
				M = JYM.substr(Y,1); 
				if(M != idcard_array[17]){ 
				    return Errors[2]; 
				}
			}else {
			     return Errors[1];
			} 
			break; 
		 default: 
		    return Errors[0]; 
		 	break; 
	} 
} 

	