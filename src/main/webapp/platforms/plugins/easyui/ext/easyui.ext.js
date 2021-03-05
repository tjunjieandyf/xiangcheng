/**
 * easyUI 平台操作方法
 */
var easyui = {};

/**
 * 操作easyUI datagrid的一些方法
 * @namespace
 */
easyui.datagrid={
	
	/**
	 * @private
	 * 添加数据的标记名，标记子表编辑行为添加功能
	 */
	addFlag:"temp_add_flag",
	
	/**
	 * datagird 获得表格idField属性字段名称
	 * @param table 表格对象
	 * @returns 返回datagrid的idField属性名称
	 */
	getIdField:function(table){
		return table.datagrid('options').idField;
	},
	
	/**
	 * 获得datagird表格中选中行的idField属性字段值
	 * @param table 表格对象
	 * @returns 返回datagrid的idField属性所对应的值
	 */
	getIdFieldVal:function(table){
		table = platform.getObject(table);
		var idField = this.getIdField(table);
		if(idField == null)return false;
		var getSelected = table.datagrid("getSelected");
		if(getSelected == null) return false;
		return getSelected[idField];
	},
	
	 /**
	 * 获得表格（子表）增删改默认调用的url
	 * @returns 返回url
	 */
	getActionUrl:function(){
		var actionUrl = ctx + '/ajax?SUBLIST_SUBMIT=true';
		return actionUrl;
	},
	
	/**
	 * 格式化子表显示数据
	 * @param value 字段值。
	 * @param rowData 行记录数据。
	 * @param rowIndex 行索引。 
	 * @returns 返回格式化后显示的值
	 */
	format:function(value,rowData,rowIndex){
		var $this = $(this), $thisEditor = $this[0]["editor"];
		var $thisOptions = $thisEditor["options"];
		var $data = "";
		var type = $thisEditor.type;
		$thisOptions = $thisOptions || {};
		if("date" == type){
			var fmt = $thisOptions.fmt || "yyyy-MM-dd";
			if(platform.isNotEmpty(value)){
				if(typeof value == "object"){
					value = platform.dateFormat(new Date(value.time), fmt);
				}
			} 
			return value;
		}else if("combobox" == type || "select" == type){
			$data = $($thisOptions["data"]);
			var text; 
			$data.each(function(){
				if(this['DM'] == value){
					text = this['DMNR'];
				}
			});
			return text;
		}
	},
	/**
	 * 子表中通过点击弹出框或其它途径，在点击一个列时，将数据设置到其它列中。
	 * 使用方式
	 * easyui.datagrid.setFieldValue(obj,datagrid,{"XTBH":"123","XTMC":"456","XTDZ":"test"});
	 * 参数一：当前控件或index下标
	 * 参数二：datagrid对象 
	 * 参数三：需要填充的列与数据
	 */
	setFieldValue:function(obj, table, params){
		if(platform.isEmpty(params)){
			platform.alert("提示信息", "请先设置Filed或Value值", "info");
			return;
		}
		table = platform.getObject(table);
		params = platform.getObject(params);
		var index = "";
		if(/^[0-9]*$/.test(obj)){
			index = obj;
			obj = table.datagrid("getPanel");
		}else{
			obj = platform.getObject(obj);
			var i = 0; 
			while(platform.isEmpty(obj.attr("field"))){
				obj = obj.parent();
				i++;
				//防止死循环
				if(i == 200) break;
			}
			obj = obj.parent();
			if(obj.length == 0){
				platform.alert("提示信息", "参数一设置有误，请设置datagrid的下标或子表中控件对象。", "info");
				return;
			};
		}
		$.each(params, function(key, value){
			var $td;
			if(platform.isEmpty(index)){
				$td = obj.find("td[field='" + key + "']");
			}else{
				$td = obj.find("tr[datagrid-row-index=" + index + "]>td[field='" + key + "']");
			}
			if($td.find('input').length > 0){
				var $searchbox = $($td.find(".searchbox-f"));
				var $combobox = $($td.find(".combobox-f"));
				if($searchbox.length > 0){
					$searchbox.searchbox("setValue", value);
				}else if($combobox.length > 0){
					$combobox.combobox("setValue", value);
				}else{
					$td.find('input').val(value);
				}
			}else if($td.find('select').length > 0){
				$td.find('select').val(value);
			}else{
				$td.find('div').text(value);
				if(platform.isEmpty(index)){
					index = obj.attr('datagrid-row-index');
				}
				table.datagrid('getRows')[index][key] = value;
				index = "";
			}
		});
	},

	/**
	 * 子表中通过点击弹出框或其它途径，在点击一个列时，将数据设置到其它列中。
	 * 使用方式
	 * easyui.datagrid.setFieldData(obj,datagrid,{SFYX:[{DM:'1',DMNR:'A'},{DM:'2',DMNR:'B'}]});
	 * 参数一：当前控件
	 * 参数二：datagrid对象 
	 * 参数三：需要填充的列与数据
	 */
	setFieldData:function(obj, table, params){
		if(platform.isEmpty(params)){
			platform.alert("提示信息", "请先设置Filed或Value值", "info");
			return;
		}
		obj = platform.getObject(obj);
		table = platform.getObject(table);
		params = platform.getObject(params);
		var i = 0; 
		while(platform.isEmpty(obj.attr("field"))){
			obj = obj.parent();
			i++;
			if(i == 200) return;
		}
		obj = obj.parent();
		$.each(params, function(key, value){
			var $td = obj.find("td[field='" + key + "']");
			if($td.find('select').length > 0){
				var options = "";
				$(value).each(function(){
					options += "<option value="+ this.DM +">"+ this.DMNR +"</option>";
				});
				$td.find('select').html(options);
			}
		});
	},
	/**
	 * 子表中通过点击弹出框或其它途径，在点击一个列时，得到指定列的值。
	 * 使用方式
	 * easyui.datagrid.getFieldValue(obj,datagrid,"XTBH,XTM,XTDZ");
	 * 参数一：当前控件或index下标
	 * 参数二：datagrid对象 
	 * 参数三：需要得到的列
	 */
	getFieldValue:function(obj, table, params){
		if(platform.isEmpty(params)){
			platform.alert("提示信息", "请先设置需要得到的字段值", "info");
			return;
		}
		table = platform.getObject(table);
		var index = "";
		if(/^[0-9]*$/.test(obj)){
			index = obj;
			obj = table.datagrid("getPanel");
		}else{
			obj = platform.getObject(obj);
			var i = 0; 
			while(platform.isEmpty(obj.attr("field"))){
				obj = obj.parent();
				i++;
				//防止死循环
				if(i == 200) break;
			}
			obj = obj.parent();
			if(obj.length == 0){
				platform.alert("提示信息", "参数一设置有误，请设置datagrid的下标或子表中控件对象。", "info");
				return;
			};
		}
		var values = new Array();
		if(params.indexOf(",") != -1){
			$(params.split(",")).each(function(key, value){
				getValue(index, key);
			});
		}else{
			getValue(index, params);
		}
		
		function getValue(index, params){
			var $td;
			if(platform.isEmpty(index)){
				$td = obj.find("td[field='" + params + "']");
			}else{
				$td = obj.find("tr[datagrid-row-index=" + index + "]>td[field='" + params + "']");
			}
			if($td.length > 1) $td = $($td[0]);
			if($td.find('input').length > 0){
				var $searchbox = $($td.find(".searchbox-f"));
				var $combobox = $($td.find(".combobox-f"));
				if($searchbox.length > 0){
					values.push($searchbox.searchbox("getValue"));
				}else if($combobox.length > 0){
					values.push($combobox.combobox("getValue"));
				}else{
					values.push($td.find('input').val());
				}
			}else{
				values.push($td.find('div').text());
				index = "";
			}
		}
		
		return values;
	},
	 /**
	  * 结束所有项编辑状态
	  * @param table 表格对象
	  */
	 endEdit:function(table){
		table = platform.getObject(table);
	 	var rows = table.datagrid('getRows');
	 	for(var i = 0;i < rows.length; i++){
	 		var editors = table.datagrid('getEditors', i);
	 		$(editors).each(function(index, editor){
	 			//结束编辑时启动验证
	 			if("validatebox" == editor.type){
	 				$(editor.target).validatebox("enableValidation");
	 			}else if("numberbox" == editor.type){
	 				$(editor.target).numberbox("enableValidation");
	 			}else if("combo" == editor.type){
	 				$(editor.target).combo("enableValidation");
	 			}else if("combobox" == editor.type){
	 				$(editor.target).combobox("enableValidation");
	 			}else if("combotree" == editor.type){
	 				$(editor.target).combotree("enableValidation");
	 			}else if("date" == editor.type){
	 				try{
	 					$(editor.target).datebox("enableValidation");
	 				}catch(e){
	 					$(editor.target).datetimebox("enableValidation");
	 				}
	 			}else if("selectText" == editor.type || "select" == editor.type){
	 				$(editor.target).validatebox("enableValidation");
	 			}
	 		});
 			table.datagrid('endEdit',i);
	 	}
	 },	 

	 /**
	  * 当前编辑的索引行
	  */
	 editIndex:undefined,
	 /**
	  * 当前编辑的字段
	  */
	 editField:undefined,
	 /**
	  * 当前编辑的idFeild值
	  */
	 idFieldVal:undefined,
	 /**
	  * 结束单行编辑
	  * 
	  * @param table datagrid表格对象
	  */
	 endEditing:function(table){
		 if (this.editIndex == undefined){return true}
		 if (table.datagrid('validateRow', this.editIndex)){
			 var editor = table.datagrid("getEditor",{index:this.editIndex,field:this.editField});
			 if(platform.isNotEmpty(editor)){
				 var formItems = this.parseTableInfo(table);
				 if(!formItems) return;
				 var datas = "{" + formItems + "data:[{";
				 	datas += this.getIdField(table) + ':"' + this.idFieldVal +'",'
					datas += this.editField + ':"' + editor.target.val() + '"'
					datas += "}]}";
				 platform.ajaxRequest(easyui.datagrid.getActionUrl(), {formItems:datas, methodName:"ajaxUpdate",ajax_dataType:'text'});
			 }
			 table.datagrid('endEdit', this.editIndex);
			 this.editIndex = undefined;
			 return true;
		 } else {
			 return false;
		 }
	 },
	 
	 /**
	  * 编辑单行数据
	  *  @param table datagrid表格对象
	  *  @param index 当前选择的列
	  *  @param field 当前选择的输入框
	  */
	 editCell:function(table, index, field){
		 table = platform.getObject(table);
		 if (easyui.datagrid.endEditing(table)){
			 table.datagrid('selectRow', index).datagrid('editCell', {index:index,field:field});
			 easyui.datagrid.editIndex = index;
			 easyui.datagrid.editField = field;
			 easyui.datagrid.idFieldVal = this.getIdFieldVal(table)
		 }
	 },
	 
	 /**
	 * 验证指定行
	 * @param tableId 表格id、
	 * @param row 行数据
	 * @returns 验证结果
	 */
	validate:function(table,row){
		table = platform.getObject(table);
		var flag = false;
		var rowIndex = table.datagrid('getRowIndex',row);
		flag = table.datagrid('validateRow',rowIndex);
		return flag;
	},
	
	/**
	 * （子表）新增行
	 * @param tableId 表格id或table对象
	 * @param row 行数据（json数组格式）如：{SFYX:1,XTDZ:'addr11'}
	 * @param fn 回调函数
	 */
	add:function(table, row, fn){
		var $table = platform.getObject(table);
		var formItems = this.parseTableInfo($table);
		if(!formItems) return;
		var $options = $table.datagrid("options");
		var defaultJson = eval("({'" + this.addFlag + "':'true'})");
		var index = "";
		if(row){
        	var newJson = $.extend(true, row, defaultJson);
        	$table.datagrid('appendRow', newJson);
			var rows = $table.datagrid('getRows');
			$table.datagrid('selectRow', rows.length - 1);
			$table.datagrid('beginEdit', rows.length - 1);
			index = rows.length - 1;
		}else{
			$table.datagrid('appendRow', defaultJson);
	 		var rows = $table.datagrid('getRows');  
	 		$table.datagrid('selectRow', rows.length - 1);
	 		$table.datagrid('beginEdit', rows.length - 1); 
	 		index = rows.length - 1;
	 	}  
		if($.isFunction(fn)) fn(index);
	},
	
	/**
	 * 还原到上次保存数据后的状态
	 * @param table 表格id或表格对象
	 */
	redo:function(table){
		var $table = platform.getObject(table);
		$table.datagrid("rejectChanges");
	},
	
	/**
	 * （子表）修改行
	 * @param table 表格id或表格对象
	 * @param row 编辑的行数
	 * @param fn 回调函数
	 */
	edit:function(table, row, fn){
		//关闭提示信息
		$(".tip-msg").each(function(){
			platform.hiddenMsg(this);
		});
		var $table = platform.getObject(table);
		var formItems = this.parseTableInfo($table);
		if(!formItems) return;
		var tempIndexs = new Array();
		var rows = $table.datagrid('getSelections');  
		if (rows.length > 0) {
			for(var i = 0;i < rows.length; i++){
				var rowIndex = $table.datagrid('getRowIndex', rows[i]);  
				$table.datagrid('beginEdit', rowIndex);  
				tempIndexs.push(rowIndex);
			}  
		}else{
			var allRows = $table.datagrid('getRows');
			if(allRows.length > 0){
				for(var i = 0;i < allRows.length; i++){
					var rowIndex = $table.datagrid('getRowIndex', allRows[i]);  
					$table.datagrid('beginEdit', rowIndex);
					tempIndexs.push(rowIndex);
					if(platform.isNotEmpty(row)) if(i == row - 1) break;
				}  
			}else{
				platform.msgTip($table.datagrid('getPanel'),{msg:"请先选择编辑行！", level:"info"});
			}
		}
		if($.isFunction(fn)) fn(tempIndexs);
	},
	
	/**
	 * 弹出编辑页面
	 * @param table 表格对象
	 * @param fn 回调方法
	 */
	openEdit:function(table){
		table = platform.getObject(table);
		var result = this.getIdFieldVal(table);
		if(!result){
			platform.msgTip(table.datagrid('getPanel'),{msg:"请先选择编辑行！", level:"info"});
			return;
		}
		if($.isFunction(arguments[1])){
			arguments[1](result);
		}
	},
	
	/**
	 * （子表）保存数据
	 * @param table 表格id或表格对象
	 * @param fn 回调方法
	 * @param actionUrl 自定义保存的URL
	 */
	save:function(table, fn, actionUrl){
		//关闭所有提示信息
		$(".tip-msg").each(function(){
			platform.hiddenMsg(this);
		});
		var $table = platform.getObject(table);
		var selecteds = $table.datagrid("getSelections");
		actionUrl = platform.isEmpty(actionUrl) ? easyui.datagrid.getActionUrl() : actionUrl;
		this.endEdit($table);
		var changes = $table.datagrid('getChanges'), chgLen = changes.length, rowIndexs = new Array();
		if(chgLen){
			var formItems = this.parseTableInfo($table);
			if(!formItems) return;
			var begin = "{" + formItems + "data:[";
			var inserts = begin,updates = begin,insert = false,update = false, isValid = true, insertChanges = new Array();
			for(var i = 0;i < changes.length; i++){
				var change = changes[i];
				if(!this.validate($table,change)){
					isValid = false;
					continue;
				}
				var add_flag = change[this.addFlag];
				try{
					var rowIndex = $table.datagrid("getRowIndex",change);
					rowIndexs.push(rowIndex);
					if(add_flag == "true"){
						insert = true, change[this.addFlag] = "false";
						insertChanges.push(change);
						change["rowIndex"] = rowIndex;
						change = JSON.stringify(change);
						inserts += change + ",";
					}else{
						update = true;
						change = JSON.stringify(change);
						updates += change + ",";
					}
				}catch(e){
					change[this.addFlag] = "true";
					continue;
				}
			}
			//if(isValid) rollback();
			var end = "]}";
			var formResult = "", formResultObj = "";
			if(insert){
				inserts = inserts.substring(0,inserts.length - 1); inserts += end;
				formResult = platform.ajaxRequest(actionUrl, {formItems:inserts, methodName:"ajaxInsert",ajax_dataType:'text'});
				if(formResult.startWith("e")) formResult = formResult.substring(1);
				var formResultObj = new FormResult(formResult);
				if("exception" == formResultObj.operateResult){
					$(insertChanges).each(function(index, data){
						data[easyui.datagrid.addFlag] = "true";
					});
					rollback();
					//提示异常信息
					platform.msgTip($table.datagrid('getPanel'), {msg:formResultObj.exStack, level:"exception"});
					return;
				}
				
				var idField = easyui.datagrid.getIdField($table);
				var $operateResult = $(formResultObj['data']);
				$operateResult.each(function(index,data){
             		var $data = $operateResult[index], rowIndex = $data["rowIndex"];
             		var row = $table.datagrid('getRows')[rowIndex];
             		var $dataBH = $data['bh'];
             		for(var field in $dataBH){
             			row[field] = $dataBH[field];
             		}
             		//row[idField] = $dataBH[idField];
             		//$table.datagrid('updateRow',{index:rowIndex,row:row});
                 	//$table.datagrid('refreshRow',rowIndex);
             	});
				successMsg(fn);
			}
			if(update) {
				updates = updates.substring(0,updates.length - 1); updates += end;
				formResult = platform.ajaxRequest(actionUrl, {formItems:updates, methodName:"ajaxUpdate",ajax_dataType:'text'});
				if(formResult.startWith("e")) formResult = formResult.substring(1);
				var formResultObj = new FormResult(formResult);
				if("exception" == formResultObj.operateResult){
					rollback();
					//提示异常信息
					platform.msgTip($table.datagrid('getPanel'), {msg:formResultObj.exStack, level:"exception"});
					return;
				}
				successMsg(fn);
			}
			$table.datagrid("acceptChanges");
		}
		/*else{
			platform.msgTip($table.datagrid('getPanel'),{msg:"数据无变化！", level:"info"});
		}*/
		//将选中的数据还原为选中模式
		$(selecteds).each(function(index, row){
			$table.datagrid("selectRow",$table.datagrid("getRowIndex", row));
		});
		
		/**
		 * 回滚错误的数据，此方法不对外使用
		 */
		function rollback(){
			//将错误的数据还原编辑状态
			$(rowIndexs).each(function(index, data){
				$table.datagrid('beginEdit', data);
			});
		}
		
		/**
		 * 保存成功的提示信息
		 */
		function successMsg(fn){
			formResultObj.message = "数据保存成功!";
			platform.msgTip($table.datagrid('getPanel'), {msg:formResultObj.message});
			//调用回调函数
			if($.isFunction(fn)) fn();
		}
	},
	
	 /**
	 * datagird 删除所有选中行
	 * @param table 表格id或表格对象
	 * @param fn 回调方法
	 * @param actionUrl 自定义删除的URL
	 */
	del:function(table, fn, actionUrl){
		$table = platform.getObject(table);
		var formItems = this.parseTableInfo($table);
		if(!formItems) return;
		actionUrl = platform.isEmpty(actionUrl) ? easyui.datagrid.getActionUrl() : actionUrl;
		var idField = this.getIdField($table);
		if(idField){
			var selRows = $table.datagrid('getSelecteds'), selRowLength = selRows.length;
			if(selRowLength > 0){
				Layer.showConfirm('是否确定删除选定记录?',function(r){
					if(r){
						var formItems = easyui.datagrid.parseTableInfo($table);
						if(!formItems) return;
						var begin = "{" + formItems + "data:[";
						var deletes = begin,del = false;
						for(var i = 0;i < selRowLength; i++){
							var change = selRows[i];
							if(change[easyui.datagrid.addFlag] == 'true'){
								$table.datagrid('deleteRow', $table.datagrid("getRowIndex",change));
							}else{
								del = true;
								change["rowIndex"] = $table.datagrid("getRowIndex",change);
								change = JSON.stringify(change);
								deletes += change + ",";
							}
						}
						var end = "]}";
						if(del){
							deletes = deletes.substring(0,deletes.length - 1); deletes += end;
							var formResult = platform.ajaxRequest(actionUrl, {formItems:deletes, methodName:"ajaxDelete",ajax_dataType:'text'});
							if(formResult.startWith("e")) formResult = formResult.substring(1);
							var formResultObj = new FormResult(formResult);
							if("exception" == formResultObj.operateResult) {
								//提示异常信息
								platform.msgTip($table.datagrid('getPanel'), {msg:formResultObj.exStack, level:"exception"});
								return;
							}
							deletes = eval("(" + deletes + ")");
							var datas = deletes["data"];
							var idField = easyui.datagrid.getIdField($table);
							$(datas).each(function(index,data){
								var rowIndex = $table.datagrid("getRowIndex",data[idField]);
								if(rowIndex > -1){
									$table.datagrid('deleteRow', rowIndex);
								}
							});
							formResultObj.message = "数据删除成功!";
							platform.msgTip($table.datagrid('getPanel'), {msg:formResultObj.message});
							//$table.datagrid("acceptChanges");
							if($.isFunction(fn)) fn();
						}
					}
					Layer.closeLayer(r);
				});
			}else{
				platform.msgTip($table.datagrid('getPanel'),{msg:"请先选择删除行！", level:"info"});
			}
		}else{
			/*platform.alert('错误','datagrid未配置idField属性值','error');*/
			Layer.showAlert('datagrid未配置idField属性值');
		}
	},
	
	 /**
	  * @private
	  * datagird 解析表名、主键、外键、主键生成策略等信息， 此方法不对外使用
	  * @param formItems 提交的表单数据项
	  * @returns 返回表单的数据项目
	  */
	 parseTableInfo:function(table){
		var formItems = "";
		var $options = table.datagrid("options");
		var tableInfo = $options.tableInfo;
      	if(tableInfo){
      		formItems += ('tableInfo:' + tableInfo + ',');
      	}else{
      		platform.alert('错误',"请确认tableInfo信息是否填写！","error");   
      		return false;
      	}
      	return formItems;
	 },
	 
	 /**
	 * 得到cookie中查询条件是否收缩
	 * @param buttonId  查询按钮所在的元素Id
	 * @param gridId 对应的表格id号，格式是:#+元素id号
	 * @param isClose 是否显示搜索条件，true为不显示
	 */
	 cookieQuery:function(buttonId,gridId,isClose){
		 var href = location.href;
		 href = href.indexOf("?") != -1 ? href.substring(0, href.indexOf("?")):href;
		 var cookieName = href + buttonId + gridId;
		 var iconCls = isClose ? 'icon-arrow-close' : 'icon-arrow-open';
		 var cookieCls = platform.isEmpty(platform.localStorage.getItem(cookieName)) ? iconCls : platform.localStorage.getItem(cookieName);
		 var triggleTb = platform.getObject(buttonId), triggleGrid = platform.getObject(gridId);
		 var iconCls=triggleTb.linkbutton('options').iconCls;
		 triggleTb.linkbutton({   
			 iconCls: cookieCls
		 });  
		 this.shrinkQuery(buttonId, gridId);
	 },

	 /**
	 * 把查询条件收缩
	 * @param buttonId 查询按钮所在的元素Id
	 * @param gridId 对应的表格id号，格式是:#+元素id号
	 */
	 shrinkQuery:function(buttonId,gridId){
		 var triggleTb = platform.getObject(buttonId), triggleGrid = platform.getObject(gridId);
		 var closeCls = 'icon-arrow-close', openCls = 'icon-arrow-open';
		 var iconCls = triggleTb.linkbutton('options').iconCls;
		 var href = location.href;
		 href = href.indexOf("?") != -1 ? href.substring(0, href.indexOf("?")):href;
		 var cookieName = href + buttonId + gridId;
		 triggleTb.linkbutton({   
			 iconCls: iconCls == closeCls ? openCls : closeCls
		 });  
		 var toolbar = $(triggleGrid.datagrid('options').toolbar).find("form");
		 if(iconCls == closeCls){
			 toolbar.css("display","none");
		 }else{
			 toolbar.css("display","block");
		 }
		 platform.localStorage.setItem(cookieName, iconCls);
		 triggleGrid.datagrid('resize');
	 },
	 
	 /**
	  * 分页标签显示样式2
	  * 
	  */
	 page2:function(datagrid){
		 datagrid = platform.getObject(datagrid);
		 var p = datagrid.datagrid('getPager'); 
		 $(p).pagination({
			layout:['sep','first','prev','next','last','refresh']
		 });
	 },
	 
	 /**
	  * 分页标签显示样式3
	  * 
	  */
	 page3:function(datagrid){
		 datagrid = platform.getObject(datagrid);
		 var p = datagrid.datagrid('getPager'); 
		 $(p).pagination({
			 layout:['sep','first','prev','next','last']
		 });
	 },
	 
	 /**
	  * 调用的方法 保存拖动后的位置,tabs中布局专用，
	  * 	因为在tabs中布局tabs会将布局的页面重新设置大小，导致cookie中保存的数据被替换
	  * @param layout 布局对象，默认参数为'body',如果页面中有多个布局需要传入。参数中将多个布局用","分开，
	  * 	如:"#layout_1,div[name=layout_2]"，jQuery支持参取到此对象即可
	  */
	layoutCookie:function(layout){
		this.getLayoutCookie(layout);
		this.setLayoutCookie(layout);
	},
	 
	 /**
	  * @private
	 * 功能：保存有哪些布局加入到cookie中
	 */
	cookieFlags:{}, 
	/**
	 * @private
	 * 功能：保存拖动后的位置,tabs中布局专用，因为在tabs中布局tabs会将布局的页面重新设置大小，
	 * 		导致cookie中保存的数据被替换， 此方法不对外使用
	 * @param eleForm：表单的id号，格式：#+元素id号, 或对象
	 */
	setLayoutCookie:function(layout){
		layout = platform.isNotEmpty(layout)?layout:'body';
		layout = platform.getObject(layout);
		if(layout.length > 1){
			layout.each(function(index, value){
				setDataAndEvent(value);
			});
		}else setDataAndEvent(layout);
		
		/**
		 * 设置cookieFlags的数据并且给layout设置onResize事件，此方法不对外使用
		 * @param layout 布局对象
		 */
		function setDataAndEvent(layout){
			var tempLayout = platform.getObject(layout);
			var cookieFlags = eval('({"' + layout + '":true})');
			easyui.datagrid.cookieFlags = $.extend(easyui.datagrid.cookieFlags, cookieFlags);
			tempLayout.layout("panel","center").panel({
				onResize:function(){easyui.datagrid.cookieLayout(layout)}
			});
		}
	},
	
	 /**
	  * @private
	 * 功能：保存拖动后的位置， 此方法不对外使用
	 * @param layout：布局对象，格式：#+元素id号, 或对象
	 */
	cookieLayout:function(layout){
		var flag = false;
		if(!this.cookieFlags[layout])  flag = true;
		var $layout = platform.getObject(layout), options;
		var href = location.href;
		href = href.indexOf("?") != -1 ? href.substring(0, href.indexOf("?")):href;
		var cookieWidthName = href + layout, cookieHeightName = href + layout, cookieWidth, cookieHeight;
		var east = "east", south = "south", west = "west", north = "north";
		var currentWidth, currentHeight, width, height;
		if($layout.layout('panel', east).length > 0){
			saveCookie(east, flag);
		}
		if($layout.layout('panel', south).length > 0){
			saveCookie(south, flag);
		}
		if($layout.layout('panel', west).length > 0){
			saveCookie(west, flag);
		}
		if($layout.layout('panel', north).length > 0){
			saveCookie(north, flag);
		}
		
		function saveCookie(param, flag){
			options = $layout.layout('panel', param).panel('options');
			currentWidth = options.width, currentHeight = options.height;
			cookieWidthName += "-" + param + "-width", cookieHeightName += "-" + param + "-height";
			cookieWidth = platform.localStorage.getItem(cookieWidthName), cookieHeight = platform.localStorage.getItem(cookieHeightName);
			if(flag){
				width = platform.isNotEmpty(cookieWidth) ? cookieWidth : currentWidth;
				height = platform.isNotEmpty(cookieHeight) ? cookieHeight : currentHeight;
			}else{
				width = currentWidth, height = currentHeight;
			}
			platform.localStorage.setItem(cookieWidthName, width);platform.localStorage.setItem(cookieHeightName, height);
		}
	},
	
	/**
	 * @private
	 * 功能：从cookie中取出上次拖动的位置， 此方法不对外使用
	 * @param layout：布局对象，格式：#+元素id号, 或对象
	 */
	getLayoutCookie:function(layout){
		layout = platform.isNotEmpty(layout)?layout:'body';
		layout = platform.getObject(layout);
		if(layout.length > 1){
			layout.each(function(index, value){
				getResizeCookie(value);
			});
		}else getResizeCookie(layout);
		try{$('body').layout('resize');}catch(e){}
		
		function getResizeCookie(layout){
			var $layout = platform.getObject(layout);
			var href = location.href;
			href = href.indexOf("?") != -1 ? href.substring(0, href.indexOf("?")):href;
			var cookieWidthName = href + layout, cookieHeightName = href + layout;
			var east = "east", south = "south", west = "west", north = "north";
			if($layout.layout('panel', east).length > 0){
				getCookieToResize(east);
			}
			if($layout.layout('panel', south).length > 0){
				getCookieToResize(south);
			}
			if($layout.layout('panel', west).length > 0){
				getCookieToResize(west);
			}
			if($layout.layout('panel', north).length > 0){
				getCookieToResize(north);
			}
			
			function getCookieToResize(param){
				cookieWidthName += "-" + param + "-width", cookieHeightName += "-" + param + "-height";
				cookieWidth = platform.localStorage.getItem(cookieWidthName); cookieHeight = platform.localStorage.getItem(cookieHeightName);
				$layout.layout('panel',param).panel('resize',{width:cookieWidth, height:cookieHeight});
			}
		}
	},
	
	/**
	 * 清除当前页面的cookie，将指定页面初始化，还原页面布局
	 */
	reductionLayout:function(){
		var href = location.href;
		href = href.indexOf("?") != -1 ? href.substring(0, href.indexOf("?")):href;
		//获取本地所有的键值对
		var storage = window.localStorage;
		var removeKeys = new Array();
		//循环显示localStorage里的键值对
		for(var i = 0; i < storage.length; i++){
			//key(i)获得相应的键
			var key = storage.key(i);
			//删除以当前路径开始命名的键
			if(key.startWith(href)){
				removeKeys.push(key);
			}
		}
		for(var i = 0; i < removeKeys.length; i++){
			storage.removeItem(removeKeys[i]);
		}
		window.location.reload();
	},
	
	 /**
   	  * 加载表格数据 载入并显示第一页的记录
      * @param loadGrid 表格元素，格式是:#+元素id号或对象
      * @param fn 回调方法
	 */
	 loadGrid:function(loadGrid){
		loadGrid = platform.getObject(loadGrid);
		loadGrid.datagrid('clearSelections');
		var queryForm = $(loadGrid.datagrid('options').toolbar).find("form");
		queryForm.form("enableValidation");	
		if(!queryForm.form("validate")) return;
		loadGrid.datagrid("load", platform.queryParams(queryForm));
		if($.isFunction(arguments[1])) arguments[1]();
	 },
	
	 /**
	 * 启动编辑行并且通过表达式将计算结果存放于指令的field中
	 * 
	 * @param datagrid 操作datagrid表格对象
	 * @param replaceStr 计算需要的表达式 如：{0}+{1}
	 * @param fields 需要计算的字段名 如:FIELD1,FIELD2
	 * @param resultField 计算结果所在的字段名, 如：FIELD3
	 */
	 editAndCalc:function(datagrid, replaceStr, fields, resultField){
		 datagrid = platform.getObject(datagrid);
		 easyui.datagrid.edit(datagrid);
		 var selections = datagrid.datagrid("getSelections");
		 if(selections.length > 1){
			 $(selections).each(function(){
				 var rowIndex = datagrid.datagrid("getRowIndex", this);
				 calc(fields, replaceStr, rowIndex, resultField);
			 });
		 }else{
			 var rowIndex = datagrid.datagrid("getRowIndex", selections[0]);
			 calc(fields, replaceStr, rowIndex, resultField);
		 }
		 
		 //循环添加计算
		 function calc(fields, replaceStr, rowIndex, resultField){
			 resultField = datagrid.datagrid('getEditor', {index:rowIndex, field:resultField});
			 fields = fields.split(",");
			 var editorTargets = new Array();
			 $(fields).each(function(index, data){
				 var editor = datagrid.datagrid('getEditor', {index:rowIndex, field:data});
				 editorTargets.push(editor.target);
				 editor.target.bind('change', function(){   
					 var str = new Array();
					 $(editorTargets).each(function(){
						 str.push($(this).val());
					 });
					 var result = eval(replaceStr.format(str));
					 resultField.target.val(result);
				 });   
			 });
		 }
	 }
};

/**
 * 操作easyUI treegrid的一些方法 
 * @namespace
 */
easyui.treegrid={
	/**
   	  * 加载表格数据 载入并显示第一页的记录
      * @param loadGrid 表格元素，格式是:#+元素id号或对象
      * @param fn 回调方法
	 */
	 loadGrid:function(loadGrid){
		loadGrid = platform.getObject(loadGrid);
		loadGrid.treegrid('clearSelections');
		var queryForm = $(loadGrid.datagrid('options').toolbar).find("form");
		queryForm.form("enableValidation");	
		if(!queryForm.form("validate")) return;
		loadGrid.treegrid("load", platform.queryParams(queryForm));
		if($.isFunction(arguments[1])) arguments[1]();
	 }
}

/**
 * 操作easyUI tabs的一些方法 
 * @namespace
 */
easyui.tabs={
		
	 /**
	 * tabs 刷新指定which卡片
	 * @param obj 选项卡对象
	 * @param param 此参数有两种写法，当所有tabs选项卡所需要的参数一致，可以通过直接传参数的方式，如代码一所示。
	 * 				如果有选项卡参数不一致时，不同的选项卡需要传不同的参数时，可通过index属性对应选项卡位置，位置从0开始，
	 * 				param属性代表所要传的参数，如代码二所示
	 * 				代码一：easyui.tabs.refresh("#down","XZQHDM="+xzqhdm);
	 * 				代码二：easyui.tabs.refresh("#down",[{index:0,param:"XZQHDM="+xzqhdm}]);
	 * @param basicUrl 初始化路径 
	 * 
	 */
	refresh:function(obj, param){
		obj = platform.getObject(obj);
		try{obj.tabs("options");}catch(e){obj.tabs();}
		if(param instanceof Object){
			$(param).each(function(index,data){
				var index = data["index"];
				var param = data["param"];
				var tab = obj.tabs('getTab',index);
				refreshTab(tab, param);
			});
		}else{
			var tabs = $(obj).tabs("tabs");
			$(tabs).each(function(index,value){
				var tab = obj.tabs('getTab',index);
				refreshTab(tab, param);
			});
		}
		
		function refreshTab(tempTab,param){
			var basicUrl = tempTab.panel('options').basicUrl;
			if (platform.isNotEmpty(basicUrl)) {/*说明tab是以href方式引入的目标页面*/
				tempTab.panel('refresh',platform.appendAddr(basicUrl,param));
			}else{/*说明tab是以content方式引入的目标页面*/
				var panel = tempTab.panel('panel');
				var frame = panel.find('iframe');
				try {
					if (frame.length > 0) {
						for ( var i = 0; i < frame.length; i++) {
							var url = $(frame[i]).attr("basicUrl");
							frame[i].src = platform.appendAddr(url,param);
						}
					}
				} catch (e) {
				}
			}
		}
	},
	
	/**
	 * 得到指定tabs当前选中的选项卡索引
	 * @param tabs 当前选项卡
	 * @return 当前选中的选项卡索引
	 */
	getSelectIndex:function(tabs){
		tabs = platform.getObject(tabs);
		return tabs.tabs('getTabIndex',tabs.tabs('getSelected'));
	},
	
	/**
	 * 启用选项卡
	 * @param obj 当前选项卡
	 * @param parent 是否为父页面，可取值 window.parent 等。
	 * @return 当前选中的选项卡索引
	 */
	enableTab: function(obj,parent){
		if(parent){
			parent.easyui.tabs.enableTab(obj);
		}else{
			obj = obj || "#tabs";
			var $tabs = platform.getObject(obj);
			try{
				var tabs = $tabs.tabs("tabs");
				for(var i = 0;i < tabs.length;i++){
					$("#tabs").tabs("enableTab",i);
				}
			}catch(e){
				this.enableTab(obj, window.parent);
			}
		}
	},
	
	/**
	 * 禁用选项卡
	 * @param obj 当前选项卡
	 * @param parent 是否为父页面，可取值 window.parent 等。
	 * @return 当前选中的选项卡索引
	 */
	disableTab: function(obj,parent){
		if(parent){
			parent.easyui.tabs.disableTab(obj);
		}else{
			obj = obj || "#tabs";
			var $tabs = platform.getObject(obj);
			try{
				var tabs = $tabs.tabs("tabs");
				for(var i = 0;i < tabs.length;i++){
					if(i == 0) continue;
					$("#tabs").tabs("disableTab",i);
				}
			}catch(e){
				this.disableTab(obj, window.parent);
			}
		}
	}
};

/**
 * 操作easyUI panel的一些方法 
 * @namespace
 */
easyui.panel={
	/**
	 * 刷新指定panel
	 * 
	 * @param obj 选项卡对象
	 * @param path 刷新页面的路径
	 * @param param 刷新页面的参数
	 * 
	 */
	refresh:function(obj,path,param){
		obj = platform.getObject(obj);
		if(platform.isNotEmpty(path)){
			obj.panel("refresh", platform.appendAddr(path, param));
			return;
		}
		var basicUrl = obj.panel("options").basicUrl;
		if(platform.isNotEmpty(basicUrl)){
			obj.panel("refresh", platform.appendAddr(basicUrl, param));
		}
	}
}

/**
 * 操作easyUI layout的一些方法 
 * @namespace
 */
easyui.layout={
	/**
	 * 收缩指定的面板
	 * 
	 * @param obj 布局对象
	 * @param region 布局面板位置
	 * @param title 收缩后的标题
	 * @param iconCls 收缩后的图标样式
	 * 
	 */
	collapse: function(obj,region,title,iconCls){
		obj = obj || "body";
		obj = platform.getObject(obj);
		region = region || "west";
		
		var regionPanel = obj.layout("panel",region);
		var opts = regionPanel.panel("options");
		if(title != undefined)  regionPanel.panel("setTitle",title);
		if(iconCls != undefined) opts.iconCls = iconCls;
		obj.layout("collapse",region);
	},

	/**
	 * 展开指定的面板
	 * 
	 * @param obj 布局对象
	 * @param region 布局面板位置
	 * @param title 展开后的标题
	 * @param iconCls 展开后的图标样式
	 * 
	 */
	expand: function(obj,region,title,iconCls){
		obj = obj || "body";
		obj = platform.getObject(obj);
		region = region || "west";
		
		var regionPanel = obj.layout("panel",region);
		var param = {};
		if(title != undefined) param.title = title;
		if(iconCls != undefined) param.iconCls = iconCls;
		if((title != undefined) || (iconCls != undefined)){
			regionPanel.panel(param);
		}
		obj.layout("expand",region);
	}
}