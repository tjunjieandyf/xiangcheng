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
	 * @param obj JONS格式参数，可取值： form 表单对象，默认取页面中最后一个表单　
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
		}
		var $form = power.getObject(form);
		if(power.isEmpty($form[0])){
			//power.alert("提示信息", "没有找到form表单，请检查!", "info");
			Layer.showAlert("没有找到form表单，请检查!");
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
			$("input[name='method']").val(method);
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
						//power.alert("提示信息", "返回数据为空，请重新操作或联系系统管理员！", "warning");
						Layer.showAlert("返回数据为空，请重新操作或联系系统管理员！");
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
	//						power.monitorDataChange(); 
						}
						if("success" == formResultObj.operateResult){
							//power.msgTip($form, {msg:power.isNotEmpty(successMsg) ? successMsg : formResultObj.message,time:time}, msgStyle);
							Layer.showSucAlert(power.isNotEmpty(successMsg) ? successMsg : formResultObj.message);
						}else if("fail" == formResultObj.operateResult){
							Layer.showFailAlert(power.isNotEmpty(successMsg) ? successMsg : formResultObj.message);
							//power.msgTip($form, {msg:power.isNotEmpty(failMsg) ? failMsg : formResultObj.message, level:'fail'}, msgStyle);
						}else if("exception" == formResultObj.operateResult){
							power.msgTip($form, {msg:formResultObj.exStack, level:"exception"},msgStyle);
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
					//power.alert('错误', "异步提交出错，请重新提交或联系系统管理员！", 'error');  
					Layer.showFailAlert("异步提交出错，请重新提交或联系系统管理员！");
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
			//power.alert("提示信息","请检查需要刷新的对象是否存在。","info");
			Layer.showAlert("请检查需要刷新的对象是否存在。");
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
		grid.datagrid("options").fn = fn;
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
		iframe[0].contentWindow.close();
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
	forms:"#autoform", values:"",
	/**
	  * 将页面的初始值保存到JSON中缓存，监控页面数据时使用
	  * @param forms 需要监控的form对象，默认为id为“autoform”的的表单，如果有多个表单对象需要验证
	  * 	多个参数间需要用“,”分割，如："#autoform_1,form[name=autoform_2]"
	  * 	参数为jQuery支持的对象
	 */
	monitorDataChange:function(forms) {
		power.values = "{";
		var names = new Array();
		if(this.isNotEmpty(forms)) this.forms = forms;
		var $form = power.getObject(this.forms);
		if($form.length > 1){
			$form.each(function(index, value){
				getInitValue(value);
			});
		}else{
			getInitValue(this.forms);
		}
		if(power.values.charAt(power.values.length-1) == ','){
			power.values = power.values.substring(0,power.values.length-1);
		}
		power.values += "}";
		power.values = eval("(" + power.values + ")");
		
		/**
		 * 将元素值放入JSON中，此方法不对外使用
		 * @param form 需要入值的form对象
		 */
		function getInitValue(form){
			power.values += '"' + form + '":[';
			var type, name, value, tempForm = power.getObject(form);
			/**
			 * 遍历form下input控件
			 */
			tempForm.find("input").each(function(){
				type = $(this).attr("type");
				name = $(this).attr("name");
				if("radio" == type){
					value = $("input:radio[name=" + name + "]:checked").val();
					if(isExistName(name)){
						power.values += "{\"name\":\"" + name + "\",\"value\":\"" + value + "\"},";
					}
				}else if("checkbox" == type){
					value = $("input:checkbox[name=" + name + "]:checked").val();
					if(isExistName(name)){
						power.values += "{\"name\":\"" + name + "\",\"value\":\"" + value + "\"},";
					}
				}else if("text" == type || "password" == type){
					power.values += "{\"name\":\"" + name + "\",\"value\":\"" + $(this).val() + "\"},";
				}
			});
			/**
			 * 遍历form下select控件
			 */
			tempForm.find("select").each(function(){
				name = $(this).attr("name");
				power.values += "{\"name\":\"" + name + "\",\"value\":\"" + $(this).val() + "\"},";
			});
			/**
			 * 遍历form下textarea控件
			 */
			tempForm.find("textarea").each(function(){
				name = $(this).attr("name");
				power.values += "{\"name\":\"" + name + "\",\"value\":\"" + $(this).val() + "\"},";
			});
			if(power.values.charAt(power.values.length-1) == ','){
				power.values = power.values.substring(0,power.values.length-1);
			}
			power.values += "],";
		}
		
		/**
		 * @private
		 * 判断JSON数据中是否存在name，此方法不对外使用。
		 * @name 需要验证的name属性
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
			var name, value, change = false, tempForm = power.getObject(form);
			/**
			 * 遍历form下input控件
			 */
			tempForm.find("input").each(function(){
				var type = $(this).attr("type");
				name = $(this).attr("name");
				if("radio" == type){
					value = $("input:radio[name=" + name + "]:checked").val();
				}else if("checkbox" == type){
					value = $("input:checkbox[name=" + name + "]:checked").val();
				}else if("text" == type || "password" == type){
					value = $(this).val();
				}
				if(comparisonValue(form, name, value)){change = true;return;}
			});
			/**
			 * 遍历form下select控件
			 */
			tempForm.find("select").each(function(){
				name = $(this).attr("name");
				value = $(this).val();
				if(comparisonValue(form, name, value)){change = true;return;}
			});
			/**
			 * 遍历form下textarea控件
			 */
			tempForm.find("textarea").each(function(){
				name = $(this).attr("name");
				value = $(this).val();
				if(comparisonValue(form, name, value)){change = true;return;}
			});
			return change;
		}

		/**
		 * 比较值是否改变
		 * @param form form对象
		 * @param name 控件name
		 * @param value 控件的值
		 */
		function comparisonValue(form, name, value){
			var change = false;
			$(power.values[form]).each(function(index,data){
				var n = data["name"], v = data["value"];
				if(name == n){
					if(v != value){change = true; return;}
				}
			});
			return change;
		}
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
			//power.alert("提示信息", "请确认是否有父页面创建帮助页面？创建方法newHelp()。", "info");
			Layer.showAlert("请确认是否有父页面创建帮助页面？创建方法newHelp()。");
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
	 * 弹出dialog，调用window.showModalDailog
		参数说明：url:必选参数，类型：字符串。用来指定对话框要显示的文档的URL。
			  obj:JSON格式的参数可取值
		    	args:可选参数，类型：变体。用来向对话框传递参数。传递的参数类型不限，包括数组等。对话框通过window.dialogArguments来取得传递进来的参数,
		    			要想对话框传递参数，是通过vArguments来进行传递的。类型不限制，对于字符串类型，最大为4096个字符。也可以传递对象，
		    	param:特征参数，可选参数, 此参数为JSON格式
			    height: 对话框高度，不小于100px，ＩＥ４中dialogHeight 和 dialogWidth 默认的单位是em，而ＩＥ５中是px，为方便其见，在定义modal方式的对话框时，用px做单位。
			　 	width: 对话框宽度。
			　 	center: {yes | no | 1 | 0 }：窗口是否居中，默认yes，但仍可以指定高度和宽度。
			　 	help: {yes | no | 1 | 0 }：是否显示帮助按钮，默认yes。
			　 	resizable: {yes | no | 1 | 0 } ［ＩＥ５＋］：是否可被改变大小。默认no。
			　 	status: {yes | no | 1 | 0 } ［IE5+］：是否显示状态栏。默认为yes[ Modeless]或no[Modal]。
			    scroll:{ yes | no | 1 | 0 | on | off }：指明对话框是否显示滚动条。默认为yes。
			
				还有几个属性是用在HTA中的，在一般的网页中一般不使用。
			    dialogHide:{ yes | no | 1 | 0 | on | off }：在打印或者打印预览时对话框是否隐藏。默认为no。
			    edge:{ sunken | raised }：指明对话框的边框样式。默认为raised。
			    unadorned:{ yes | no | 1 | 0 | on | off }：默认为no。
			   	fn:回调方法
	 */
	showModalDialog:function(url, obj){
		if(power.isEmpty(url)){
			//power.alert("提示信息", "请传入路径!", "info");
			Layer.showAlert("请传入路径!");
			return;
		}
		obj = obj || {};
		var args = obj.args || "";
		var fn = obj.fn || "";
		var param = obj.param || "";
		var load = obj.load || "";
		var height = "500px", 
			width = "800px", 
			center = "yes", 
			help = "yes", 
			resizable = "no", 
			status = "yes", 
			scroll = "yes",
			dialogHide = "no",
			edge = "raised",
			unadorned = "no";
		if(power.isNotEmpty(param)){
			height = param.height || height;
			width = param.width || width;
			center = param.center || center;
			help = param.help || help;
			resizable = param.resizable || resizable;
			status = param.status || status;
			scroll = param.scroll || scroll;
			dialogHide = param.dialogHide || dialogHide;
			edge = param.edge || edge;
			unadorned = param.unadorned || unadorned;
		}
		var result  = window.showModalDialog(encodeURI(url), args,
						'dialogHeight:' + height + ';dialogWidth:' + width + ';center:' + center + 
						';help:' + help + ';resizable:' + resizable + ';status:' + status + ';scroll:' + scroll + 
						';dialogHide:' + dialogHide + ';edge:' + edge + ';unadorned:' + unadorned + '');
		/*if(power.isEmpty(result)){
			result = window.returnValue;
		}	*/	
		if($.isFunction(fn))fn(result);
		return result;
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
			//power.alert("提示信息", "请选择有效的select对象", "info");
			Layer.showAlert("请选择有效的select对象");
			return;
		}
		var result = this.getCode(codeId, fdm);
		if(result && result.length > 0){
			var defaultValue = value || obj.val();
			try{
				defaultValue = defaultValue || (obj.combobox("getValue"));
				var opts = obj.combobox("options")
				var data = new Array();
				var value = opts.valueField;
				var text = opts.textField;
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
	 * @param isView 是否启用视图模式，参数为V时启用视图模式
	 * @param forms 需要设置视图模式的form对象, 如：#form1,#form2  默认为：#autoform
	 */
	setView:function(isView, forms){
		if("V" != isView) return;
		var names = new Array();
		var preName = "";
		if(power.isEmpty(forms)){
			view($("#autoform"));
		}else{
			forms = power.getObject(forms);
			if(forms.length > 1){
				forms.each(function(){
					view(this);
				});
			}else{
				view(forms);
			}
		}
		
		/**
		 * 将元素值放入JSON中，此方法不对外使用
		 * @param form 需要入值的form对象
		 */
		function view(form){
			var tempForm = power.getObject(form);
			
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
				if (labelText != null && "*" === labelText.charAt(0)) {
					label.text(labelText.substring(1));
				}
				
				//用于处理easyui手动渲染的combo
				if($this.hasClass("combo-text")){
					var span = $this.closest("span");
					if(span.length > 0 && span.hasClass("combo")){
						span.prevAll("input").remove();
						var value = span.find(".combo-value").val();
						var text = value ? $this.val() : "";
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
								$("<font>" + next.html() + "</font>").insertBefore($this);
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
				$(this).closest("td").css("white-space","normal");
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
	
	/***
	 * 显示格式化后的HTMLtooltip
	 */
	tooltipSubp: function(el){
		var obj = power.getObject(el);
		$(obj).each(function(){
			 $(this).tooltip({
			       position: 'top',
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
	 * @param 	maxNum 当前返回页面的最大个数，Integer类型
	 * @param 	atoz 打开选择页面时按字母显示，Boolean类型，默认为false按部门显示
	 * @param 	keyStr 需要初始化的key，String类型，多个用","分隔
	 * @param 	valueStr 需要初始化的value，String类型，多个用","分隔，对应keyStr
	 * @param   showAll 控制定位到当前部门的逻辑，为true则不做控制，为false默认定位到本部门 Boolean类型 
	 * @param   dept 部门编号，定位到指定部门
	 * @return 	['人员名称','人员ID','所在部门ID','所在部门名称']
	 * 
	 * @since 	V0.1.0
	 */
	userTree: function(maxNum,atoz,keyStr,valueStr,departmentStr,showAll,dept){
		var _sort = Boolean(atoz) ? 'atoz' : 'classify';
		var url = ctx + "/lims/ggzj/bms/rys.jsp?sort=";
		url += Boolean(atoz) ? 'atoz' : 'classify';
		if(maxNum){ url += "&maxNum=" + maxNum; }
		if(dept){ url += "&dept=" + dept; }
		if(showAll){ url += "&showAll=" + showAll; }
		var sFeatures = "dialogHeight:510px;dialogWidth:835px;status:no;help:no;scroll:no;resizable:no;location:no;toolbar:no;";
		var arr = window.showModalDialog(url,{fxxmdm:$.trim(keyStr),fxxmmc:$.trim(valueStr),lx:$.trim(departmentStr)}, sFeatures);
		if(arr == undefined){ //谷歌
			arr = window.returnValue;
		}
	   	return arr;
	},
	
	/**
	 * 调用部门树的方法
	 * 
	 * @param 	hasCheckbox 是否添加复选框，Boolean类型，默认单选为false
	 * @param 	onlyLeafCheck 只在叶子节点前显示复选框，Boolean类型，默认为false
	 * @param 	cascadeCheck 是否级联，Boolean类型，默认为false
	 * @param 	defaultArr 默认值，数组，页面初始化需要显示的值 和返回值类型一致 ['部门名称','部门ID']
	 * @return 	['部门名称','部门ID']
	 * 
	 * @since 	V0.1.0
	 */
	departmentTree: function(hasCheckbox,onlyLeafCheck,cascadeCheck,defaultArr){
		var _checkbox = power.isEmpty(hasCheckbox) ? false : arguments[0];
		var _onlyLeafCheck = power.isEmpty(onlyLeafCheck) ? false : arguments[1];
		var _cascadeCheck = power.isEmpty(cascadeCheck) ? false : arguments[2];
		var _defaultArr = power.isEmpty(defaultArr) ? [] : arguments[3];
		var url = ctx + "/lims/ggzj/bms/bms.jsp?checkbox=" + _checkbox + "&cascadeCheck=" + _cascadeCheck + "&onlyLeafCheck=" + _onlyLeafCheck;
		var sFeatures = "dialogHeight:505px;dialogWidth:400px;status:no;help:no;scroll:no;resizable:no;location:no;toolbar:no;";
		var arr = window.showModalDialog(url,{fxxmdm:$.trim(_defaultArr[1]),fxxmmc:$.trim(_defaultArr[0]),lx:''}, sFeatures);
		if(arr == undefined){ //谷歌
			arr = window.returnValue;
		}
		return arr;
	},
	
	/**
	 * 调用部门树的方法
	 * 
	 * @param 	hasCheckbox 是否添加复选框，Boolean类型，默认单选为false
	 * @param 	onlyLeafCheck 只在叶子节点前显示复选框，Boolean类型，默认为false
	 * @param 	cascadeCheck 是否级联，Boolean类型，默认为false
	 * @param 	defaultArr 默认值，数组，页面初始化需要显示的值 和返回值类型一致 ['部门名称','部门ID']
	 * @return 	['部门名称','部门ID']
	 * 
	 * @since 	V0.1.0
	 */
	userGroupTree: function(hasCheckbox,onlyLeafCheck,cascadeCheck,defaultArr){
		var _checkbox = power.isEmpty(hasCheckbox) ? false : arguments[0];
		var _onlyLeafCheck = power.isEmpty(onlyLeafCheck) ? false : arguments[1];
		var _cascadeCheck = power.isEmpty(cascadeCheck) ? false : arguments[2];
		var _defaultArr = power.isEmpty(defaultArr) ? [] : arguments[3];
		var url = ctx + "/pages/platform/workflow/web/config/userGroupSelect.jsp?checkbox=" + _checkbox + "&cascadeCheck=" + _cascadeCheck + "&onlyLeafCheck=" + _onlyLeafCheck;
		var sFeatures = "dialogHeight:505px;dialogWidth:400px;status:no;help:no;scroll:no;resizable:no;location:no;toolbar:no;";
		var arr = window.showModalDialog(url,{fxxmdm:$.trim(_defaultArr[1]),fxxmmc:$.trim(_defaultArr[0]),lx:''}, sFeatures);
		if(arr == undefined){ //谷歌
			arr = window.returnValue;
		}
		return arr;
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
	showGgdmz: function(args,sel){
	  var sFeatures = "dialogHeight: 400px;dialogWidth:800px;scroll:on;";
	  var url = ctx + "/lims/ggzj/ggdm/operGgdmz.jsp";
	  var arr = window.showModalDialog(url,args, sFeatures);
	  if(sel && args){
		  var selValue = arr ? arr[0].dm : "";
		  this.updateSelectByCodeId(args.dmjbh, sel, selValue, args.fdm); //刷新下拉框
	  }
	  return arr;
	},

	/**
	 * 显示公共代码集
	 */
	showGgdmj: function(args){
	  var sFeatures = "dialogHeight: 400px;dialogWidth:550px;scroll:on;";
	  var url = ctx + "/lims/ggzj/ggdm/ggdmjSel.jsp";
	  var arr = window.showModalDialog(url,args, sFeatures);
	  return arr;
	},
	
	/**
	 * 选择计量单位
	 * @param singleSelect 是否单选 true单选 false多选
	 * @param jldw 初始化的计量单位
	 */
	showJldw: function(singleSelect,jldw){
		var url = ctx +  '/lims/ggzj/jldwgl/selectJldw.jsp';
		var sFeatures = "dialogHeight:530px;dialogWidth:" + (singleSelect == true ? 420 : 800) + "px;status:no;help:no;scroll:no;resizable:no;location:no;toolbar:no;";
		var args = {};
		args.singleSelect = singleSelect;
		args.jldw = jldw;
		var arr = window.showModalDialog(url, args, sFeatures);
		return arr;
	},
	
	/**
	 * 设置字体字号大小
	 * 
	 * @param objName 字体样式名称
	 */
	setFontSize: function(objName){ 
		var vRelName = objName == "" ? "commonSmall" : objName; 
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
				if(vName == "commonSmall.css" || vName == "commonMiddle.css" || vName == "commonBig.css"){
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
	}
};

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