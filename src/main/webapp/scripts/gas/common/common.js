var gas = {
		
	/**
	 * 保存图片收藏的方法
	 */	
	imgCollect:function (param){
		Layer.openDialog("图片收藏",ctx+"/gas/imgCollect/imgCollectConfig.jsp?URL="+param.URL,500,300)
	},	
	/**
	 * 判断object/json是否为空
	 */	
	isEmptyObject:function (obj){
			var t;  
			for (t in obj)  
				return false;  
			return true; 
	},
	/**
	 * 内部跳转
	 * @param frmWindow  主iframe对象所在页面window对象如：window.parent
	 * @returns url 跳转路径
	 */
	innerSkip:function(frmWindow,url){
		frmWindow.location.href=power.appendAddr(url,"1=1");
	},
	/**
	* 用于判断是否有效，常用于datagrid中的formatter
	*/
	formatJudge : function(val,row){
		if(val == '1'){
			return '<img src="'+ctx+'/scripts/plugin/jquery-easyui/themes/'+skin+'/icons/ok.png"/>';
		}else if(val == '0'){
			return '<img src="'+ctx+'/scripts/plugin/jquery-easyui/themes/'+skin+'/icons/no.png"/>';
		}else{
			return '<img src="'+ctx+'/scripts/plugin/jquery-easyui/themes/'+skin+'/icons/no.png"/>';
		}
	 },
	 /**
	  * 格式化日期格式
	  * 返回 yyyy-MM-dd HH时
	  */
	 dateFormat : function (value,row,index){
			var year = value.year+1900;
			var month = (value.month+1) > 9 ? (value.month+1):'0'+(value.month+1);
			var date = value.date > 9 ? value.date : '0'+value.date;
			var hour = value.hours > 9 ?value.hours:'0'+value.hours;
			return year+'-'+month+'-'+date+' '+hour+'时';
			
	},
	 formatJudgeWrd : function(val,row){
		var imgs = "";
		if(val == '1'){
			imgs = "<img src='"+ctx+"/scripts/plugin/jquery-easyui/themes/"+skin+"/icons/ok.png'/>";
			//imgs = imgs + "<span style='cursor: pointer;font-size:16px;margin-left: 5px;' onclick=\"load('" + row.YBCSRQ +"','" + row.YBXH + "');\"><i class='fa fa-file-word-o spanBtn_w'></i></span>";
			imgs = imgs + "<img onclick=\"load('" + row.YBCSRQ +"','" + row.YBXH + "');\" style='cursor: pointer;margin-left: 5px;' src='"+ctx+"/scripts/plugin/jquery-easyui/themes/"+skin+"/icons/word.png'/>";
		}else if(val == '0'){
			imgs = "<img src='"+ctx+"/scripts/plugin/jquery-easyui/themes/"+skin+"/icons/no.png'/>";
		}else{
			imgs = "<img src='"+ctx+"/scripts/plugin/jquery-easyui/themes/"+skin+"/icons/no.png'/>";
		}
		return imgs;
	 },
	/**
	* 初始化dialog
	* @param params 初始化dialog所需要的参数,参数为JSON格式，参数可参考dailog API
	*				如：{basicUrl:'${ctx}/pages/platform/layout/demo/edit.jsp?gridID=ldDatagrid',title:'行政区划信息'}
	*/
	dialogId : "",
	
	initDialog : function(params){
		dialogId = power.UUID();
		$("<div id='"+ dialogId +"' style='display:none;overflow: hidden;'></div>").appendTo("body");
		$("#"+ dialogId).dialog(params).dialog("minimize");
		return dialogId;
	},
	 
	
	/**
	* 操作dialog，新增或编辑
	* @param oper 操作 add or edit
	* @param params 新增或编辑需要的参数，参数为JSON格式，
	*		如：{datagrid:'#datagrid',panel:'#panel',basicUrl:'${ctx}/pages/platform/demo.jsp',param:'YHMC=SYSTEM'}
	*		参数 datagrid: 	代表添加时需要清空选择的datagrid表格
	*			basicUrl： 	代表基本路径
	*			param:		代表连接时需要的参数
	*			panel: 		需要操作的面板
	*/
	operDialog : function(oper, params){
		if(power.isEmpty(params)) params = {};
		var panel = power.isNotEmpty(params.panel) ? "#" + params.panel : "#" + gas.dialogId;
		try{$(panel).dialog("open");}catch(e){}
		gas.operPanel(oper, $.extend(params, {panel:panel}));
	},
	 
	/**
	* 操作panel，新增或编辑
	* @param oper 操作 add or edit
	* @param params 新增或编辑需要的参数，参数为JSON格式，
	*		如：{datagrid:'#datagrid',panel:'#panel',basicUrl:'${ctx}/pages/platform/demo.jsp',param:'YHMC=SYSTEM'}
	*		参数 datagrid: 	代表添加时需要清空选择的datagrid表格
	*			basicUrl： 	代表基本路径
	*			param:		代表连接时需要的参数
	*			panel: 		需要操作的面板
	*/
	operPanel : function(oper, params){
		if(power.isNotEmpty(params)){
			var $panel = params.panel;
			$panel = power.getObject($panel);
			var path = $panel.panel("options").basicUrl;
			path = power.isEmpty(path) ? params.basicUrl : path;
			var $table = params.datagrid, param = params.param;
			if("add" == oper){
				$table = power.getObject($table);
				$table.datagrid("clearSelections");
				$panel.panel("refresh", power.appendAddr(path, param));
			}else if("edit" == oper){
				$panel.panel("refresh", power.appendAddr(path, param));
			}else{
				$panel.panel("refresh", power.appendAddr(path, param));
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
	 */
	ajaxRequest:function(requestURL,requestEntity){
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
			//进行ajax调用
			$.ajax({   
				        url      : requestURL,  
				        type     : requestType,
				        async    : requestAsync,
				        data     : requestEntity,
				        dataType : requestDataType,
				        success	 : function(data){
				        			//回调函数调用
				        			if(power.isNotEmpty(requestEntity.callBackFun)){
				        				eval( "var callBackFun = " + requestEntity.callBackFun );
					        			if($.isFunction(callBackFun)){
					        				if(power.isEmpty(requestEntity.callBackParams)){
					        					callBackFun(data);
					        				}else{
					        					callBackFun(data,requestEntity.callBackParams);
					        				}
					        			}
				        			}
				        			backEntity = data;
				        		},      
				        error: function(date){
				        			throw new Error("进行AJAX请求[" + requestURL + "]出错[" + date + "]!");
								}
				    });   
			return backEntity;  
		 }catch(e){
			power.alert("错误", e.message, "error");
		 	throw new Error(e.message);  
		 }
	},
	//格式化预报员
	formatYby : function(value){
		var data = "";
		var html = "";
		if(power.isNotEmpty(value)){
			var val = value.split("&");
			data += val[0];
			if("ZB" == val[1]){
				html = "(<span style='font-size:10px;color:blue;'>主班</span>)";
			}else if("FB" == val[1]){
				html = "(<span style='font-size:10px;color:green;'>副班</span>)";
			}else if("YBY" == val[1]){
				html = "";
			}
			data = data + html;
		}
		return data;
	},
	/**
	* 刷新缓存
	* @method refreshCache
	* @param {Object} obj jquery对象 提示信息显示位置
	* @param {String} url 请求地址
	* @return
	*/
	refreshCache:function(jq,url){
		$.messager.progress({text : "正在努力的刷新缓存，请稍候..."});
    	$.ajax({
    		url: url,
    		dataType:'json',
    		success:function(data){
    			$.messager.progress("close");
    			Layer.showSucAlert("刷新缓存成功！");
    			/*power.msgTip(jq,{msg:'刷新缓存成功！', level:"info"});
    			*/
    		},
    		error:function(){
    			$.messager.progress("close");
    			Layer.showFailAlert("刷新缓存失败！");
    			/*power.msgTip(jq,{msg:'刷新缓存失败！', level:"fail"});	
    			*/
    		}
    	});
	},
	/**
	* 空气质量颜色
	* @method formatColor
	* @param {String} val 空气质量颜色
	* @param {Object} row 行数据
	* @return {url} 颜色对应的路径
	*/
	formatColor:function(val,row){
		if(val == '绿色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/green.png'/>";
		}else if(val == '黄色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/yellow.png'/>";
		}else if(val == '橙色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/orange.png'/>";
		}else if(val == '红色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/red.png'/>";
		}else if(val == '紫色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/purple.png'/>";
		}else if(val == '褐红色'){
			return "<img src='"+ctx+"/skins/default/images/gas/common/aqicolor/maroon.png'/>";
		}
	},
	/**
	* 空气质量级别
	*/
	formatJB:function(val,row){
		if(val == '1'){
			return "一级";
		}else if(val == '2'){
			return "二级";
		}else if(val == '3'){
			return "三级";
		}else if(val == '4'){
			return "四级";
		}else if(val == '5'){
			return "五级";
		}else if(val == '6'){
			return "六级";
		}
	},

	/**
	 * 格式化子表显示数据
	 * @param value 字段值。
	 * @param rowData 行记录数据。
	 * @param rowIndex 行索引。 
	 * @returns 返回格式化后显示的值
	 */
	formatDatagrid:function(value,rowData,rowIndex){
		var $this = $(this), $thisEditor = $this[0]["editor"];
		var $thisOptions = $thisEditor["options"];
		var $data = "";
		var type = $thisEditor.type;
		$thisOptions = $thisOptions || {};
		if("date" == type){
			var fmt = $thisOptions.fmt || "yyyy-MM-dd";
			if(power.isNotEmpty(value)){
				if(typeof value == "object"){
					value = power.dateFormat(new Date(value.time), fmt);
				}
			} 
			return value;
		}else if("combobox" == type || "select" == type){
			$data = $($thisOptions["data"]);
			if(!(typeof(value) == 'string')){
				value = value.toString();
			}
			var text; 
			//下拉多选
			var values = value.split(",");
			if(values.length>1){
				text = "";
				$data.each(function(){
					if($.inArray(this['DM'],values)!=-1){
						text = text + ',' + this['DMNR'];
					}
				});
				text = text.substring(1,text.length);
			}else{
				$data.each(function(){
					if(this['DM'] == value){
						text = this['DMNR'];
					}
				});
			}
			return text;
		}
	},
	/**
	* 格式化数据显示 ，当为空或为0时默认展示为“-”
	* @method formatNum
	* @param {String} val 单元格数据
	* @param {Object} row 行数据
	* @return  格式化数据
	*/
	formatNum:function(val,row){
		if(val == 0 || power.isEmpty(val)){
			return '-';
		}else{
			return val;
		}
	},
	/**
	* dataGrid没有数据加载提示信息
	* @method noDataMessage
	* @param {Object} datagrid jquery对象
	* @param {Object} data 返回的js数据
	*/
	noDataMessage:function(datagrid,data){
	    if(!(($.isArray(data) && data.length > 0) || (data.rows && data.rows.length > 0))){
			var panel = datagrid.datagrid("getPanel");
			var html = "<div style=\"font-size: 14px;color:gray;\"><img src='"+ctx+"/skins/"+skin+"/images/gas/common/nodata.png'></img>&nbsp;没有数据</div>";
			panel.find(".datagrid-row").first().html("");
			panel.find(".datagrid-body").eq(1).css({textAlign:'center'}).html(html);
	    }
	},
	/**
	* dataGrid没有数据加载提示信息(改进)
	* @method noDataMessage
	* @param {Object} datagrid jquery对象
	* @param {Object} data 返回的js数据
	* @param {Object} msg 提示信息
	*/
	noDataMessageEx:function(datagrid,data,msg){
	    if(!(($.isArray(data) && data.length > 0) || (data.rows && data.rows.length > 0))){
			var panel = datagrid.datagrid("getPanel");
			var html = "<div style=\"font-size: 14px;color:gray;\"><img src='"+ctx+"/skins/"+skin+"/images/gas/nodata.png'></img>&nbsp;"+msg+"</div>";
			panel.find(".datagrid-row").first().html("");
			panel.find(".datagrid-body").eq(1).css({textAlign:'center'}).html(html);
	    }
	},
	/**
	* 改变datagrid分页工具栏的方法
	* @method changeToolbar
	* @param {String} datagrid '#datagrid'或jquery对象
	*/
	changeToolbar:function(datagrid){
	 	var toolbarObj = $($(datagrid).datagrid("options").toolbar).get(0);
		if(power.isNotEmpty(toolbarObj)){
			var pagerObj = $(datagrid).datagrid("getPager").get(0);
			$(pagerObj).before(toolbarObj);
		}
	},
	/**
	* 重置密码
	* @method resetPassWord
	* @param {String} url ajax请求地址
	* @param {String} yhid 用户id
	*/
	resetPassWord:function(url,yhid){
		$.messager.confirm('确认','确认要重置该用户的密码吗？',function(r){    
			if (r){
				$.messager.progress({text : "正在努力的重置密码，请稍候..."});
		    	$.ajax({
		    		url: url,
		    		dataType:'json',
		    		data:{YHID:yhid},
		    		success:function(data){
		    			power.msgTip('body',{msg:'重置密码成功！', level:"info"});
		    			$.messager.progress("close");
		    		},
		    		error:function(){
		    			power.msgTip('body',{msg:'重置密码失败！', level:"fail"});	
		    			$.messager.progress("close");
		    		}
		    	});
		    		
			}
		});
	},
	/**
	* 获取一段年份的json数组
	* @method resetPassWord
	* @param {Integer} year 当前年份
	* @param {Integer} num 向前推算的年数
	*/
	getYears:function(year,num){
		var nfdata = [];
		var nfobj;
		for(i=0;i<num;i++){
			nfobj = {'label':year-i,'value':year-i};
			nfdata.push(nfobj);
		}
		return nfdata;
	}, 
	/**
	* 空气质量颜色
	*/
	kqzljbColor : {
		level1:"#00E400",
		//原来二级颜色为：#FFFF00，为了文字可见、改为：#ECEC00
		level2:"#ECEC00",
		level3:"#FF7E00",
		level4:"#FF0000",
		level5:"#99004C",
		level6:"#7E0023"
	},
	 /**
	 * 获取空气质量颜色
	 * @method  getKqzlYs
	 * @param {Integer} data 监测数据
	 * @param {String} wrw 污染物
	 */
	 getKqzlYs:function(data,wrw){
	 	if(wrw == 'AQI'){
	 		if(data<=50){
				return this.kqzljbColor.level1;
			}else if(data>50 && data<=100 ){
				return this.kqzljbColor.level2;
			}else if(data>100 && data<=150){
				return this.kqzljbColor.level3;
			}else if(data>150 && data<=200){
				return this.kqzljbColor.level4;
			}else if(data>200 && data<=300){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'SO2H24'){
	 		if(data<=50){
				return this.kqzljbColor.level1;
			}else if(data>50 && data<=150 ){
				return this.kqzljbColor.level2;
			}else if(data>150 && data<=475){
				return this.kqzljbColor.level3;
			}else if(data>475 && data<=800){
				return this.kqzljbColor.level4;
			}else if(data>800 && data<=1600){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'SO2H1'){
	 		if(data<=150){
				return this.kqzljbColor.level1;
			}else if(data>150 && data<=500 ){
				return this.kqzljbColor.level2;
			}else if(data>500 && data<=650){
				return this.kqzljbColor.level3;
			}else if(data>650 && data<=800){
				return this.kqzljbColor.level4;
			}else{
				return this.kqzljbColor.level5;
			}
	 	}else if(wrw == 'NOH24'){
	 		if(data<=40){
				return this.kqzljbColor.level1;
			}else if(data>40 && data<=80 ){
				return this.kqzljbColor.level2;
			}else if(data>80 && data<=180){
				return this.kqzljbColor.level3;
			}else if(data>180 && data<=280){
				return this.kqzljbColor.level4;
			}else if(data>280 && data<=565){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'NOH1'){
	 		if(data<=100){
				return this.kqzljbColor.level1;
			}else if(data>100 && data<=200 ){
				return this.kqzljbColor.level2;
			}else if(data>200 && data<=700){
				return this.kqzljbColor.level3;
			}else if(data>700 && data<=1200){
				return this.kqzljbColor.level4;
			}else if(data>1200 && data<=2340){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'PM10H24'){
	 		if(data<=50){
				return this.kqzljbColor.level1;
			}else if(data>50 && data<=150 ){
				return this.kqzljbColor.level2;
			}else if(data>150 && data<=250){
				return this.kqzljbColor.level3;
			}else if(data>250 && data<=350){
				return this.kqzljbColor.level4;
			}else if(data>350 && data<=420){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'COH24'){
	 		if(data<=2){
				return this.kqzljbColor.level1;
			}else if(data>2 && data<=4 ){
				return this.kqzljbColor.level2;
			}else if(data>4 && data<=14){
				return this.kqzljbColor.level3;
			}else if(data>14 && data<=24){
				return this.kqzljbColor.level4;
			}else if(data>24 && data<=36){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'COH1'){
	 		if(data<=5){
				return this.kqzljbColor.level1;
			}else if(data>5 && data<=10 ){
				return this.kqzljbColor.level2;
			}else if(data>10 && data<=35){
				return this.kqzljbColor.level3;
			}else if(data>35 && data<=60){
				return this.kqzljbColor.level4;
			}else if(data>60 && data<=90){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'O3H1'){
	 		if(data<=160){
				return this.kqzljbColor.level1;
			}else if(data>160 && data<=200 ){
				return this.kqzljbColor.level2;
			}else if(data>200 && data<=300){
				return this.kqzljbColor.level3;
			}else if(data>300 && data<=400){
				return this.kqzljbColor.level4;
			}else if(data>400 && data<=800){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'O3H8'){
	 		if(data<=100){
				return this.kqzljbColor.level1;
			}else if(data>100 && data<=160 ){
				return this.kqzljbColor.level2;
			}else if(data>160 && data<=215){
				return this.kqzljbColor.level3;
			}else if(data>215 && data<=265){
				return this.kqzljbColor.level4;
			}else if(data>265 && data<=800){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}else if(wrw == 'PM25H24'){
	 		if(data<=35){
				return this.kqzljbColor.level1;
			}else if(data>35 && data<=75 ){
				return this.kqzljbColor.level2;
			}else if(data>75 && data<=115){
				return this.kqzljbColor.level3;
			}else if(data>115 && data<=150){
				return this.kqzljbColor.level4;
			}else if(data>150 && data<=250){
				return this.kqzljbColor.level5;
			}else{
				return this.kqzljbColor.level6;
			}
	 	}
	 },
	 /**
	 * 转换污染物名称
	 * @method  convertWrwmc
	 * @param {String} wrw 污染物名称
	 */
	convertWrwmc:function(wrw){
	 	var wrwmc ;
	 	if(wrw == "PM2.5"){
			wrwmc = 'PM25H24';
		}else if(wrw == 'PM10'){
			wrwmc = 'PM10H24';
		}else if(wrw == 'O3'){
			wrwmc = 'O3H1';
		}else if(wrw == 'NO2'){
			wrwmc = 'NOH1';
		}else if(wrw == 'SO2'){
			wrwmc = 'SO2H1';
		}else if(wrw == 'CO'){
			wrwmc = 'COH1';
		}else if(wrw == 'AQI'){
			wrwmc = 'AQI';
		}else{
			wrwmc = wrw;
		}
		return wrwmc;
	 },
	/**
	* iframe加载指定地址
	* @param iframe iframe id值或iframe 对象
	* @param toSrc 加载地址
	* @param tzfs 跳转方式
	* @param ifload 弹出加载层
	*/
	openIFrame : function(iframe,toSrc,tzfs,ifload){
		if(tzfs == '3'){
			 window.open(toSrc);
		}else{
			if(power.isNotEmpty(toSrc)&&toSrc!='#'){
				if(tzfs == '1'){
					if(power.isNotEmpty(ifload)){
						var ifycs =toSrc.indexOf("?")==-1?"?":"&";
						$(iframe).attr("src",ctx+"/"+toSrc+ifycs+"load=true");
					}else{
						$(iframe).attr("src",ctx+"/"+toSrc);
					}
				}else if(tzfs == '2'){
					$(iframe).attr("src",toSrc);
				}
			}else{
				$(iframe).attr("src",ctx+"/"+'gas/layout/frame/noUrlShow.jsp');
			}
		}
	},
	/**
	* 根据代码集编号、代码编号格式化成代码内容
	* @param dmjbh 代码集编号
	* @param dm 代码编号
	* @url ajax访问地址 
	* <nbean:ajaxUrl var="" clazz="com.szboanda.gas.common.service.ggdm.GgdmService" method="getDmnrForDm"/>
	* 返回的ajaxUrl
	*/
	fomatDm : function(dmjbh,dm,url){
		var dmnr = "";
		var param = {dmjbh:dmjbh,dm:dm};
		$.ajax({
			type:'POST',
			url:url,
			data:param,
			async:false,
			dataType:'text',
			success:function(data){
				dmnr = data;
			}
		});
		return dmnr;
	},
	/**
	* 获取导出表格的列
	* @param datagrid easyui dategrid对象
	* 获取excel表头名称
	*/
	getColums:function(datagrid){
	 	var cols = "";
	 	$(datagrid).find("th").each(function (){
	 		var html = $(this).text();
	 		if(html.indexOf("<br/>")>0){
	 			html.replace("<br/>","");
	 		}
	 		cols += ","+html
	 	})
	 	return cols.substring(1);
	 },
	 /**
	 * 子表中通过点击弹出框或其它途径，在点击一个列时，将数据设置到其它列中。
	 * 使用方式
	 * plat.datagrid.setFieldValue(obj,datagrid,{"XTBH":"123","XTMC":"456","XTDZ":"test"});
	 * 参数一：当前控件或index下标
	 * 参数二：datagrid对象 
	 * 参数三：需要填充的列与数据
	 */
	setFieldValue:function(obj, table, params){
		if(power.isEmpty(params)){
			power.alert("提示信息", "请先设置Filed或Value值", "info");
			return;
		}
		table = power.getObject(table);
		params = power.getObject(params);
		var index = "";
		if(/^[0-9]*$/.test(obj)){
			index = obj;
			obj = table.datagrid("getPanel").find("tr[datagrid-row-index="+index+"]");
		}else{
			obj = power.getObject(obj);
			var i = 0; 
			while(power.isEmpty(obj.attr("field"))){
				obj = obj.parent();
				i++;
				//防止死循环
				if(i == 200) break;
			}
			obj = obj.parent();
			if(obj.length == 0){
				power.alert("提示信息", "参数一设置有误，请设置datagrid的下标或子表中控件对象。", "info");
				return;
			};
		}
		$.each(params, function(key, value){
			var $td;
			if(power.isEmpty(index)){
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
				if(power.isEmpty(index)){
					index = obj.attr('datagrid-row-index');
				}
				table.datagrid('getRows')[index][key] = value;
				index = "";
			}
		});
	 },
	 /**
	  * 获取单张图片访问路径
	  * @param {String} url 图片访问服务路径
	  * @param  {Object} param 传入参数 如：{pzbs：'whtr',sdate:'2015-12-23'}
	  * 返回单张图片的url
	 */
	 getSinglePicUrl:function(url,param){
	 	var defaultParam = {
	 		//配置标识
	 		pzbs : '',
	 		//模式类型
	 		mode : '',
	 		//分辨率
	 		fbl : '',
	 		//预报初始日期
	 		sdate :  '',
	 		//图片名称
	 		imgName : ''
	 	}
	 	var params = $.extend({},defaultParam,param);
		var url = url+'?pzbs='+params.pzbs+'&mode='+params.mode+'&fbl='+params.fbl+'&sdate='+params.sdate+'&imgName='+params.imgName;
		return url;
	 },
	 /**
	  * 创建错误图片路径及修改大小
	  * @param {Object} img 当前图片对象
	 */
	errorImg:function(img){
	    img.src = ctx + '/skins/default/images/gas/common/imgNotFound.png'; 
	    $(img).removeAttr("style")
	    $(img).css("height",'100%');
	    $(img).css("width",'100%');
	    img.onerror = null; 
	},
	 /**
	 * 图片下载
	 * @param url路径 http://...
	 */
	downLoad:function(src){
	    var $a = $("<a></a>").attr("href", src).attr("download", "");
	    $a[0].click();
	}
};

/**
 * 颜色选择工具栏
 */
gas.color = {
	colorDiv: "colorDiv",
	editSpan: "editSpan",
	colorPanel: "colorPanel",
	colorHex: new Array('00','33','66','99','CC','FF'),
	spColorHex: new Array('FF0000','00FF00','0000FF','FFFF00','00FFFF','FF00FF'),
	colorTable: "",
	onSelect:function(){},
	/** 
	 *	显示颜色层
	 *	@param ysm 颜色代码值 
	 *	@param rowIndex 行索引 用于区分其他行的颜色层
	 */
	showColorDiv:function(ysm, ysbs){
		var ysHtml = "<span id='"+ gas.color.colorDiv + ysbs + "' style='width:150px; height:20px;float: left;background: #"+ ysm +";'></span>"	+
			"<span class='icon-edit' id='"+ gas.color.editSpan + ysbs + "' onclick='gas.color.colorOpen("+ ysbs +")' style='width:17px;height:17px;margin-left:160px;cursor: pointer;'></span>" + 
			"<div id='"+ gas.color.colorPanel + ysbs +"' style='position:absolute;z-index:999;display:none;'></div> ";
		return ysHtml;
	},
	
	/*
	* 显示选择颜色的层
	*/
	colorOpen:function(index){
		gas.color.initColor(index);
		$("#" + gas.color.colorPanel + index).html("");
		$("#" + gas.color.colorPanel + index).html(gas.color.colorTable);
		$("#" + gas.color.colorPanel + index).show();
	},
	
	/**
	 * 初始化颜色显示层
	 */
	initColor:function(index){
		gas.color.colorTable = '';
		var colorValue = '';
		for (i = 0; i < 2; i++){
			for (j = 0; j < 6; j++){
				
				gas.color.colorTable += '<tr height=15>';
				if (i == 0){
					colorValue = gas.color.colorHex[j] + gas.color.colorHex[j] + gas.color.colorHex[j] ;
					gas.color.colorTable += '<td width=15 style="cursor:pointer;background-color:#' + gas.color.colorHex[j] + gas.color.colorHex[j] + gas.color.colorHex[j] + '" onclick=gas.color.doclick(' + index + ',' + colorValue+ ')>';
				}
				else{
					colorValue = gas.color.spColorHex[j];
					gas.color.colorTable += '<td width=15 style="cursor:pointer;background-color:#' + gas.color.spColorHex[j] + '" onclick=gas.color.doclick(' + index + ',' + colorValue+ ')>';
				}
				for (k = 0;k < 3; k++){
					for (l = 0; l < 6; l++){
						colorValue = gas.color.colorHex[k+i*3] + gas.color.colorHex[l] + gas.color.colorHex[j];
						gas.color.colorTable += '<td width=15  style="cursor:pointer;background-color:#' + gas.color.colorHex[k+i*3] + gas.color.colorHex[l] + gas.color.colorHex[j] + '" onclick=gas.color.doclick(' + index + ',"' + colorValue+ '")>';
					}
				}
			}
		}
		gas.color.colorTable = '<table border="0" cellspacing="0" cellpadding="0" style="border:1px #000000 solid;border-bottom:none;border-collapse: collapse;width:305px;" bordercolor="000000">'
			+'<tr height=20><td colspan=21 bgcolor=#ffffff style="font:12px tahoma;padding-left:2px;">'
			+'<span style="float:left;color:#999999;"></span>'
			+'<span style="float:right;padding-right:3px;cursor:pointer;" onclick="gas.color.colorClose('+ index +')">×关闭</span>'
			+'</td></table>'
			+'<table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000" style="cursor:pointer;">'
			+ gas.color.colorTable + '</table>';
	},
	
	/**
	 * 选择颜色
	 */
	doclick:function(index, ysm){
		eval( "var callBackFun = " + gas.color.onSelect);
    	callBackFun({id:gas.color.colorDiv + index,index:index,colorValue:ysm});
	},
	/*
	* 关闭选择颜色的层
	*/
	colorClose:function(index){
		$("#" + gas.color.colorPanel + index).hide();
	},
	/**
	 * 显示编辑按钮
	 */
	showEdit:function(index){
		$("#" + gas.color.editSpan + index).css("display","block");
	}
}
/**
 * gas常量 
 */
gas.constants = {
	HOURS:[{'DM':0,'DMNR':'0'},{'DM':1,'DMNR':'1'},{'DM':2,'DMNR':'2'},{'DM':3,'DMNR':'3'},{'DM':4,'DMNR':'4'},{'DM':5,'DMNR':'5'},
			{'DM':6,'DMNR':'6'},{'DM':7,'DMNR':'7'},{'DM':8,'DMNR':'8'},{'DM':9,'DMNR':'9'},{'DM':10,'DMNR':'10'},{'DM':11,'DMNR':'11'},
			{'DM':12,'DMNR':'12'},{'DM':13,'DMNR':'13'},{'DM':14,'DMNR':'14'},{'DM':15,'DMNR':'15'},{'DM':16,'DMNR':'16'},{'DM':17,'DMNR':'17'},
			{'DM':18,'DMNR':'18'},{'DM':19,'DMNR':'19'},{'DM':20,'DMNR':'20'},{'DM':21,'DMNR':'21'},{'DM':22,'DMNR':'22'},{'DM':23,'DMNR':'23'}]
	
};
gas.tabs = {
		/**
		* tabs初始化
		* @param id tabs元素id值
		* @param options 初始化参数，参数为JSON格式，
		*		如：{position:'left',selRefresh:true}
		*		参数 position: 	tab栏目展现方式，可选择：left、right、top、bottom
		*			selRefresh： 	选择tab标题是否刷新
		*/
		init: function(id,options){
			options = (options == undefined || options == null) ? {} : options;
			var init_fit = (options.fit == undefined || options.fit == null) ? true : options.fit;
			var init_border = (options.border == undefined || options.border == null) ? false: options.border;
			var init_selRefresh = (options.selRefresh == undefined || options.selRefresh == null) ? false: options.selRefresh;
			var init_plain = (options.plain == undefined || options.plain == null) ? false: options.plain;
			//tab位置（可选参数：top、bottom、left、right）
			var init_position = (options.position == undefined || options.position == null) ? 'top': options.position;
			var tabsObj = $("#"+id).tabs({
				fit : init_fit,
				border : init_border,
				tabPosition : init_position,
				plain: init_plain
			});	
			
			if(init_selRefresh){//选中刷新
				tabsObj.tabs('options').onSelect =function(title,index){
					gas.tabs.refresh(id,index);//刷新tab
				} 
			}
		},
		/**
		* 新增tab项
		* @param id tabs元素id值
		* @param options tab项参数，参数为JSON格式，
		*		如：{title:'xxx',basicUrl:'${ctx}/xx/xx/xx.jsp',iframe:false,closable:false,iconCls:'icon-xx',showReload:false}
		*		参数 title: tab标题
		*			basicUrl：引用路径
		*			iframe：是否采用iframe嵌入
		*			closable: 是否可关闭
		*			iconCls：icon图标
		*			showReload：显示重载按钮
		*/
		add:function(id,options){
			options = (options == undefined || options == null) ? {} : options;
			var $tabs = $("#"+id);
			//标题
			var init_title = (options.title == undefined || options.title == null) ? '' : options.title;
			if ($tabs.tabs('exists', init_title)) {
				$tabs.tabs('select', init_title);
			} else {
				//是否嵌入iframe
				var init_iframe = (options.iframe == undefined || options.iframe == null) ? true : options.iframe;
				//链接地址
				var init_href = (options.basicUrl == undefined || options.basicUrl == null) ? '' : options.basicUrl;
				//是否可关闭
				var init_closable = (options.closable == undefined || options.closable == null) ? false : options.closable;
				//tab页图标
				var init_iconCls = (options.iconCls == undefined || options.iconCls == null) ? '' : options.iconCls;
				//显示重载按钮
				var init_showReload = (options.showReload == undefined || options.showReload == null) ? false: options.showReload;
				//是否禁用iframe滚动条
				var init_iframeScroll = (options.iframeScroll == undefined || options.iframeScroll == null) ? 'no': options.iframeScroll;
				var op = new Object();
				op["title"] = init_title;
				op["closable"] = init_closable;
				if(init_iconCls!=''){
					op["iconCls"] = init_iconCls;
				}
				op["basicUrl"] = init_href;
				op["isIFrame"] = init_iframe;
				op["selected"] = false;
				var json = JSON.stringify(op);
				var opJson = eval('('+json+')');
				if(init_showReload){
					var reloadObj = [ {
							iconCls : 'icon-mini-refresh',
							handler : function(){
								var index = $tabs.tabs('getTabIndex',$tabs.tabs('getSelected'));
								tabs.refresh(id,index,init_iframeScroll);
							}}];
					opJson["tools"] = reloadObj;
				}
				$tabs.tabs('add',opJson);
				return $tabs.tabs('getTab',init_title);
			}
		},
		/**
		* 给tabs各面板绑定mouseenter事件进行切换
		* @param id tabs元素id值
		*/
		hoverShow:function(id){
		  var tabsArr =  $('#'+id).tabs().tabs('tabs');
		  for(var i=0; i<tabsArr.length; i++){
		      tabsArr[i].panel('options').tab.unbind().bind('mouseenter',{index:i},function(e){  
		          $('#'+id).tabs('select', e.data.index);  
		      });  
		  }  
		},
		/**
		* tabs 刷新指定which卡片
		* @param id tabs元素id值
		* @param iframeScroll 是否禁用滚动条
		* @which 'which'参数可以是选项卡面板的标题或者索引
		*/
		refresh:function(id,which,iframeScroll){
			var tabsObj = $('#'+id);
			var tab = tabsObj.tabs('getTab',which);
			var href = tab.panel('options').basicUrl;
			var isIFrame =  tab.panel('options').isIFrame;
			if(isIFrame) {/*说明tab是以iframe方式引入的目标页面*/
				var panel = tab.panel('panel');
				var frame = panel.find('iframe');
				try {
					if (frame.length > 0) {
						for ( var i = 0; i < frame.length; i++) {
							power.cleanIframe(frame[i]);
						}
					}
					var iframeCt = '<iframe src="' + power.appendAddr(href,"1=1") + '"  frameborder="0" scrolling="'+iframeScroll+'"  style="width:100%;height:100%;"></iframe>';
					tab.panel({content:iframeCt});
				} catch (e) {
				}
			}else{/*说明tab是以href方式引入的目标页面*/
				tab.panel('refresh',href);
			}
		},
		/**
		* tabs 修改指定which卡片href
		* @param id tabs元素id值
		* @param which 参数可以是选项卡面板的标题或者索引
		* @param newHref 新地址
		*/
		modifyHref: function(id,which,newHref){
			var tabsObj = $('#'+id);
			var tab = tabsObj.tabs('getTab',which);
			var href = tab.panel('options').href;
			if (href) {/*说明tab是以href方式引入的目标页面*/
				tab.panel('options') = newHref;
				tab.panel('refresh');
			}else {/*说明tab是以content方式引入的目标页面*/
				var panel = tab.panel('panel');
				var frame = panel.find('iframe');
				try {
					if (frame.length > 0) {
						frame[0].contentWindow.document.write('');
						frame[0].contentWindow.close();
						frame[0].src = newHref;
						if ($.browser.msie) {//ie浏览器下
							CollectGarbage();//释放内存
						}
					}
				} catch (e) {
				}
			}
		}
		
}
/**
 * 时间处理工具
*/
gas.dateUtil = {
	 /**
	  * 获取延迟后的日期
	  * @param {String} date 当前日期  格式为 2015-12-23
	  * @param {Number} days 延迟天数
	  * 返回延迟后的日期
	 */
	delayDay:function(date,days){
	    var dateArr = date.split("-");  
	    var newDate = new Date(Number(dateArr[0]),Number(dateArr[1])-1,Number(dateArr[2])+Number(days));  
	    var year = newDate.getFullYear();
	    var month = (newDate.getMonth()+1) > 10 ? (newDate.getMonth()+1)  : '0'+(newDate.getMonth()+1);
	    var day =  newDate.getDate();
	    if(day<10){
	    	day = '0' + day;
	    }
		return year + "-" +  month + "-" + day;
	},
	/**
	 * 获取当前月份的第一天
	 * @param {String} month 当前日期  格式为 2015-12 如何为空，则默认为当前月份
	 */
	getCurrentMonthFirst:function(month){
		var date = new Date();
		if(month){
			date.setYear(month.substring(0,4));
			date.setMonth(parseInt(month.substring(5,7))-1,1);
		}
		date.setDate(1);
		var year = date.getFullYear();
	    var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1)  : '0'+(date.getMonth()+1);
	    var day =  date.getDate();
	    if(day<10){
	    	day = '0' + day;
	    }
		return year + "-" +  month + "-" + day;
	},
	/**
	 * 获取当前月份的最后一天
	 * @param {String} month 当前日期  格式为 2015-12 如何为空，则默认为当前月份
	 */
	getCurrentMonthLast:function(month){
		var date=new Date()
		if(month){
			date.setYear(month.substring(0,4));
			date.setMonth(parseInt(month.substring(5,7))-1,1);
		}
		var currentMonth=date.getMonth()
		var nextMonth=++currentMonth
		var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1)
		var oneDay=1000*60*60*24
		date = new Date(nextMonthFirstDay-oneDay);
		var year = date.getFullYear();
	    var month = (date.getMonth()+1) > 9 ? (date.getMonth()+1)  : '0'+(date.getMonth()+1);
	    var day =  date.getDate();
	    if(day<10){
	    	day = '0' + day;
	    }
		return year + "-" +  month + "-" + day; 
	}
	
}
gas.tab ={
		/**
		 * 初始化tab的方法.
		 * @param id tabs元素id值
		 * @param options 初始化参数，参数为JSON数组
		 * options = [{title:'111',basicUrl:'1111'},{}]
		 * 只支持iframe，横向加载
		 */
		init : function(id,options){
			var option = (options == undefined || options == null) ? [] : options;
			$("#"+id).html('<div class="thrTab"><div class ="thr-hd"><ul ></ul></div><div class="thr-bd"></div></div>');
			var $ul = $("#"+id+" .thrTab .thr-hd ul");
			if(!gas.isEmptyObject(options)){
				$(option).each(function(idx,obj){
					$ul.append('<li >'+obj.title+'<em></em></li>')
					$($ul+" li").data("url",obj.basicUrl);
				});
			}
			$ul.on("click", "li", function(){ 
				//此处的$(this)指 $("li") 
				var url = $(this).data("url");
				var $bd = $("#"+id+" .thrTab .thr-bd"); 
				$(this).parent().find("li").removeClass("on");
				$(this).addClass("on");
				$bd.empty();
				$bd.css("height",$(".thr-bd").parent().height()-$(".thr-bd").prev("div").height()+"px")
				$bd.append("<iframe src='"+url+"' id='iframe' class='iframe' scrolling='no'frameborder='0' height='100%' width='100%' ></iframe>");
			}); 
		},
		/**
		 * 增加tab的方法.
		 * @param id tabs元素id值
		 * @param obj  json 数据 {title:'111',basicUrl:'xxx/.jsp'}
		 * title tab名
		 * basicUrl 远程地址
		 */
		add : function (id,obj){
			var $ul = $("#"+id+" .thrTab .thr-hd ul");
			$ul.append('<li >'+obj.title+'<em></em></li>');
			$ul.find("li:last").data("url",obj.basicUrl);
		},
		/**
		 * 选则tab
		 * @param id tabs元素id值
		 * @param index tab的索引 从0开始
		 */
		select : function (id,index){
			index= (index == undefined || index == null) ? 0 : index;
			var $ul = $("#"+id+" .thrTab .thr-hd ul");
			$ul.find("li")[index].click();
		}
}