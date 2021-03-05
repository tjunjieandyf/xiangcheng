//分隔符 横线
var line_heng = "-";
//存放复制的临时数值
var tempCopyValueMap = {};
/**
 * 基本处理方法
 * @namespace
 */
var power = {
		
	/**
	 * @private 
	 * 默认处理信息
	 */
	processMessage:"正在处理，请等候...",
		
    /**
     * 验证JS对象为空
     * @param obj  需要验证的对象
     * @returns 验证结果
     */
	isEmpty:function(obj){
		if(typeof obj == 'object') return $.isEmptyObject(obj);
		obj = $.trim(obj); 
		return (obj == undefined || obj == "" || obj == null);
	},
	
	/**
	 * 验证JS对象不为空
	 * @param obj  需要验证的对象
	 * @returns 验证结果
	 */
	isNotEmpty:function(obj){
		return !this.isEmpty(obj);
	},
	
	/**
	 * @private
	 * 生成随机数
	 * @returns 随机数
	 */
	random4:function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	},
	
	/**
	 * 生成唯一的UUID
	 * @returns UUID
	 */
	UUID:function() {
		return (this.random4() + this.random4() + this.random4() + this.random4() + this.random4() +  this.random4() + this.random4() + this.random4());
	},
	
	/**
	 * 得到当前毫秒数
	 * @returns 毫秒数
	 */
	getTime:function(){
		return new Date().getTime();
	},
	
	/**
	 * 将字符串转化
	 */
	convertStr:function(str){
		if(power.isEmpty(str)) return;
  		return str.replaceAll("%22","\"").replaceAll("&#39;","'").replaceAll("&gt;",">").replaceAll("&lt;","<");
	},
	
	/**
	 * 表单提交，同步提交
	 * @param form  表单对象对象, "#autofrm1"或"$('form[name=autoform]')"
	 * @param method  操作,如save, insert， 默认"save"
	 */
	syncSubmit:function(form, method){
		method = method || "save";
		form = form || $('form').last();
		form = this.getObject(form);
		var needValidate = (method == 'insert' || method == 'update' || method == 'save'
			|| method == 'saveAndInsert' || method == 'saveAndClose');
		if(!needValidate){
			form.submit();
		}else{
			form.form("enableValidation");	
			if(this.validateForm(form)) {
				var action = ctx + '/pages/form.do';
				form.attr("action", action);
				$("input[name='method']").val(method);   
				form.submit();
			}
		}
	},
	
	/**
	 * 表单提交，异步提交
	 * 
	 * @param obj JSON格式参数，可取值： form 表单对象，默认取页面中最后一个表单　
	 * 									method 默认为"save"
	 * 									successMsg 操作成功后的提示信息
	 * 									msgStyle 提示信息的样式
	 * 									time 提示信息的显示时间
	 * 									failMsg	操作失败后的提示信息
	 * 									columns 字符串参数，如果有多个，以","分开，指定替换的字段名，对应name属性值 "YHID,YHMM"
	 * 									replaceAllColumn true of false, 是否替换所有的值，
	 * 												默认false, 只替换主键值与token值
	 * 												设置为true,替换所有字段值，如果设置了columns属性，则以columns为准
	 * 									afterInsert 插入之后调用的JS方法
	 * 									afterUpdate 更新之后调用的JS方法
	 * 									afterSave 保存之后调用的JS方法
	 * 									fn 操作成功后调用的方法，如果设置了beforeInsert，afterInsert等方法，此方法不会被执行
	 *									isShowMsg 是否显示提示信息 true 显示 false不显示， 默认为 true
	 * 									
	 * 如：{form:'#form', method:'update', replaceAllColumn:true, columns:'', fn: function(){alert(1)}}
	 */
	asynSubmit:function(obj){
		//关闭提示信息
		$(".tip-msg").each(function(){
			power.hiddenMsg(this);
		});
		var form = $('form').last();
		var method = "save";
		var successMsg = "";
		var msgStyle = {};
		var time = "";
		var failMsg = "";
		var replaceAllColumn = false;
		var columns = "";
		var afterInsert = "";
		var afterUpdate = "";
		var afterSave = "";
		var fn = "";
		var isShowMsg = true;
		//需要返回的数据
		var returnDate = "";
		if(power.isNotEmpty(obj)){
			form = obj.form || form;
			method = obj.method || method;
			successMsg = obj.successMsg || successMsg;
			msgStyle = obj.msgStyle || msgStyle;
			time = obj.time || time;
			failMsg = obj.failMsg || failMsg;
			replaceAllColumn = obj.replaceAllColumn || replaceAllColumn;
			columns = obj.columns || columns;
			afterInsert = obj.afterInsert || afterInsert;
			afterUpdate = obj.afterUpdate || afterUpdate;
			afterSave = obj.afterSave || afterSave;
			fn = obj.fn || fn;
			isShowMsg = power.isNotEmpty(obj.isShowMsg) ? obj.isShowMsg : isShowMsg;
		}
		var $form = power.getObject(form);
		if(power.isEmpty($form[0])){
			power.alert("提示信息", "没有找到form表单，请检查!", "info");
			return;
		}
		var needValidate = (method == 'insert' || method == 'update' || method == 'save'
			|| method == 'saveAndInsert' || method == 'saveAndClose');
		if(!needValidate){
			$form.form("disableValidation");
		}else{
			$form.form("enableValidation");	
		};
		if(power.validateForm($form)){
			$.messager.progress({text : this.processMessage});
			var $methodInput  = $("input[name='method']");
			if(power.isEmpty($methodInput) || $methodInput.length == 0){
				$methodInput = $("<input type='hidden' name='method' value='"+ method +"'>");
				$methodInput.appendTo($form);
			}else{
				$methodInput.val(method);
			}
			var action = ctx + '/pages/form.do';
			$form.attr("action", action);
			$form.form("submit", {
				onSubmit: function(param){    
					param.async = "true";
			    },    
				success:function(formResult){
					//需要更新到form里的值
					var values = {};
					if(power.isEmpty(formResult)){
						$.messager.progress("close");
						power.alert("提示信息", "返回数据为空，请重新操作或联系系统管理员！", "warning");
						return;
					}
					formResult = formResult.split("#####POWERDATA#####");
					var formResultObj = new FormResult(formResult[1]);
					try{
						var isLoadPk = true;
						if(power.isEmpty(columns)){
							if(replaceAllColumn){
								values = formResultObj.data;
								isLoadPk = false;
							}
						}else{
							if(columns.indexOf(",") == -1){
								values[columns] = formResultObj.data[columns];
							}else{
								var cols = columns.split(",");
								$(cols).each(function(index, value){
									values[value] = formResultObj.data[value];
								});
							}
						}
						if(power.isNotEmpty(formResultObj.token)){
							values["org.apache.struts.taglib.html.TOKEN"] = formResultObj.token;
						}
						if(isLoadPk){
							var pks = formResultObj.primaryKey;
							$(pks).each(function(index, value){
								values[value] = formResultObj.data[value];
							});
						}
						if("success" == formResultObj.operateResult){
							//添加参数判断是否运行fn方法
							var isRunFn = true;
							if("insert" == formResultObj.operateType){
								if($.isFunction(afterInsert)){
									isRunFn = false;
									afterInsert(formResult[0]);
								}
							}else if("update" == formResultObj.operateType){
								if($.isFunction(afterUpdate)){
									isRunFn = false;
									afterUpdate(formResult[0]);
								}
							}else if("save" == formResultObj.operateType){
								if($.isFunction(afterSave)){
									isRunFn = false;
									afterSave(formResult[0]);
								}
							}
							$form.form("load", values);
							if($.isFunction(fn) && isRunFn) fn(formResult);
							power.monitorDataChange(); 
						}
						if("success" == formResultObj.operateResult){
							if(isShowMsg){ 
								power.msgTip($form, {msg:power.isNotEmpty(successMsg) ? successMsg : formResultObj.message,time:time}, msgStyle);
							}
						}else if("fail" == formResultObj.operateResult){
							if(isShowMsg){ 
								power.msgTip($form, {msg:power.isNotEmpty(failMsg) ? failMsg : formResultObj.message, level:'fail'}, msgStyle);
							}
						}else if("exception" == formResultObj.operateResult){
							if(isShowMsg){ 
								power.msgTip($form, {msg:formResultObj.exStack, level:"exception"},msgStyle);
							}
						}
						$.messager.progress("close");
					}catch(e){
						$.messager.progress("close");
						if("exception" == formResultObj.operateResult){
							power.msgTip($form, {msg:formResultObj.exStack, level:"exception"});
						}else{
							power.alert('错误', e, 'error');   
						}
					}
					if("success" != formResultObj.operateResult) $form.form("load", values);
				},
				onLoadError:function(){
					$.messager.progress('close'); 
					power.alert('错误', "异步提交出错，请重新提交或联系系统管理员！", 'error');   
				}
			});
			
		}
	},	
	
	/**
	 * 把form表单的元素转换成属性与值对应
	 * @param eleForm 表单的id号，格式：#+元素id号, 或对象
	 **/
	formatElement:function(eleForm){
		var beanForm = power.getObject(eleForm);
		var eleArray = beanForm.serializeArray(); 
		if(eleArray != ''){
			var eleObj = {};
			for (var i = 0; i < eleArray.length; i++) { 
				eleObj[eleArray[i].name] = eleArray[i].value;
			}
			return eleObj;
		}
		return {};
	},
	
	/**
	 * 把form表单的元素转换成属性与值对应
	 * @param eleForm 表单的id号，格式：#+元素id号, 或对象
	 **/
	formatElementById:function(eleForm, id){
		var beanForm = power.getObject(eleForm);
		var eleArray = beanForm.serializeArray(); 
		if(eleArray != ''){
			var eleObj = {};
			for (var i = 0; i < eleArray.length; i++) { 
				var $sel = $(id).find("[name='" + eleArray[i].name + "']");
				if($sel.length == 1){
					eleObj[eleArray[i].name] = $sel.val();
				}else if($sel.length > 1){ //适应单选框和复选框
					eleObj[eleArray[i].name] = eleArray[i].value;
				}
			}
			return eleObj;
		}
		return {};
	},
	
	/***格式化元素中的input信息**/
	formatInputElement: function(el){
		var obj = {};
		$("input",el).each(function(){
			var key = this.name;
			var value = this.value;
			obj[key] = value;
		});
		return obj;
	},
	
	/**
	 * 把json对象数据赋值给表单元素，表单元素的名称要与json的属性名称一致
	 * @param eleForm 表单的id号，格式：#+元素id号, 或对象
	 * @data 		json对象
	 **/
	serializeElement:function(eleForm,data){
		var beanForm = power.getObject(eleForm);
		var eleArray = beanForm.serializeArray();
		if(eleArray != ''){
			for (var i = 0; i < eleArray.length; i++) { 
				var name = eleArray[i].name;
				if(power.isNotEmpty(data[name])) beanForm.find("input[name='" + name + "']").val(data[name]);
			}
		}
	},
	
	/**
	 * 刷新 datagrid, treegrid ...
	 *  @param param JONS格式参数，可取值：parent 需要刷新的表格对象与form表单的关系，是否为父页面，可取值 window.parent 等。
	 *  								grid datagrid表格对象 或 treegrid对象等
	 *  								choose 选择更新哪种Grid，默认为datagrid
	 *  								fn 回调函数
	 *  								beforeReload 刷新前调用的方法
	 *  								isLoadSuccess 如果更新datagrid此参数有效，true执行定义的onLoadSuccess事件，false则不执行,默认为false
	 *  如：{parent:window.parent, grid:"#grid", choose:"treegrid", fn:function(){},beforeReload:function(){},isLoadSuccess:false}
	 */
	updateGrid:function(param){
		var choose = "datagrid";
		if(power.isNotEmpty(param)){
			choose = param.choose || choose;
		}
		if("datagrid" == choose){
			this.updateDatagrid(param);
		}else if("treegrid" == choose){
			this.updateTreegrid(param);
		}else if("tree" == choose){
			this.updateTree(param);
		}
	},
	
	/**
	 * @private
	 * 
	 * 初始化刷新grid的数据
	 */
	initUpdateGrid:function(grid, param){
		var parent, beforeReload;
		if(power.isNotEmpty(param)){
			grid = param.grid || grid;
			parent = param.parent || parent;
			beforeReload = param.beforeReload || beforeReload;
		}
		grid = power.isNotEmpty(parent) ? parent.$(grid) : power.getObject(grid);
		if(grid.length == 0){
			power.alert("提示信息","请检查需要刷新的对象是否存在。","info");
			return false;
		}
		if($.isFunction(beforeReload)){
			try{beforeReload(grid); }catch(e){return false;}
		}
		return grid;
	},
	
	/**
	 * @private
	 * 刷新 datagrid
	 */
	updateDatagrid:function(param){
		var grid = "#datagrid", fn, isLoadSuccess = false;
		var grid = this.initUpdateGrid(grid, param);
		if(!grid) return false;
		if(power.isNotEmpty(param)){
			fn = param.fn || fn;
			isLoadSuccess = param.isLoadSuccess ? param.isLoadSuccess : false;
		}
		grid.datagrid("options").queryParams.isLoadSuccess = isLoadSuccess;
		var fnc = function() {
			if ($.isFunction(fn)) {
				fn(grid);
			}
		};
		grid.datagrid("options").fn = fnc;
		grid.datagrid("reload");		
	},
	
	/**
	 * @private
	 * 刷新 treegrid
	 */
	updateTreegrid:function(param){
		var grid = "#treegrid", fn;
		var grid = this.initUpdateGrid(grid, param);
		if(!grid) return false;
		if(power.isNotEmpty(param)){
			fn = param.fn || fn;
		}
		grid.treegrid('reload');
		if($.isFunction(fn)){
			fn(grid);
		}
	},
	
	/**
	 * @private
	 * 刷新 tree
	 */
	updateTree:function(param){
		var grid = "#tree", fn;
		var grid = this.initUpdateGrid(grid, param);
		if(!grid) return false;
		if(power.isNotEmpty(param)){
			fn = param.fn || fn;
		}
		grid.tree('reload');
		if($.isFunction(fn)){
			fn(grid);
		}
	},
	
	/**
	 * confirm提示框
	 * @param title 标题
	 * @param msg 提示信息
	 * @param fun 回调方法
	 * @returns 返回提示框
	 */
	confirm:function(title, msg, fn) {
		return $.messager.confirm(title, msg, fn);
	},

	/**
	 * show提示框
	 * @returns 返回提示框
	 */
	show:function(options) {
		return $.messager.show(options);
	},

	/**
	 * alert提示框
	 * @param title 标题
	 * @param msg 提示信息
	 * @param icon 图标样式 
	 * @param fun 回调方法
	 * @returns 返回提示框
	 */
	alert:function(title, msg, icon, fn) {
		return $.messager.alert(title, msg, icon, fn);
	},
	
	/**
     * 防止Iframe内存溢出，清空Iframe占用的内存
     * @param validForm  需要验证的表单对象
     */
	cleanIframe:function(iframe){
		if(power.isEmpty(iframe) && iframe.length == 0) return;
		iframe = this.getObject(iframe);
		//清空iframe的内容
		iframe[0].contentWindow.document.write('');
		//避免iframe内存泄漏
		iframe[0].contentWindow.document.close();
		//删除iframe
		iframe.remove();
		//ie浏览器下回收内存
		if($.browser.msie){
			CollectGarbage();
		}
	},
	
	/**
     * 表单验证
     * @param validForm  需要验证的表单对象
     * @returns 验证结果
     */
     validateForm:function(validForm){
    	 var $form = this.getObject(validForm);
         var inputValidate = $form.form('validate');
         return inputValidate;
     },
     
	/**
	 * 获得jQuery对象
	 * @param obj 参数可#+id,[name=name]等所有jquery支持对象
	 * @returns 返回jquery对象
	 */
	getObject:function(obj){
		return $.isPlainObject(obj) ? obj : $(obj);
	},
	
	/**
	 * 拼接地址,如果原地址中包含?,则拼接&符号，否则拼接?
	 * @param addr 需要拼接的地址
	 * @param param 需要拼接的参数
	 * @returns 返回拼接后的地址
	 */
	appendAddr:function(addr,param){
		if(power.isEmpty(addr)){
			this.alert("提示信息","拼接地址为空或未定义！","warning");
			return;
		}
		if(power.isEmpty(param))return addr;
		return addr.indexOf("?") != -1 ? addr + "&" + param + "&" + power.getTime(): addr + "?" + param + "&" + power.getTime();
	},
	
	/**
	 * 更改Iframe访问地址,通过basicUrl属性的值与params参数拼接出新的地址
	 * @param iframe iframe对象
	 * @param parame 初始化的参数
	 */
	changeIframeSrc:function(iframe,params){
		iframe = this.getObject(iframe);
		iframe.attr("src",power.appendAddr(iframe.attr("basicUrl"),params));
	},
	
	/**
	 * 提示信息
	 * @param target 提示信息所在元素块的id号或对象，格式：#+元素id号或jquery对象
	 * @param params 消息显示参数{level:'exception', msg: '操作异常', time:5}
	 * 				level 消息等级默认为success, 可选值 info, success, fail, exception
	 * 				msg 消息内容，默认为“操作成功!”
	 * 				time 消息显示时间，默认为 3 秒
	 * 				
	 * @param time 消息显示的时间, 当time为"show"时，则不自动隐藏消息提示，需要手动点击关闭按钮。
	 * @param style 自定义显示样式
	 */
	msgTip:function(target, params, style){
		target = this.getObject(target);
		var time = 3, msgLevel = "success", msg = "操作成功!", 
			color = "#209313", tipCls = "tip-success", bgCls = "tip-success-msg";
		if(power.isNotEmpty(params)){
			time = params.time || time;
			msgLevel = params.level || msgLevel;
			msg = params.msg || msg;
		}
		
		if(time != 'show') time = time * 1000;
		var tempMsgId = power.UUID();
		var tempMsgTip;
		if("info" == msgLevel){
			tipCls = 'icon-tip';
			bgCls = "tip-info-msg";
			createMsgTip(msg);
			if("show" == time) return;
			setTimeout(function(){
				power.hiddenMsg("#" + tempMsgId);
			},time);
		}else if("success" == msgLevel){
			createMsgTip(msg);
			if("show" == time) return;
			setTimeout(function(){
				power.hiddenMsg("#" + tempMsgId);
			},time);
		}else if("fail" == msgLevel){
			color = "#FD8584";
			tipCls = 'tip-fail';
			bgCls = "tip-fail-msg";
			createMsgTip(msg);
		}else if("exception" == msgLevel){
			var dialogId  = this.getTime();
			msg = msg.replaceAll("&#39;", "'").replaceAll("%22", "\"").replaceAll("ENTER", "\r\n");
			$("<div id='" + dialogId + "' style='display:none'>" + msg + "</div>").appendTo('body');
			color = "#FD8584";
			tipCls = 'tip-fail';
			bgCls = "tip-fail-msg";
			createMsgTip('操作出现异常。<a href="javascript:void(0)" onclick=power.showExceptionMsg("' + dialogId + '","' + tempMsgId + '")>点击查看详情</a>');
		}
		
		function createMsgTip(msg){
			tempMsgTip = '<div id="' + tempMsgId + '" class="tip-msg ' + bgCls + '">';
			tempMsgTip += '<div style="text-align:center;"><span class="' + tipCls + ' icon-tip-msg">&nbsp;</span>';
			tempMsgTip += '<font color="' + color + '">' + msg + '</font>';
			tempMsgTip += '<span><img class="tip-msg-img" onclick=power.hiddenMsg("#' + tempMsgId + '"); ';
			tempMsgTip += 'src="'+ ctx + '/scripts/plugin/jquery-easyui/themes/'+ skin +'/icons/ext/close.png"/></span>';
			tempMsgTip += '</div></div>';
			target.append($(tempMsgTip));
			var targetWidth = target.width();
			var msgWidth = targetWidth > 200 ? 200 : targetWidth;
			$("#" + tempMsgId).css("left",(targetWidth - msgWidth)/2 + "px").fadeIn("slow").width(msgWidth);
			if(style){
				$("#" + tempMsgId).css(style);
			}
		}
	},
	
	/**
	 * 隐藏消息提示信息
	 * @param tempMsgId 消息标识
	 */
	hiddenMsg:function(tempMsgId){
		var $tempMsg = power.getObject(tempMsgId);
		$tempMsg.fadeOut('slow');
		$tempMsg.remove();
	},
	
	/**
	 * @private
	 * 显示异常信息的dialog
	 * @param msg 异常信息
	 */
	showExceptionMsg:function(dialogId, tempMsgId){
		this.hiddenMsg("#" + tempMsgId);
		try{
			$("#" + dialogId).show().dialog("open");
		}catch(e){
			$("#" + dialogId).show().dialog({
				title:'异常信息'
			});
		}
	},
	
	/**
	 * 把表单的元素序列化并拼接成json对象
	 * @param qForm 表单元素，格式：#+元素id号或jquery对象
	 * @returns 拼接的json对象
	 */
	queryParams:function(qForm){
		var queryObj = {};
		qForm = this.getObject(qForm);
		$(".searchInput", qForm).each(function(){
			if(this.value == this.defaultValue){
				this.value = "";
			}
		});
		var paramArray = qForm.serializeArray(); 
		if(paramArray != ''){
			for (var i = 0; i < paramArray.length; i++) { 
				queryObj[paramArray[i].name] = $.trim(paramArray[i].value);
			}
		}
		$(".searchInput", qForm).each(function(){
			if(this.value == ""){
				$(this).trigger("blur");
			}
		});
		return queryObj;
	},
	
	/**
	 * 加入收藏
	 */
	addFavorites:function(){
		try{
			window.external.AddFavorite(window.location.href,document.title)
		}catch (e){
		    try{
		    	window.sidebar.addPanel(document.title, window.location, "");
		    }catch (e){
		    	this.alert("提示信息", "加入收藏失败，请使用Ctrl+D进行添加", "info");
		    }
		}
	},
	
	/**
	 * ajax相关操作(暂负责所有ajax请求的操作)
	 * 
	 * var returnValue = power.ajaxRequest("url", {method:"test",adminId:"test01"});
	 * 
	 * @param requestURL ajax请求路径
	 * @param requestEntity 参数 如：{method:"test",adminId:"test01"}
	 * @param fn 回调方法
	 */
	ajaxRequest:function(requestURL,requestEntity,fn){
		//返回的对象
		var backEntity = null;
		if(requestURL == null || requestURL == ''){
			this.alert("错误", "无法使用空的请求路径进行请求,请重新设置", "error");
		}
		//主要的请求数据
		requestEntity 		= (requestEntity == undefined || requestEntity == null) ? {} : requestEntity;
		var requestType 	= (requestEntity.ajax_type == undefined || requestEntity.ajax_type == null) ? "POST": requestEntity.ajax_type;
		var requestAsync 	= (requestEntity.ajax_async == undefined || requestEntity.ajax_async == null) ? false: requestEntity.ajax_async;
		var requestDataType = (requestEntity.ajax_dataType == undefined || requestEntity.ajax_dataType == null) ? "json": requestEntity.ajax_dataType;
		var requesttimeout  = (requestEntity.ajax_timeout == undefined || requestEntity.ajax_timeout == null) ? null : requestEntity.ajax_timeout;
		try{
			var	 define = {   
				        url      : requestURL,  
				        type     : requestType,
				        async    : requestAsync,
				        data     : requestEntity,
				        dataType : requestDataType,
				        success	 : function(data){ 
			        			 	backEntity = data;
			        			 	if($.isFunction(fn)){
										fn(data);
									}
				        		},      
				        error: function(formResult){
		        			if(formResult.responseText){
		        				formResult = formResult.responseText.split("#####POWERDATA#####");
		    					var formResultObj = new FormResult(formResult[0].slice(1,formResult[0].length));
		    					try{
		    						if("exception" == formResultObj.operateResult){
		    							power.msgTip("body", {msg:formResultObj.exStack, level:"exception"});
		    						}
		    						$.messager.progress("close");
		    					}catch(e){
		    						$.messager.progress("close");
		    						throw new Error("进行AJAX请求[" + requestURL + "]出错[" + formResult + "]!");
		    					}
							}else{
								throw new Error("进行AJAX请求[" + requestURL + "]出错[" + formResult + "]!");
							}
						}
				    }
			if(requesttimeout !=null && parseInt(requesttimeout) != NaN){
			   define.timeout = requesttimeout; 
			}
			//进行ajax调用
			$.ajax(define);     
			return backEntity;
		 }catch(e){
			power.alert("错误", e.message, "error");
		 	throw new Error(e.message);  
		 }
	},
	
	/**
	  * @private
	 */
	forms:"#autoform", values:{},
	/**
	  * 将页面的初始值保存到JSON中缓存，监控页面数据时使用
	  * @param forms 需要监控的form对象，默认为id为“autoform”的的表单，如果有多个表单对象需要验证
	  * 	多个参数间需要用“,”分割，如："#autoform_1,form[name=autoform_2]"
	  * 	参数为jQuery支持的对象
	 */
	monitorDataChange:function(forms) {
		var names = new Array();
		if(Boolean(forms)) power.forms = forms;
		var $form = power.getObject(power.forms);
		if($form.length > 1){
			$form.each(function(index, value){
				getInitValue(value);
			});
		}else{
			getInitValue(this.forms);
		}
		
		/**
		 * 将元素值放入JSON中，此方法不对外使用
		 * @param form 需要入值的form对象
		 */
		function getInitValue(form){
			var json = power.formatElement(form);
			power.values[form] = json;
		}
	},

	/**
	 * 获取页面数据是否已经改变
	 */
	isChange:function() {
		var change = false;
		var $form = power.getObject(power.forms);
		if($form.length > 1){
			$form.each(function(index, value){
				if(isChangeValue(value)){change = true; return;}
			});
		}else{
			if(isChangeValue(power.forms)){return true;}
		}
		return change;
		
		/**
		 * 比较值是否改变，此方法不对外使用
		 * @param form form对象
		 */
		function isChangeValue(form){
			var json = power.formatElement(form);
			var values = power.values[form];
			var change = false;
			$.each(values, function(key, value){
				if(json[key] != value){
					change = true;
					return;
				}
			});
			return change;
		}
	},
	isTrue: function(b) {
		if(!b || b === 'false') {
			return false;
		}
		return true;
	},
	/**
	  * 将页面的初始值保存到JSON中缓存，监控页面数据时使用
	  * @param id    需要监控的jQuery对象，必须包含在form对象中
	  * @param forms 需要监控的form对象，默认为id为“autoform”的的表单，参数为jQuery支持的对象
	 */
	monitorDataChangeById:function(id, form) {
		var _form = Boolean(form) ? form : power.forms;
		var json = power.formatElementById(_form, id);
		power.values[id] = json;
	},

	/**
	 * 获取页面数据是否已经改变
	 * @param id    需要监控的jQuery对象，必须包含在form对象中
 	 * @param forms 需要监控的form对象，默认为id为“autoform”的的表单，参数为jQuery支持的对象
	 */
	isChangeById:function(id, form) {
		var _form = Boolean(form) ? form : power.forms;
		var json = power.formatElement(_form);
		var values = power.values[id];
		var change = false;
		if(power.isNotEmpty(values)){
			$.each(values, function(key, value){
				if(json[key] != value){
					change = true;
					return;
				}
			});
		}
		return change;
	},
	
	/**
	 * 清空power.values中指定的form
	 * @param form  需要监控的jQuery对象，必须包含在form对象中
	 */
	clearFormValue:function(form){
		var _form = Boolean(form) ? form : power.forms;
		delete power.values[_form];
	},
	
	/**
	 * 生成一个帮助页面
	 * @param url 帮助页面路径
	 */
	newHelp:function(url){
		var div = '<div class="help_div" style="right: 0px;">';		
			div += '<strong>帮助信息</strong>';
			div += '<div style="height:97%;">';
			div += '<iframe id="help_div_iframe" src="' + ctx + "/" + url + '" width="100%" height="98%" frameborder="0"></iframe>';
			div += '</div></div>';
			div += '<div class="help_button" title="帮助" onclick="power.showHelpDiv()">';
			div += '<img src="' + ctx + '/scripts/plugin/jquery-easyui/themes/' + skin + '/images/ext/help.png" alt="帮助"style="width: 31px; height: 31px;"></div>';
			$(div).appendTo('body');
	},
	
	/**
	 * @private
	 * 显示或隐藏帮助页面
	 */
	showHelpDiv:function(){
		var $helpDiv = $(".help_div");
		var width = $helpDiv.width();
		if($helpDiv.css("right") == -width + "px" || $helpDiv.css("display") == "none"){
			$helpDiv.animate({ right: 0, opacity: 'show'}, 1000);
		}else {
			$helpDiv.animate({ right: -width, opacity: 'show'}, 1000);
		}
	},
	
	/**
	 * 改变帮助页面内容路径
	 * @param url 修改后的路径
	 */
	changeHelpUrl:function(url){
		var win = window.parent, $body = $(win.document.body);
		var i = 0;
		while($body.find("#help_div_iframe").length == 0){
			win = win.parent;
			$body = $(win.document.body);
			i++; if(i == 100) break;
		}
		if(i == 100){
			power.alert("提示信息", "请确认是否有父页面创建帮助页面？创建方法newHelp()。", "info");
		}
		$body.find("#help_div_iframe").attr("src", ctx + "/" + url);
	},
	
	/**
	 * 根据输入框的值查询并改变select的值，可根据首字母，拼音，汉字查询select中的值
	 * @param select 下拉框对象，可支持ID等多种方式，jquery能取到些对象即可,如：#select
	 * @param content 输入框对象，可支持ID等多种方式，jquery能取到些对象即可, 如: #content
	 */
	searchSelect:function(select, content){
		var $select = power.getObject(select);
		var $content = power.getObject(content);
		var $options = $select.find("option"), $value, $text, datas = "[";
		$options.each(function(index,data){
			$value = $(data).val(); $text = $(data).text();
			datas += '{"value":"' + $value + '","text":"' + $text + '","textPy":"' + $text.toPinYin() + '","textSzm":"' + $text.toShouZiMu() + '"},';
		});
		if($options.length > 0){
			datas = datas.substring(0, datas.length - 1);
		}
		datas += "]";
		datas = eval("(" + datas + ")");
		$content.live("keyup", function() {
			var $inputVal = $.trim($(this).val()).toLowerCase();
			var options = "";
			$(datas).each(function(index,data){
				if(data["textPy"].startWith($inputVal) || data["textSzm"].startWith($inputVal) || data["text"].startWith($inputVal)){
					options += '<option value="' + data["value"] + '">' + data["text"] + '</option>';
				}
				if(power.isEmpty($inputVal)){
					options += '<option value="' + data["value"] + '">' + data["text"] + '</option>';
				}
			});
			$select.html("");$select.html(options);
		});
	},
	
	/**
	 * 对Date的扩展，将 Date 转化为指定格式的String   
	 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)  
	 *  例子：    
	 *  (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
	 *  (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
	 *  @param fmt 格式
	 */
	dateFormat:function(date, fmt)   
	{ 
		var o = {   
				"M+" : date.getMonth() + 1,                 //月份   
				"d+" : date.getDate(),                    //日   
				"h+" : date.getHours(),                   //小时   
				"m+" : date.getMinutes(),                 //分   
				"s+" : date.getSeconds(),                 //秒   
				"q+" : Math.floor((date.getMonth() + 3)/3), //季度   
				"S"  : date.getMilliseconds()             //毫秒   
		};   
		if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));   
		for(var k in o) if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));   
		return fmt;   
	},
	/**
	 * 拼接地址栏参数，主要用于记录菜单访问
	 */
	getReqUrlParams:function(){
		var params = [];
		//用户代理头的字符串
		params.push("agent=" + window.navigator.userAgent);
		//页面标题
		params.push("title=" + encodeURIComponent(document.title) || '');
		//域名
		params.push("domain=" + document.domain || '');
		//当前请求地址参数
		params.push(window.location.search.substr(1).replace('#','') || '');
		//当前请求地址
		params.push("url=" +  document.URL.replace('#','') || '');
		return params;
	},
	/**
	 * 通过模式框弹出展示表字段发生变化信息
	 * 
	 * @param 	type 		类型，如：人员基本信息
	 * @param 	keys 		主键值，格式：主键名=主键值，如：YHID=123
	 */
	showRecords:function(type,keys){
		window.showModalDialog(encodeURI(ctx + '/pages/platform/record/recordList.jsp?type=' + type + "&xh=" + keys));
	},
	
	/**
	 * 从缓存中取出公共代码值，并添加值到下拉框中 
	 * @param codeId 代码集编号
	 * @param sel 下拉框id或name
	 * @param value 默认值
	 * @param fdm 父代码  
	 */
	updateSelectByCodeId:function(codeId, sel, value, fdm){
		var obj = $("#" + sel);
		if(obj.length == 0){
			obj = $("select[name=" + sel + "]");
		}
		if(obj.length == 0) {
			power.alert("提示信息", "请选择有效的select对象", "info");
			return;
		}
		var defaultValue = value || obj.val();
		// modify by 黄冠豪 2015-05-22 修复当result为空时，不会清空combo的Bug。
		var result = this.getCode(codeId, fdm);
		try{
			var opts = obj.combobox("options");
			var value = opts.valueField;
			var text = opts.textField;
			defaultValue = defaultValue || (obj.combobox("getValue"));
			var data = new Array();
			data.push({value: '',text: '---请选择---'});
			$(result).each(function(){
				data.push({value: this.DM,text: this.DMNR});
			});
			obj.combobox("loadData",data);
			obj.combobox('setValue',defaultValue);
		}catch(e){
			var options = "<option>---请选择---</option>";
			$(result).each(function(){
				options +="<option value='" + this.DM + "'>" + this.DMNR + "</options>";
			});
			obj.html(options);
			obj.val(defaultValue);
		}
	},
	
	/**
	 * 从缓存中取出公共代码值
	 * @param codeId 代码集编号
	 * @param fdm 父代码  
	 */
	getCode: function(codeId, fdm){
		var result = power.ajaxRequest(getCommonCodeByCacheUrl,{codeId: codeId,fdm: fdm});
		return result;
	},
	getAjaxUrl: function(clazzName,methodName,parameters) {
		var result = power.ajaxRequest(getAjaxUrl,{ajax_dataType:'text',clazzName: clazzName,method: methodName,parameters:parameters});
		return result;
	},
	/**
	 * 按enter键调用查询功能
	 */
	enterSearch : function(evt,fn){
		evt = (evt) ? evt : window.event;
		if(evt.srcElement.tagName == "INPUT"){
			if(evt.keyCode == 13){
				if($.isFunction(fn)) fn();
		    }
		}
		return false;
	},
	
	/**
	 * 用户输入值进行提示
	 * 
	 *  @param obj 需要添加提示条件的对象
	 *  @param param {position:['top'|'left'|'right'|'bottom'],width:宽度,height:高度,top:距上距离，left:距左距离，bodyStyle:面板样式}
	 */
	tooltip: function(obj, param){
		obj = this.getObject(obj);
		if(obj.length > 0){
			var param = param || {};
			obj.bind("keydown focus keyup",function(e){
				e.stopPropagation();
				var el = this;
				var h1 =  $(el)._outerHeight();
				var position = "bottom" || param.position;
				var top = $(el).offset().top;
				var left = $(el).offset().left;
				var width = $(el).width() || param.width;
				var height = 30 || param.height;
				//var bodyStyle = $.extend({color:'#fff',fontWeight:'bold',fontFamily:'微软雅黑',fontSize:20,padding:'5px',textAlign:'center',border: "solid 1px #CCCCCC",background: "#00AFE8"},param.bodyStyle || {});
				var bodyStyle = $.extend({color:'#FB6902',fontWeight:'bold',fontFamily:'微软雅黑',fontSize:22,padding:'0',textAlign:'center',border: "solid 1px #dfdfdf",background: "#fff"},param.bodyStyle || {});
				switch(position){
					case "right":
						left += $(el)._outerWidth() + 1;
						break;
					case "left":
						left -= $(el)._outerWidth();
						break;
					case "top":
						top -= $(el)._outerHeight() + 5;
						break;
					case "bottom":
						top += $(el)._outerHeight();
						break;
				}
				//自定义显示位置
				left = param.left || left;
				top = param.top || top;
				var defaultStyle = {top:top,left:left,position:'absolute',zIndex:9999999,'min-height':height,'width':'500px'};
				var tipDiv = $(".msg-toolTip");
				if(tipDiv.length < 1){
					tipDiv = $('<div class= "msg-toolTip" style="box-shadow: 0px 2px 3px #dfdfdf;-moz-border-radius:10px; -webkit-border-radius:10px;border-radius:10px;word-break: break-all;"></div>').appendTo($(window.parent.parent.parent.document).find("body").first());
				}
				tipDiv.text($(el).val());
				var css = $.extend({},bodyStyle,defaultStyle);
				tipDiv.css(css);
				if(param.left == undefined){
					if(position == "top" || position == "bottom"){
						if(tipDiv.width() > width){
							var tempWidth = (tipDiv.width() - width)/2;
							var _left = tipDiv.offset().left - tempWidth;
							tipDiv.css({left:_left > 0 ? _left : 0});
						}
					}
				}
				tipDiv.show();
			}).bind("blur",function(e){
				$(window.parent.parent.parent.document).find("body").first().find(".msg-toolTip").hide().remove;
			});
		}
	},
	
	/**
	 * 根据控件对象给控件设置值，可支持easyUI控件
	 * 
	 * 使用方法：
	 * 	一：
	 * 	power.setValue("#test1", "test1");
		power.setValue("input[name=sex]", "man");
	 * 	二：
	 *  power.setValue({"#test1":"test1","input[name=sex]":"man"});
	 */
	setValue:function(params,value){
		if(power.isNotEmpty(value)){
			judgeSetValue(params, value);
		}else{
			params = power.getObject(params);
			$.each(params, function(key, value){
				judgeSetValue(key, value);
			});
		}
		
		/**
		* 判断并且设值
		*/
		function judgeSetValue(key, value){
			var $key = power.getObject(key);
			if($key.is("input[type='radio']")){
				$key.filter("[value='"+value+"']").attr("checked",true);  
			}else if($key.is("input[type='checkbox']")){
				if(value.indexOf(",") != -1){
					var param = value.split(",");
					$(param).each(function(){
						$key.filter("[value='" + this + "']").attr("checked",true);
					});
				}else{
					$key.filter("[value='"+value+"']").attr("checked",true);
				}
			}else if($key.hasClass("easyui-combobox")){
				$key.combobox('setValue', value);
			}else if($key.hasClass("easyui-searchbox")){
				$key.searchbox('setValue', value);
			}else if($key.hasClass("easyui-datebox")){
				$key.datebox('setValue', value);
			}else{
				$key.val(value);
			}
		}
	},
	/**
	 * 增加搜索框的默认提示条件
	 * 
	 * @param obj 需要添加提示条件的对象
	 */
	initSearchInput:function(obj){
		obj = obj || ".searchInput";
		obj = power.getObject(obj);
		obj.each(function(){
			this.style.color = "#999999";
			$(this).focus(function(data){
				if(this.value == this.defaultValue){
					this.value = "";
					this.style.color = "#000000";
				}
					
			})
			$(this).bind("blur", function(){
				if(!this.value){
					this.value = this.defaultValue;
					this.style.color = "#999999";
				}
			});
		});
	},
	
	/**
	 * 单独启动某个控件的验证
	 * 
	 * @param obj 需要启动验证的对象 如："#test" 或 "#test,.test"
	 * @param focusObj 验证失败后需要得焦的对象，如："#test"
	 */
	enableValid:function(obj, focusObj){
		var flag = true, tempFlag = true;
		if(power.isNotEmpty(obj)){
			obj = power.getObject(obj);
			if(obj.length > 1){
				obj.each(function(){
					flag = isValid(this);
					if(!flag){
						tempFlag = false;
					}
				});
			}else{
				flag = isValid(obj);
			}
		}
		if(!flag){
			if(power.isNotEmpty(focusObj)){
				$(focusObj).focus();
			}
		}
		return flag && tempFlag;
		
		function isValid(obj){
			var flag = true;
			obj = power.getObject(obj);
			try{
				if(obj.hasClass("easyui-datebox")){
					obj.datebox("enableValidation");
					if(!obj.datebox("isValid")){
						flag = false;
					}
				}else if(obj.hasClass("easyui-datetimebox")){
					obj.datetimebox("enableValidation");
					if(!obj.datetimebox("isValid")){
						flag = false;
					}
				}else if(obj.hasClass("combo-f")){
					obj.combo("enableValidation");
					if(!obj.combo("isValid")){
						flag = false;
					}
				}else{
					obj.validatebox("enableValidation");
					if(!obj.validatebox("isValid")){
						flag = false;
					}
				};
			}catch(e){
				if(e.message == "Cannot read property 'nodeName' of undefined"){
					power.alert("提示信息", "没找到控件 \""+ obj.selector + "\"", "warning");
				} 
			}
			return flag;
		}
	},
	/**
	 * 设置视图模式
	 * 如果按钮需要添加“isDisplay”样式
	 * 
	 * @param isView 是否启用视图模式，参数为V时启用视图模式
	 * @param forms 需要设置视图模式的form对象, 如：#form1,#form2  默认为：#autoform
	 * @param params 其它参数，此参数使用JSON形式
	 * 				isShowMust 是否显示必填，默认false，不显示必填
	 */
	setView:function(isView, forms, params){
		if("V" != isView) return;
		params = params || {};
		$(".isDisplay").hide();
		var names = new Array();
		var preName = "";
		if(power.isEmpty(forms)){
			view($("#autoform"), params);
		}else{
			forms = power.getObject(forms);
			if(forms.length > 1){
				forms.each(function(){
					view(this, params);
				});
			}else{
				view(forms, params);
			}
		}
		
		/**
		 * 将元素值放入JSON中，此方法不对外使用
		 * @param form 需要入值的form对象
		 */
		function view(form, params){
			var tempForm = power.getObject(form);
			var isShowMust = params.isShowMust || false;
			tempForm.find('.datagrid-table td').addClass('removesetNowrap');
			//隐藏form中所有的按钮
			tempForm.find(".easyui-linkbutton").hide();
			/**
			 * 遍历form下可见input控件
			 */
			tempForm.find("input:visible").each(function(){
				var $this = $(this)
					,$thisVal = $this.val()
					,type = $this.attr("type") ? $this.attr("type") : "text"
					,name = $this.attr("name")
					,label = $this.parents("td").prev("td")
					,labelText = label.text();
				if(!isShowMust){
					if (labelText != null && "*" === labelText.charAt(0)) {
						label.text(labelText.substring(1));
					}
				}
				
				//用于处理easyui手动渲染的combo
				if($this.hasClass("combo-text")){
					var span = $this.closest("span");
					if(span.length > 0 && span.hasClass("combo")){
						span.prevAll("input").remove();
						var value = span.find(".combo-value").val();
						var text = value ? ($this.val() ? $this.val() : value) : "";
						$("<font>" + text + "&nbsp;</font>").insertBefore(span);
						span.remove();
						return;
					}
				}
				if("radio" == type){
					if(preName != name){
						preName = name;
						var $radio = $("input:radio[name=" + name + "]")
							,$radioChecked = $("input:radio[name=" + name + "]:checked")
							,next = $radioChecked.next('span');
						if(next.length > 0){
							$("<font>" + next.html() + "&nbsp;</font>").insertBefore($this);
							$radio.siblings('span').remove();
							$radio.remove();
						}
					}
				}else if("checkbox" == type){
					if(preName != name){
						preName = name;
						var $checkbox = $("input:checkbox[name=" + name + "]")
							,$checkboxChecked = $("input:checkbox[name=" + name + "]:checked");
						$checkboxChecked.each(function(){
							var next = $(this).next('span');
							if(next.length > 0){
								$("<font>" + next.html() + "</font><br/>").insertBefore($this);
							}
						});
						$checkbox.each(function(){
							var _input = $(this).next('span').next('input');
							if(_input.length < 1) $(this).next('span').next().remove();
							$(this).next('span').remove();
							$(this).remove();
						});
					}
				}else if("text" == type || "password" == type || "file" == type){
					$("<font>" + $thisVal + "&nbsp;</font>").insertBefore($this);
					$this.remove();
				}
			});
			
			
			/**
			 * 遍历form下可见的select控件
			 */
			tempForm.find("select:visible").each(function(){
				var label = $(this).parents("td").prev("td")
				var labelText = label.text();
				if (labelText != null && "*" === labelText.charAt(0)) {
					label.text(labelText.substring(1));
				}
				var val = $(this).val();
				if(val){
					var con = $(this).find("option[value='" + val+ "']");
					$("<font>" + con.text() + "&nbsp;</font>").insertBefore($(this));
				}
				$(this).remove();
			});
			
			/**
			 * 遍历form下可见的textarea控件
			 */
			tempForm.find("textarea:visible").each(function(){
				var val = $(this).val() || "";
				val = val.replaceAll("\n","<br>");
				$("<span>" + val + "&nbsp;</span>").insertBefore($(this));
				$(this).remove();
			});
		}
	},
	
	/**
	 * 字段中加"*"号的添加验证。
	 * @param forms 需要验证的form，默认为页面中最后一个form。多个form可通过","分隔。如:"#form1,#form2"
	 */
	isValidate:function(forms){
		var names = new Array();
		if(power.isEmpty(forms)){
			check($('form').last());
		}else{
			forms = power.getObject(forms);
			if(forms.length > 1){
				forms.each(function(){
					check(this);
				});
			}else{
				check(forms);
			}
		}
		
		/**
		 * 将元素值放入JSON中，此方法不对外使用
		 * @param form 需要入值的form对象
		 */
		function check(form){
			var tempForm = power.getObject(form), validCls = "easyui-validatebox";
			
			/**
			 * 遍历form下可见input控件
			 */
			tempForm.find("input:visible").each(function(){
				var $this = $(this);
				var type = $this.attr("type") ? $this.attr("type") : "text";
				var name = $this.attr("name");
				var label = returnLabel($this);
				if("radio" == type){
					if (label != null && "*" === label.charAt(0)) {
						if(!isExistName(name)){
							$("input:radio[name=" + name + "]").each(function(){
								addValidCls($(this),"radio");
							});
						}
					}
				}else if("checkbox" == type){
					if (label != null && "*" === label.charAt(0)) {
						if(!isExistName(name)){
							$("input:checkbox[name=" + name + "]").each(function(){
								addValidCls($(this),"checkbox");
							});
						}
					}
				}else if("text" == type || "password" == type || "file" == type){
					addValidCls($this);
				}
			});
			
			
			/**
			 * 遍历form下可见的select控件
			 */
			tempForm.find("select:visible").each(function(){
				addValidCls($(this));
			});
			
			/**
			 * 遍历form下可见的textarea控件
			 */
			tempForm.find("textarea:visible").each(function(){
				addValidCls($(this));
			});
			
			/**
			 * 添加验证样式与必填属性
			 */
			function addValidCls(obj,type){
				var label = returnLabel(obj);
				if (label != null && "*" === label.charAt(0)) {
					var thisClass = obj.attr("class");
					if(thisClass == undefined || thisClass.indexOf("easyui-") < 0){
						obj.addClass(validCls);
					}
					if(obj.attr("data-options")){
						var opts = obj.attr("data-options");
						if("checkbox" == type || "radio" == type){
							obj.attr("data-options","validType:'checked'," + opts);
						}else{
							obj.attr("data-options","required:true," + opts);
						}
					}else{
						if("checkbox" == type || "radio" == type){
							obj.attr("validType", "checked");
						}else{
							obj.attr("required", true);
						}
					}
				}
			}
			
			/**
			 * 返回文本控label中的text
			 */
			function returnLabel(obj){
				return power.getObject(obj).parents("td").prev("td").text();
			}
		}
			
			
		/**
		 * @private
		 * 判断JSON数据中是否存在name，此方法不对外使用。
		 * @name 需要验证的name属性
		 * @return true 存在  false 不存在
		 */
		function isExistName(name){
			if(names.length == 0){
				names.push(name);
				return false;
			}
			$(names).each(function(index,data){
				if(name != data){
					names.push(name);
					return false;
				}
			});
			return true;
		}
	},
	
	/**
	 * 将数据记录到cookie中，保存后
	 */
	cookieData:function(forms){
		
	},
	
	/**
	 * 在表格中使用上下左键进行编辑 
	 * 
	 */
	tableToKey:function(table){
		var $table = power.getObject(table);
		$table.find("td").unbind("click").bind("click", function(){bindEvent(this);});
		
		/** 记录上次经经过的TD */
		var $lastSelecTd = "";
		
		/**
		 * 给绑定td的对象中添加input控件
		 * 
		 * @param obj TD对象
		 */
		function bindEvent(td){
			var $input = $("<input style='width:100%;'>"), $td = power.getObject(td);
			$input.val($td.text());
			$td.empty().append($input);
			$input.bind({
				blur:function(){
					$td.unbind("click").bind("click", function(){bindEvent(this);});
					$td.html($(this).val());
					$lastSelecTd = "";
				},
				keydown:function(e){bindKeyEvent(e, $td);}
			});
			$td.unbind("click");
			$input.focus();
			if(power.isNotEmpty($lastSelecTd)) {
				$lastSelecTd.html($lastSelecTd.find("input:visible").val());
				$lastSelecTd.unbind("click").bind("click", function(){bindEvent(this);});
			}
			$lastSelecTd = $td;
		}
		
		/**
		 * 绑定上、下、左、右键事件
		 * 
		 * @param e 事件
		 * @param obj TD对象
		 */
		function bindKeyEvent(e, td){
			var keyCode = e.keyCode, tdVisible = "td:visible", trVisible = "tr:visible";
			var $td = power.getObject(td), $tdPrev = $td.prev(tdVisible), $tdNext = $td.next(tdVisible), $tdIndex = $td.index();
			var $tr = $td.parents(trVisible), $trPrev = $tr.prev(trVisible), $trNext = $tr.next(trVisible);
			var $trPrev_td = $trPrev.find(tdVisible), $trNext_td = $trNext.find(tdVisible);
			
			//左 37， 上 38， 右 39， 下40
			if(keyCode == 37){
				if($tdPrev.length == 0){
					if($trPrev.length == 0) return;
					bindEvent($trPrev_td.last());
					return;
				};
				bindEvent($tdPrev);
			}else if(keyCode == 38){
				if($trPrev.length == 0) return;
				var $trPrev_tdIndex = $trPrev_td.eq($tdIndex);
				if($trPrev_tdIndex.length == 0){
					bindEvent($trPrev_td.last());
				}else{
					bindEvent($trPrev_tdIndex);
				}
			}else if(keyCode == 39){
				if($tdNext.length == 0){
					if($trNext.length == 0) return;
					bindEvent($trNext_td.first());
					return;
				};
				bindEvent($tdNext);
			}else if(keyCode == 40){
				if($trNext.length == 0) return;
				var $trNext_tdIndex = $trNext_td.eq($tdIndex);
				if($trNext_tdIndex.length == 0){
					bindEvent($trNext_td.last());
				}else{
					bindEvent($trNext_tdIndex);
				}
			}
		}
	},
	
	/***
	 * 显示格式化后的HTMLtooltip
	 * @param el 需要显示tooltip的控件
	 * @param direction 显示的方向
	 */
	tooltipSubp: function(el, direction){
		var obj = power.getObject(el);
		direction = direction || 'top';
		obj.each(function(){
			 $(this).tooltip({
			       position: direction,
			       onShow: function(){
			    	   var value =  power.convertSubpToHtml(this.value);
			    	   $(this).tooltip("update",value);
			       }
		      });
		});
	},
	
	/***
	 * 把字符串中的@符号后的字符变成下标，把^符号后的字符变成上标
	 */
	convertSubpToHtml: function (str){
		if(!str)	return '';
		while(str.indexOf('@') != -1){
			var index = str.indexOf('@');
			var num = str.charAt(index + 1);
			str = str.replace('@' + num, '<sub>' + num + '</sub>');
		}
		while(str.indexOf('^') != -1){
			var index = str.indexOf('^');
			var subIndex = str.indexOf("</sub>");
			var ch = str.charAt(index + 1);
			if(subIndex > -1 && index - subIndex == 6){
				str = str.replace('^' + ch, '<sup style=\"position:relative;left:-7px;top:-2px\">' + ch + '</sup>');
			}else{
				str = str.replace('^' + ch, '<sup>' + ch + '</sup>');
			}
		}
		return str;
	},
	
	/**
	 * 设置半自动表单多选框的功能
	 * 
	 * @param pageName 页面需要赋值的NAME
	 * @param data     需要赋值的值
	 * @param split    值的分割符，默认','
	 * 
	 */
	setCheckVal: function(pageName, data, split){
		if(power.isEmpty(pageName) || power.isEmpty(data)) return;
		split = split || ',';
		data = data.split(split);
		$("input[name="+ pageName +"]").each(function(){
			var $this = $(this);
			for(var i = 0;i < data.length;i++){
				if($this.val()  == data[i]){
					$this.attr("checked","checked");
				}
			}
		});
	},
	
	/**
	 * 拼接半自动表单多选框值的功能
	 * 
	 * @param databaseName 	数据库对应的NAME
	 * @param obj     		需要拼接的对象
	 * @param split    		值的分割符，默认','
	 * 
	 */
	joinCheckedVal: function(databaseName, obj, split){
		if(power.isEmpty(databaseName) || power.isEmpty(obj)) return;
		split = split || ',';
		obj = power.getObject(obj);
		var result = '';
		$("input[name='"+ obj.attr("name") +"']").each(function(){
			if($(this).is(":checked")){
				result += this.value + split;
			}
		});
		$("input[name="+ databaseName +"]").val(result);
	},
	
	/**
	 * 阻止事件冒泡
	 * 
	 * @param eve 事件对象
	 */
	stopEvent:function(eve) {
    	var ev = window.event ||eve;
        if (ev && ev.stopPropagation) {
            //W3C取消冒泡事件
            ev.stopPropagation();
        } else {
            //IE取消冒泡事件
        	ev.cancelBubble = true;
        }
    },
    
	/**
	 * 调用人员树的方法
	 * 
	 * @param 	fn 回调方法
	 * @param 	maxNum 当前返回页面的最大个数，Integer类型, 默认： 1
	 * @param 	params 参数格式为JSON，如{"sort":true}
	 *  			sort 打开选择页面时按字母显示，Boolean类型，true 按字母A-Z显示，false按部门显示，默认：false
	 *  			userId 需要初始选中的人员编号，String类型，多个用","分隔，如:"00001,00002"
	 *  			userName 需要初始选中的人员名称，String类型，多个用","分隔，对应userId，如:"张三,李四"
	 *    			showAll 控制定位到当前部门的逻辑，Boolean类型，true不定位，false定位到本部门 ，默认：false 
	 *    			dept 部门编号，定位到指定部门，如："00001"
	 *    			filterParams 需要过滤的部门编号，多个以","隔开, 如："00001,00002"
	 *    			filterRule 过滤规则，"1" : 过滤filterParams指定的部门， "2" : 只显示filterParams指定的部门, 默认：1
	 * @return 	['人员名称','人员ID','所在部门ID','所在部门名称']  如：['张三,李四','zhangsan,lisi','00001,00002','部门一,部门二']
	 * 
	 * @since 	V0.1.0
	 */
	userTree: function(fn, maxNum, params){
		
		params = params || {};
		var maxNum = $.isNumeric(maxNum) ? maxNum : 1,
			sort = Boolean(params.sort) ? 'atoz' : 'classify',
			showAll = params.showAll || false,
			filterRule = params.filterRule || 1;
		var url = ctx + "/emdc/ggzj/bms/rys.jsp?1=1";
			url += "&sort=" + sort;
			url += "&showAll=" + showAll;
			url += "&filterRule=" + filterRule;
			url += "&maxNum=" + maxNum; 
		if(params.dept){ url += "&dept=" + params.dept; }
		if(params.filterParams){ url += "&filterParams=" + params.filterParams; }
        /*var sFeatures = "dialogHeight:510px;dialogWidth:835px;";
        window.showModalDialog(url,{fxxmdm:$.trim(params.userId),fxxmmc:$.trim(params.userName),lx:$.trim(params.departmentStr)}, sFeatures, function(arr){
            if($.isFunction(fn)) fn(arr)
        });*/
        url += "&userId=" + $.trim(params.userId);
        url += "&userName=" + $.trim(params.userName);
        url += "&lx=" + $.trim(params.departmentStr);
        var index = Layer.openDialogWithCallBack("人员选择", url, "835px", "580px",function(){
            var data = Layer.getData();
            
            console.log("data:" + data);
            if($.isFunction(fn)){
                fn(data);
            }
        })
        top.window.index = index;
	},
	
	/**
	 * 调用部门树的方法
	 * 
	 * @param 	fn 回调方法
	 * @param 	hasCheckbox true部门多选， false部门单选，Boolean类型，默认：false
	 * @param 	onlyLeafCheck true 有子部门时只在子部门前显示复选框，true显示，false不显示，Boolean类型，默认：false
	 * @param 	cascadeCheck 有子部门时是否级联选择，true级联选择，false不级联选择，Boolean类型，默认：false
	 * @param 	defaultDeptId 默认多个用","分隔，默认选中的部门ID，如："00001,00002"
	 * @param 	url 不对外使用的参数，不可用
	 * @return 	['部门名称','部门ID'] 如：['部门一,部门二','00001,00002']
	 * 
	 * @since 	V0.1.0
	 */
	departmentTree: function(fn, params, url){
		params = params || {};
		var hasCheckbox = params.hasCheckbox || false,
			onlyLeafCheck = params.onlyLeafCheck || false,
			cascadeCheck = params.cascadeCheck || false,
			defaultDeptId = params.defaultDeptId || "";
		url = url || ctx + "/emdc/ggzj/bms/bms.jsp";
		url += "?checkbox=" + hasCheckbox + 
			"&cascadeCheck=" + cascadeCheck + 
			"&onlyLeafCheck=" + onlyLeafCheck;
		var sFeatures = "dialogHeight:505px; dialogWidth:400px;";
		window.showModalDialog(url,{fxxmdm:$.trim(defaultDeptId)}, sFeatures, function(arr){
			if($.isFunction(fn)) fn(arr);
		});
	},
	
	/**
	 * 调用用户组的方法
	 * 
	 * @param 	fn 回调方法
	 * @param 	hasCheckbox true部门多选， false部门单选，Boolean类型，默认：false
	 * @param 	onlyLeafCheck true 有子部门时只在子部门前显示复选框，true显示，false不显示，Boolean类型，默认：false
	 * @param 	cascadeCheck 有子部门时是否级联选择，true级联选择，false不级联选择，Boolean类型，默认：false
	 * @param 	defaultDeptId 默认选中的部门ID，如："00001"
	 * @return 	['部门名称','部门ID'] 如：['部门一,部门二','00001,00002']
	 * 
	 * @since 	V0.1.0
	 */
	userGroupTree: function(fn, params){
		power.departmentTree(function(arr){
			if($.isFunction(fn)) fn(arr);
		}, params, ctx + "/pages/platform/workflow/web/config/userGroupSelect.jsp");
	},
	
	/**
	 * easyui部门树
	 * @param options 继承easyui的combotree属性
	 */
	deptComboxTree: function(obj,options){
		obj = power.getObject(obj);
		obj.each(function(){
			var $this= $(this);
			$this.combotree($.extend({
				url: getDeptByCacheUrl,
				width: 210,
			    lines: true,
			    multiple:true,
			    checkbox:true,
			    animate: true,
			    onLoadSuccess: function(node,data){
			    	var separator = $this.combotree("options").separator;
			    	var arr = ($this.val() || "").split(separator);
		    		for(var i = 0;i < arr.length;i++){
		    			var node = $(this).tree("find",arr[i]);
		    			if(node){
		    				$(this).tree("check",node.target);
		    			}
		    		}
			    },
			    onShowPanel: function(){
			    	var editable = $this.combo("options").editable;
			    	if(editable){
				    	var textbox = $(this).combo("textbox");
				    	$(textbox).change(function(){
				    		var value = $(this).val();
				    		if(!value){
				    			$(this).combo("clear");
				    		}
				    	});
			    	}
			    },
			    onChange:function(newValue,oldValue){
			    	var name  = $(this).attr("comboname");
			    	if(name){
				    	var textbox = $(this).combo("textbox").nextAll("input[name=" + name + "]");
				    	textbox.val(newValue);
			    	}
			    }
			},options));  
		});
	},
	
	/**
	 * 调用公共代码值选择与管理
	 * 
	 * @param 	args 参数，json格式，包括以下值：
	 *  dmjbh:代码集编号;必需
	 *  fdm:父代码
	 *  type： 0，单选；1，多选， 默认多选; 
	 *  showDm： //0 不显示代码列，1显示，默认0
	 *  showBz: //0不显示备注列，1显示，默认显示
	 *  showSel： //0 不显示选择按钮，1显示，默认显示
	 *  canInsert： //0，不出现新增按钮，1显示，默认显示
	 *  canUpdate; //0，不能编辑，1，可以编辑，默认1
	 *  canDelete;  //0，不能删除；1，可以删除，默认1
	 * 
	 * @param sel 刷新刷新的下拉框的对象或ID
	 * @return [{dm:'',nr:''},{dm:'',nr:''}...]
	 * 
	 * @since 	V0.1.0
	 */
	showGgdmz: function(args,sel,fn){
	  var sFeatures = "dialogHeight: 400px;dialogWidth:800px;";
	  var url = ctx + "/emdc/ggzj/dataDictionary/operGgdmz.jsp";
	  window.showModalDialog(url,args, sFeatures, function(arr){
		  if(power.isNotEmpty(sel) && power.isNotEmpty(args)){
			  var selValue = arr ? arr[0].dm : "";
			  power.updateSelectByCodeId(args.dmjbh, sel, selValue, args.fdm); //刷新下拉框
		  }
		  if($.isFunction(fn)) fn(arr);
	  });
	},

	/**
	 * 显示公共代码集
	 */
	showGgdmj: function(fn,args){
	  var sFeatures = "dialogHeight: 400px;dialogWidth:550px;";
	  var url = ctx + "/emdc/ggzj/dataDictionary/ggdmjSel.jsp";
	  window.showModalDialog(url,args, sFeatures, function(arr){
		  if($.isFunction(fn)) fn(arr);
	  });
	},
	
	/**
	 * 选择计量单位
	 * @param singleSelect 是否单选 true单选 false多选
	 * @param jldw 初始化的计量单位
	 */
	showJldw: function(singleSelect,jldw, fn){
		var url = ctx +  '/emdc/ggzj/jldwgl/selectJldw.jsp';
		var sFeatures = "dialogHeight:530px;dialogWidth:" + (singleSelect == true ? 420 : 800) + "px;";
		var args = {};
		args.singleSelect = singleSelect;
		args.jldw = jldw;
		window.showModalDialog(url, args, sFeatures, function(arr){
			if($.isFunction(fn)) fn(arr);
		});
	},
	
	/**
	 * 设置字体字号大小
	 * 
	 * @param objName 字体样式名称
	 */
	setFontSize: function(objName){ 
		var vRelName = '';
		if(power.isEmpty(objName) || objName){
			vRelName = "commonSmall";
		}else{
			vRelName = objName
		}
		var vFrame = $('#index').find('iframe'); 
		if(vFrame.length > 0){ 
			setFontAll(vFrame.contents().find('link[rel=stylesheet]'), vRelName);
		}
		if(vFrame.contents().find('iframe').length > 0){ 
			setFontAll(vFrame.find('iframe').contents().find('link[rel=stylesheet]'), vRelName);
		}
		setFontAll($('link[rel=stylesheet]'), vRelName);
		power.localStorage.setItem("20140801101612db59108a321a4894bac26a7fd9202216", vRelName);
		
		function setFontAll(obj,vRelName){
			obj.each(function(){  
			   	var vName = $(this).attr('href'); 
				vName = vName.substring(vName.lastIndexOf('/')+1,vName.length);
				//modify by 林星宇  20150908  字体切换问题
				if(vName.indexOf("commonSmall.css")>=0  || vName.indexOf("commonMiddle.css")>=0 || vName.indexOf("commonBig.css")>=0 ){
					var ss = $(this).attr('href').substring(0,$(this).attr('href').lastIndexOf('/')+1);
					$(this).attr('href',ss+vRelName+'.css');
				} 
			});
		}
	},
	/**
	 * 设置系统皮肤
	 * @param skin  皮肤类型
	 */
	setSkin: function(skin){
		var url = ctx + "/pages/platform/config/ajax.jsp";
		var data = power.ajaxRequest(url,{method:'chgSkin',skin: skin});
		var flag = power.isEmpty(data) || data.result == 'success' ? true : false;
		return flag;
	},
	/**
	 * 对数组去重
	 * @param arr  数组
	 */
	unique: function(arr) {
		var ret = [];
		var hash = {};
		for (var i = 0; i < arr.length; i++) {
		    var item = arr[i];
		    var key = typeof(item) + item;
		    if (hash[key] !== 1) {
		    	ret.push(item);
		    	hash[key] = 1;
		    }
		}
		return ret;
	},
	
	/**
	 * 对表单数据进行自动填充
	 * @param 填充数据的json数据
	 * @param 不需要填充数据的name
	 * @param 需要填充数据的表单，多个用“,”连接
	 */
	fillForm: function(data,exceptName,form){
		if(data){
			var $form = form ? this.getObject(form) : $("form").last();
			exceptName = exceptName ? exceptName.split(",") : [];
			for(var i = 0;i < exceptName.length;i++){
				delete data[exceptName[i]];
			}
			
			$form.find("select,textarea,input").each(function(){
				var name = $(this).attr("name");
				if(data[name] != undefined){
					if(typeof data[name] == "object" && data[name].time){
						var date = new Date(data[name].time);
						var value = date.dateFormat("yyyy-MM-dd");
						$(this).val(value);
						$(this).prevAll("input").first().val(value);
					}else if($(this).attr("type") == "radio"){
						$form.find("input[name=" + name + "]").each(function(){
							if($(this).val() === data[name]){
								$(this).attr("checked",true);
							}
						});
					}else if($(this).attr("type") == "checkbox"){
						$table.find("input[name=" + name + "]").each(function(){
							$this = $(this);
							var tempValue = data[name] || "";
							tempValue = tempValue.split(",");
							for(var i = 0;i < tempValue;i++){
								if($this.val()  == tempValue[i]){
									$this.attr("checked",true);
								}
							}
							if($(this).val() === data[name]){
								$(this).attr("checked",true);
							}
						});
					}else if($(this).attr("type") == "hidden"){
						var $nbox = $(this).prev(".easyui-numberbox");
						var $cbox = $(this).parent('span').prev();
						if($nbox.length > 0){
							$nbox.numberbox("setValue",data[name]);
						}else if($cbox.length > 0 && $cbox.hasClass("combobox-f")){
						    $cbox.combobox("setValue",data[name]);
						}else{
							$(this).val(data[name]);
						}
					}else{
						$(this).val(data[name]);
					}
				}
			});
		}
	},
	/** 初始化mark标识，用于方向键、复制粘贴等
	 *  可以复制粘贴、填写的input中必须有isMark=true 日期框选择的除外（日期框mark="row-" + 日期字段的唯一标识）
	 * @param obj 需要初始化的对象，例如采样办理台样品信息有两种显示方式: picGrid 、 picList
	 */
	initMark : function(obj){
		var $trs = $(obj).find("tr");
    	if(power.isEmpty($trs) || $trs.length == 0) return;
    	var row = 0 , col = 1;
    	for(var i = 0 ; i < $trs.length ; i++){
			var $tds = $($trs[i]).find("td");
	    	if(power.isEmpty($tds) || $tds.length == 0) continue;
			for(var j = 0 ; j < $tds.length ; j++){
				var $input = $($tds[j]).find("input[ismark=true]");
				if(power.isEmpty($input) || $input.length == 0) continue;
				//edit：胡世聪， 采样单要自己加， 不能移除。会影响到复制粘贴功能
				if($input.attr("mark") == '' || $input.attr("mark") == undefined){
					var mark = row + line_heng + col;
					$input.removeAttr("mark");
					$input.attr("mark", mark);
				}
				$input.bind("keydown", function(event){
					if((event.keyCode <= 40 && event.keyCode >= 37)||event.keyCode == 13)
						power.keyDirection(event.keyCode , $(this).attr("mark") , obj);
				});
				$input.bind("keyup", function(event){
					if((event.keyCode <= 40 && event.keyCode >= 37)||event.keyCode == 13)
						power.keyUpSelectAll(event.keyCode , $(this).attr("mark") , obj);
				});
				col++;
			}
			//归1
			col = 1;
			row++;  
		}  
	},
	/** 实现方向键功能
	 * @param keyCode      键盘代码
	 * @param markName     mark标识
	 * @param obj          获取焦点的对象
	 */
	keyDirection : function(keyCode , markName , obj){
		if(power.isEmpty(markName) || power.isEmpty(obj)){
			return;
		}
		var marks = markName.split(line_heng);
		var rows = marks[0];//行
		var clos = marks[1];//列
		
	    // 左
	    if (keyCode == 37) { 
	        --clos;
	    }
	    // 右
	    else if (keyCode == 39) {
	        ++clos;
	    }
	    // 上
	    else if (keyCode == 38) {
	        --rows;
	    }
	    // 下
	    else if (keyCode == 40||keyCode == 13) {
	        ++rows;
	    }
	    //判断是否存在该input，存在则获取焦点
	    var $markInput = $(obj).find('input[mark='+ rows + line_heng + clos +']');
	    if (power.isNotEmpty($markInput)) {
	       	$markInput.each(function(){
	        	this.focus();
	        	this.select();
	        });
	    }
	},
	keyUpSelectAll : function(keyCode , markName , obj){
		if(power.isEmpty(markName) || power.isEmpty(obj)){
			return;
		}
		var marks = markName.split(line_heng);
		var rows = marks[0];//行
		var clos = marks[1];//列
		
		//判断是否存在该input，存在则选中
		var $markInput = $(obj).find('input[mark='+ rows + line_heng + clos +']');
		if (power.isNotEmpty($markInput)) {
			$markInput.each(function(){
				this.focus();
				this.select();
			});
		}
	},
	/**复制*/
	copyTrValue : function(rows , obj){
		var $inputList = $(obj).find('input[type=text]');
		if(power.isEmpty($inputList)){
			return;
		}
		//清空map
		tempCopyValueMap = {};
		
		$inputList.each(function(){
			var mark = $(this).attr("mark");
			if(power.isNotEmpty(mark)){
				tempCopyValueMap[mark] = $(this).val();
			}
		});
	},
	/** 粘贴数据
	 *@param rows 粘贴的行数 
	 *@param obj  需要粘贴的对象
	 */
	stickTrValue : function(rows , obj){
		//没有复制数据
		if(power.isEmpty(tempCopyValueMap)){
			return;
		}
		//行数是否为空 如果为空，就不对列数、行数处理。不为空，则把复制的数据中的key行数换成最新的行数
		if(power.isEmpty(rows)){
			for(var key in tempCopyValueMap){
				$(obj).find("input[mark='"+ key +"']").val(tempCopyValueMap[key]);
			}
		}else{
			for(var key in tempCopyValueMap){
				var marks = key.split(line_heng);
				$(obj).find("input[mark='"+ rows + line_heng + marks[1] +"']").val(tempCopyValueMap[key]);
			}
		}
	},
	/**
	 * post方式打开窗口
	 * @param url     链接地址
	 * @param name    窗口名称
	 * @param args    参数值 如：{"RWBH":1111}
	 */
	openWindowWithPost : function(url,name,args)
	{
	    var newWindow = window.open(url, name);
	    if (!newWindow)
	        return false;
	    var html = "";
	    html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";
	    if(power.isNotEmpty(args)){
	    	for(var key in args){
	    		 html += "<input type='hidden' name='" + key + "' value='" + args[key] + "'/>";
	    	}
	    }
	    html += "</form><script type='text/javascript'>document.getElementById('formid').submit();";
	    html += "<\/script></body></html>".toString().replace(/^.+?\*|\\(?=\/)|\*.+?$/gi, ""); 
	    newWindow.document.write(html);
	    return newWindow;
	},
	/**
	 * 对数组升序排序
	 * @param arr 数组排序
	 */
	orderUpArr : function(arr){
		if(power.isEmpty(arr)){
			return null;
		}
		var var1, var2;
		//外层循环，共要进行arr.length次求最大值操作
	    for(var i=0; i<arr.length; i++){
	        //内层循环，找到第i大的元素，并将其和第i个元素交换
	        for(var j=i; j<arr.length; j++){
	        	var1 = arr[i];
	        	var2 = arr[j];
	        	if(!isNaN(var1) && !isNaN(var2)) {
	        		var1 = Number(var1);
	        		var2 = Number(var2);
	        	}
	            if(var1 > var2){
	                //交换两个元素的位置
	                var temp=arr[i];
	                arr[i]=arr[j];
	                arr[j]=temp;
	            }
	        }
	    }
	    return arr;
	},
	/**
	 * 对数组降序排序
	 * @param arr 数组排序
	 */
	orderDownArr : function(arr){
		if(power.isEmpty(arr)){
			return null;
		}
		//外层循环，共要进行arr.length次求最大值操作
	    for(var i=0; i<arr.length; i++){
	        //内层循环，找到第i大的元素，并将其和第i个元素交换
	        for(var j=i; j<arr.length; j++){
	            if(arr[i] < arr[j]){
	                //交换两个元素的位置
	                var temp=arr[i];
	                arr[i]=arr[j];
	                arr[j]=temp;
	            }
	        }
	    }
	    return arr;
	},
	/**
	 * 调整combobox的宽度，计算方式=父元素宽度*scale
	 * @param comboboxObj combobox对象
	 * @param scale 缩放比例，如果不填，默认为0.8
	 */
	resizeComboboxWith : function(comboboxObj, scale){
		if(power.isEmpty(scale)) {
			scale = 0.8;
		}
		var width = parseInt($(comboboxObj).parent().css("width")) * scale;
		$(comboboxObj).combobox('resize', width);
	},
	/**
	 * 打开PageOffice函数
	 * 使用此函数必须先配置/pagelink Servlet，此函数会请求此地址获取PageOfficeLink
	 * 如果你不需要在js中调用打开PageOffice，请用a标签
	 *
	 *     <a href="<%=PageOfficeLink.openWindow(request, "your url", "width=0;")%>">打开</a>
	 *
	 * js打开方式
	 *     power.openPageOffice({
	 *         url: 'your url'
	 *     });
	 *
	 * 注意：由于浏览器安全限制，打开窗口的函数，要在鼠标点击时才能触发，否则无效。
	 * 在调用此函数时，请在click事件回调函数中同步调用，请不要在如setTimeout，异步ajax等回调中调用。
	 *
	 * @param {Object} opts 配置项
	 * @param {String} opts.url PageOffice页面地址
	 * @param {Object} opts.param PageOffice打开的IE窗口参数
	 * @param {String} [opts.param.width="0"] 宽度，默认0为全屏
	 * @param {String} [opts.param.height=undefined] 高度
	 */
	openPageOffice: function (opts) {
        opts = $.extend(true, {
            param: {width: "0"}
        }, opts);

        var param = '', key;
        for (key in opts.param) {
            if (opts.param.hasOwnProperty(key)) {
                param += key + '=' + opts.param[key] + ';';
            }
        }
        power.ajaxRequest(ctx + '/pagelink', {
            param: param
        }, function (result) {
            if (!power.isTrue(result.result)) {
                throw '无法获取PageOfficeLink地址';
            }
            if (result.url.indexOf('127.0.0.1:80') != -1) {
            	var href = window.document.location.href;
            	result.url = result.url.replace('127.0.0.1:80', href.split("//")[1].split('/')[0]);//替换真实ip和端口号
            }
            var url = result.url.replace('{{url}}', opts.url);
            var aLink = document.createElement('a');
            aLink.href = url;
            aLink.click();
        });
    }
};

/**
 * 较为精确计算 加减乘除
 * @param arg1  数字1(整数，小数)
 * @param arg2  数字2(整数，小数)
 * @returns     计算结果
 * 
 * power.calc.accAdd(0.1,0.2);
 * power.calc.accAdd(1,2)
 */
power.calc = {
		//加法函数 
		accAdd : function(a, b) {
			//加法函数  
		    var c, d, e;
		    try{
		        c = a.toString().split(".")[1].length;
		    } catch(f) {
		        c = 0;
		    }
		    try{
		        d = b.toString().split(".")[1].length;
		    } catch(f) {
		        d = 0;
		    }
		    return e = Math.pow(10, Math.max(c, d)), (power.calc.accMul(a, e) + power.calc.accMul(b, e)) / e;
		},
		
		//减法函数  
		subtr : function(a, b) { 
			//减法函数  
		    var c, d, e;
		    try{
		        c = a.toString().split(".")[1].length;
		    } catch(f) {
		        c = 0;
		    }
		    try{
		        d = b.toString().split(".")[1].length;
		    } catch(f) {
		        d = 0;
		    }
		    return e = Math.pow(10, Math.max(c, d)), (power.calc.accMul(a, e) - power.calc.accMul(b, e)) / e;
		},
		
		//乘法函数  
		accMul : function(a, b) {  
			//乘法函数 
		    var c = 0,
		        d = a.toString(),
		        e = b.toString();
		    try{
		        c += d.split(".")[1].length;
		    } catch(f) {}
		    try{
		        c += e.split(".")[1].length;
		    } catch(f) {}
		    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
		},
		
		//除法函数  
		accDiv : function(a, b) {  
			//除法函数  
		    var c, d, e = 0,
		        f = 0;
		    try{
		        e = a.toString().split(".")[1].length;
		    } catch(g) {}
		    try{
		        f = b.toString().split(".")[1].length;
		    } catch(g) {}
		    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), power.calc.accMul(c / d, Math.pow(10, f - e));
		}
		
}


if(window.constructor === undefined) {
	window.ie7showModalDialog = window.showModalDialog;
	window.ie7close = window.close;
}
isOpenDialog = "window_tempParameter_isOpenDialog";
dialogObj = "window_tempParameter_dialogObj";
/**
 * 
 * 	sURL 必选  字符串 用来指定对话框要显示的网页的URL。
	vArguments 可选 任何类型 用来向对话框传递参数。参数类型不限。 对话框通过window.dialogArguments来取得传递进来的参数。
	sFeatures 可选 字符串 用来描述对话框的外观等信息
  		dialogHeight  npx  对话框高度 默认500
   		dialogWidth  npx  对话框宽度 默认800
 		dialogLeft  npx  离主窗口左的距离
 		dialogTop  npx  离主窗口上的距离
 		resizable  {yes | no}  是否可改变大小，默认no
 		title 标题 默认"选择页面"
 		maximizable 是否显示最大化按钮 默认为false，不显示

 * 	fn 可选 回调函数
 * 
 * 示例： window.showModalDialog("*.jsp?param1=1", {param2:param2}, "dialogHeight:500px;dialogWidth:700px;", function(returnValue){alert(returnValue);})
 */
window.showModalDialog = function(sURL, vArguments, sFeatures, fn){
	if(power.isEmpty(sURL)){
		power.alert("提示", "URL不能为空", "warning");
		return;
	}
	var result;
	
	if($.browser && !$.browser.chrome && (window.ie7showModalDialog || window.constructor.prototype.showModalDialog)) {
		if(Object.getPrototypeOf) {
			result = Object.getPrototypeOf(window).showModalDialog.call(window, sURL, vArguments, sFeatures);
		} else if(window.ie7showModalDialog) {
			// ie7不支持constructor、__proto__和getPrototypeOf
			result = window.ie7showModalDialog.call(window, sURL, vArguments, sFeatures);
		} else if(window.constructor) {
			// IE8不支持__proto__和getPrototypeOf函数
			result = window.constructor.prototype.showModalDialog.call(window, sURL, vArguments, sFeatures);
		}
		if($.isFunction(fn)){
			fn(result);
		}
		return;
	}
	
	vArguments = vArguments || {};
	sFeatures = sFeatures || "";
	var width = "800", height = "500", left, top, title = "选择页面", resizable = false;
	var maximizable = false;
	if(power.isNotEmpty(sFeatures)){
		sFeatures = sFeatures.split(";");
		$.each(sFeatures, function(){
			var sFeature = $.trim(this.toString());
			if(power.isNotEmpty(sFeature)){
				sFeature = sFeature.indexOf(":") != -1 ? sFeature.split(":") : sFeature.split("=");
				if(sFeature.length > 1){
					var param = $.trim(sFeature[0]),
						value = $.trim(sFeature[1].replaceAll("px", ""));
					switch(param){
						case "dialogHeight":
							//30 为表头的高度
							height = parseFloat(value) + 30; break;
						case "dialogWidth":
							width = value; break;
						case "dialogLeft":
							left = value; break;
						case "dialogTop":
							top = value; break;
						case "resizable":
							resizable = value != "yes" ? false : true; break;
						case "title":
							title = value; break;
						case "maximizable":
							maximizable = value; break;
					}
				}
			}
		});
	}
	var $top = window.top.$, $window;
	var divId = power.UUID(), iframeId = power.UUID();
	var div = "<div id='"+ divId +"'></div>";
	// ifrmae 添加display:block; 防止iframe在height:100%时会在某些情况下导致父元素出现垂直滚动条
	var iframe = "<iframe id='"+ iframeId +"' width='100%' src='"+ sURL +"' height='100%' style='display:block;' frameborder='0'></iframe>";
	$top(div).dialog({
		title:title,
		height:height,
		width:width,
		left:left,
		top:top,
		resizable:resizable,
		content:iframe,
		maximizable:maximizable,
		onBeforeOpen:function(){
			$window = $top("#"+iframeId)[0].contentWindow;
			$window[isOpenDialog] = true;
			$window[dialogObj] = $top("#"+divId);
			$top[iframeId] = $top("#"+divId);
		},
		onClose:function(){
			$top("#"+divId).dialog("destroy");
			$window[isOpenDialog] = false;
			$window[dialogObj] = "";
			if(power.isEmpty($window["returnValue"])){
				if($.isFunction(fn)) {
					/*如果函数不需要参数 或者调用是不传参数 要执行回调方法
					马旭修改 如果没有值返回 任然应该执行回调方法 因为有些不用返回值的代码会在回调方法里面执行  2015-09-15
					*/
					fn();
				}
				return;
			}
			if($.isFunction(fn)) {
				fn($window["returnValue"]);
			}
		
		}
	});
	$window["dialogArguments"] = vArguments;
}
/**
 * 窗口关闭方法
 */
window.close = function(){
	try{
		var $top = window.top.$, id = $(window["frameElement"]).attr("id");
		$top[id].dialog("close");
	}catch(e){
		//调用窗口本来的关闭方法
		if(Object.getPrototypeOf) {
			Object.getPrototypeOf(window).close.call(window);
		} else if(window.constructor) {
			window.constructor.prototype.close.call(window);
		} else {
			window.ie7close.close.call(window);
		}
	}
}

/**
 * 对日期的操作
 */
power.date = {
		
	/**
	 * 根据指定的时间或指定间隔前的时间(cycle > 0)，得到指定前的时间（cycle < 0）
	 * 如，得到指定间隔后的时间：time = "2014-03-10", cycle = 1, unit = "year", 返回结果 2015-03-10
	 * 如，得到指定间隔前的时间：time = "2014-03-10", cycle = -1, unit = "year", 返回结果 2013-03-10
	 * 
	 * @param 	time 初始时间， 默认为当前时间
	 * @param 	cycle 周期
	 * @param 	unit 时间单位，默认为"year",可取值（ year:年，month:月，week:周，day:天，hour:时，minute:分，second:秒）
	 * @param	format 格式化，默认"yyyy-MM-dd HH:mm:ss"
	 * @return 	计算后的日期（字符串格式）
	 * 
	 * @author 	江梁斌
	 * @version 2014-03-10
	 * @since 	V0.1.0
	 */
	getAfterByTime:function(time, cycle, unit, format){
		var date = new Date();
		if(power.isEmpty(time)) {
			time = date.getFullYear() + "-" + (date.getMonth() + 1 ) + "-" + date.getDate()
					+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();    
		}
		if(power.isEmpty(cycle)) cycle = 0;
		if(power.isEmpty(unit)) unit = "year";
		if(power.isEmpty(format)) format = "yyyy-MM-dd hh:mm:ss";
		date = new Date(time);
		return date.dateAdd(unit, cycle).dateFormat(format);
	}
}

/**
 * 对cookie进行处理，IE8以下不支持 localStorage，使用jquery.cookie.js
 */
power.localStorage = {
	getItem:function(name){
		if(window.localStorage) return localStorage.getItem(name);
		else return $.cookie(name);
	},
	setItem:function(name, value){
		if(window.localStorage) localStorage.setItem(name, value);
		else $.cookie(name, value);
	},
	removeItem:function(name){
		if(window.localStorage) localStorage.removeItem(name);
		else $.removeCookie(name);
	}
}
/**
 * 对cookie进行处理，IE8以下不支持 localStorage，使用jquery.cookie.js,浏览器关闭时清空cookie
 */
power.sessionStorage = {
		getItem:function(name){
			if(window.sessionStorage) return sessionStorage.getItem(name);
			else return $.cookie(name);
		},
		setItem:function(name, value){
			if(window.sessionStorage) sessionStorage.setItem(name, value);
			else $.cookie(name, value);
		},
		removeItem:function(name){
			if(window.sessionStorage) sessionStorage.removeItem(name);
			else $.removeCookie(name);
		}
	}

/**
 * 初始化echarts数据
 */
power.echarts = function(){
	
	var echartsPath = ctx + '/scripts/plugin/jquery-easyui/ext/echarts';
	require.config({
        paths:{ 
            echarts:echartsPath,
            'echarts/chart/line' : echartsPath,
            'echarts/chart/bar' : echartsPath,
            'echarts/chart/scatter' : echartsPath,
            'echarts/chart/k' : echartsPath,
            'echarts/chart/pie' : echartsPath,
            'echarts/chart/radar' : echartsPath,
            'echarts/chart/chord' : echartsPath,
            'echarts/chart/force' : echartsPath
        }
    });
}

/**
 * 判断是否以指定字符串开头 使用:str.startWith(s)
 * @param s 指定字符串
 * @returns 判断结果
 */
String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
		return false;
	if(this.substr(0,s.length)==s)
		return true;
	else
		return false;
	return true;
}

/**
 * 判断是否以指定字符串结尾 使用:str.endWith(s)
 * @param s 指定字符串
 * @returns 判断结果
 */
String.prototype.endWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
		return false;
	if(this.substring(this.length-s.length)==s)
		return true;
	else
		return false;
	return true;
}

/**
 * 将指定字符串中指定的字符替换成另一个字符
 * 
 * @param findText 指定替换的字符
 * @param repText 替换后的字符
 */
String.prototype.replaceAll = function (findText, repText){
    var newRegExp = new RegExp(findText, 'gm');
    return this.replace(newRegExp, repText);
}

/**
 * 替换字符串中的占位符
 * 如： alert("请输入{0},输完后再按{1}按钮".format("姓名","存盘"));
 */
String.prototype.format = function(str)  
{  
  if(str.length == 0) return this;  
  for(var s = this, i = 0; i < str.length; i++){
	  s = s.replace(new RegExp("\\{" + i + "\\}","g"), str[i]);  
  } 
  return s;  
};  

/**
 * 对Date的扩展，将 Date 转化为指定格式的String   
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)  
 *  例子：    
 *  (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
 *  (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
 *  @param fmt 格式
 */
Date.prototype.dateFormat = function(fmt)   
{ 
	var o = {   
			"M+" : this.getMonth() + 1,                 //月份   
			"d+" : this.getDate(),                    //日   
			"h+" : this.getHours(),                   //小时   
			"m+" : this.getMinutes(),                 //分   
			"s+" : this.getSeconds(),                 //秒   
			"q+" : Math.floor((this.getMonth() + 3)/3), //季度   
			"S"  : this.getMilliseconds()             //毫秒   
	};   
	if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));   
	for(var k in o) if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));   
	return fmt;   
} 

/**
 * 根据指定的时间或指定间隔前的时间(cycle > 0)，得到指定前的时间（cycle < 0）
 * 
 * @param 	cycle 周期
 * @param 	unit 时间单位，默认为"year",可取值（ year:年，month:月，week:周，day:天，hour:时，minute:分，second:秒）
 * @return 	计算后的日期（字符串格式）
 * 
 * @since 	V0.1.0
 */
Date.prototype.dateAdd = function(unit, cycle) {   
    var dtTmp = this;  
    switch (unit) {   
        case 'second' :return new Date(Date.parse(dtTmp) + (1000 * cycle));  
        case 'minute' :return new Date(Date.parse(dtTmp) + (60000 * cycle));  
        case 'hour' :return new Date(Date.parse(dtTmp) + (3600000 * cycle));  
        case 'day' :return new Date(Date.parse(dtTmp) + (86400000 * cycle));  
        case 'week' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * cycle));  
        case 'month' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + cycle, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        case 'year' :return new Date((dtTmp.getFullYear() + cycle), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
    }  
}  

/**
 * Array indexOf
 
Array.prototype.indexOf = function (val) {  
    for (var i = 0; i < this.length; i++) {  
        if (this[i] == val) {  
            return i;  
        }  
    }  
    return -1;  
};  

/**
 * Array remove

Array.prototype.remove = function (val) {  
    var index = this.indexOf(val);  
    if (index > -1) {  
        this.splice(index, 1);  
    }  
};   */

/**
 * 后台返回数据结构
 * 
 * @param operateType
 * @returns
 */
function FormResult(formResult){
	try{
		formResult = eval("(" + formResult + ")");
	}catch(e){
		$.messager.progress("close");
		power.alert("数据格式错误", formResult, "error");
		return;
	}
	this.operateType = formResult["operateType"];
	this.operateResult = formResult["operateResult"];
	this.primaryKey = formResult["primaryKey"];
	this.token = formResult["token"];
	this.data = formResult["data"];
	this.message = formResult["message"];
	this.path = formResult["path"];
	this.exStack = formResult["exStack"];
	this.messageColor = "red";
}

//屏蔽按Backspace键时回退页面
window.document.onkeydown = function(evt){
	var evt =  window.event || evt;
	if(evt.keyCode == 8){
		if((evt.srcElement.tagName == "INPUT" || evt.srcElement.tagName == "TEXTAREA") && evt.srcElement.readOnly == false)
			return true;
		return false;
	}
	return true;
}


/*
//屏蔽全选，除INPUT框外
window.document.onselectstart = function(e){
    var now = e.srcElement;  
	if(now.tagName == "INPUT"){  
		return true;  
	}else{
		return false;
	}
}

//屏蔽按Backspace键时回退页面， 除F5外
document.onkeydown = checkBackSpace;
function checkBackSpace(e) {
    var code;
    if(!e) var e = window.event;
    if(e.keyCode) code = e.keyCode;
    else if (e.which) code = e.which;
    if (((event.keyCode == 8) &&   //BackSpace   
    	((event.srcElement.type != "text" &&  event.srcElement.type != "textarea" &&  event.srcElement.type != "password") || 
    	event.srcElement.readOnly == true)) ||
        ((event.ctrlKey) && ((event.keyCode == 78) || (event.keyCode == 82)) )) {  //Ctrl + N,Ctrl + R 
        event.keyCode = 0; 
        event.returnValue = false; 
    }
    return true;
}*/