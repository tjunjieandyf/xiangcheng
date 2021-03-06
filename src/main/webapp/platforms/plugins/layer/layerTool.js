layer.config({
    extend: 'extend/layer.ext.js', //注意，目录是相对layer.js根目录。如果加载多个，则 [a.js, b.js, …]
    shift: 0//默认动画风格
});
/*layer.config({
    path: ctx+'platform/plugins/layer',
    skin:'layui-layer-lan',//layui-layer-molv layui-layer-lan
    maxmin: true
});*/
function Layer(){} ;

Layer.prototype = {

	toplayer : window.parent.layer ,   // 获取顶层窗口的layer对象
	topWin : window.parent ,           // 获取顶层窗口对象
	colseTime : 1000 ,    			// 关闭弹出框的默认时间 1S
	width : '800px',     			// 默认窗口的宽度
	height : '600px',   			// 默认窗口的高度
	px : 'px' ,         			// 对话框宽高单位
	/**
	 * 警告框
	 * @param {} content	警示的内容
	 */
	showAlert : function(content){
		this.toplayer.alert(content,{icon:0}); 
	},
	/**
	 * 保存返回值
	 * @param {} key  默认值：returnVal
	 * @param {} value
	 */
	setData : function(key,value){
		var length = arguments.length ;   //  实际传入参数的长度
		var data = this.topWin.data = {};
		if(length == 1){ // 只传入值
			data['returnVal'] = arguments[0];
		}else if(length == 2){  // 指定了保存键名
			data[key] = value;
		}
	},
	/**
	 * 获取返回值
	 * @param {} key 如果不保存，默认取 returnVal 
	 * @return {}
	 */
	getData : function(key){
		var length = arguments.length ;   //  实际传入参数的长度
		var data = null ;
		if(length == 0){  // 没有传入任何参数
			if(this.topWin.data && this.topWin.data['returnVal']){
				data = this.topWin.data['returnVal'];
				this.topWin.data = null ;
				return data;
			}else{
				return null ;
			}
		}else if(length == 1){ // 传入了键值
			return this.topWin.data[key];
		}
	},
	/**
	 * 操作成功提示框
	 * @param {} content	提示内容  默认：操作成功
	 * @param {} callback	回调方法
	 */	
	showSucAlert : function (content,callback){
		var length = arguments.length ;   //  实际传入参数的长度
		var options = {icon:1,time:this.colseTime};
		if(length == 0){  // 没有传入任何参数
			this.toplayer.alert("操作成功",options);
		}else if(length == 1){ // 传入了提示内容
			this.toplayer.alert(content,options);
		}else if(length == 2){  // 有回调函数的,将不自动关闭
			this.toplayer.alert(content,{icon:1},callback);
		}
	},
	/**
	 * 操作失败提示框
	 * @param {} content	提示内容 默认：操作失败
	 * @param {} time       关闭时间(单位毫秒) 默认：1S,0:表示不自动关闭  
	 */
	showFailAlert : function(content,time){
		var length = arguments.length ;   //  实际传入参数的长度
		var options = {icon:2,time:this.colseTime};
		if(length == 0){  // 没有传入任何参数
			this.toplayer.alert("操作失败",options);
		}else if(length == 1){ // 传入了提示内容
			this.toplayer.alert(content,options);
		}else if(length == 2){ // 传入了关闭时间
			options.time = time ;
			this.toplayer.alert(content,options);
		}
	},
	/**
	 * 打开一个对话框(没有回调函数)
	 * @param {} title   	对话框标题(必须)
	 * @param {} url		对话框URL(必须)
	 * @param {} width		对话框宽度 默认：800px
	 * @param {} height		对话框高低 默认：600px
	 */
	openDialogNoCallBack : function(title,url,width,height){
		return this.toplayer.open({
			type : 2,
			title : title ,
			content : url ,
			maxmin: true,
			area: [width, height]
		});
	},
	/**
	 * 获取当前的窗口对象
	 * @return {}
	 */
	getCurrentWin : function(){
		return this.topWin.frames['ifr_center'] ;
	},

	/**
	 * 打开一个对话框(带回调函数)
	 * @param {} title   	对话框标题(必须)
	 * @param {} url		对话框URL(必须)
	 * @param {} width		对话框宽度 默认：800px
	 * @param {} height		对话框高低 默认：600px
	 */
	openDialogWithCallBack : function(title,url,width,height,callback){
		return layer.open({
			type : 2,
			title : title ,
			content : url ,
			area: [width, height],
		    maxmin: false,
			end  : callback
		});
	},
	/**
	 * 打开一个全局的窗口
	 */
	openFullDialog: function(title,url,callback){
		var index = this.toplayer.open({
			type : 2,
			title : title ,
			content : url ,
			area: ['800px', '600px'],
		    maxmin: true,
			end  : callback
		});
		this.toplayer.full(index);
	},
	/**
	 * 打开一个对话框(没有回调函数)
	 * @param {} title   	对话框标题(必须)
	 * @param {} url		对话框URL(必须)
	 * @param {} width		对话框宽度 默认：800px
	 * @param {} height		对话框高低 默认：600px
	 * @param {} callback   窗口销毁时的回调方法
	 */
	openDialog : function(title,url,width,height,callback){
		var length = arguments.length ;   //  实际传入参数的长度
		if(length == 2){   // 默认宽高
			return this.openDialogNoCallBack(title,url,this.width,this.height);
		}else if(length == 3){  // 只传入宽度参数 或者第三个参数回调函数方法
			if(typeof width == 'function'){
			return	this.openDialogWithCallBack(title,url,this.width,this.height,arguments[2]);
			}else{
				width += this.px ;
				return this.openDialogNoCallBack(title,url,width,this.height);
			}
		}else if(length == 4){  // 传入宽度和高度
			 width += this.px ;
			 height += this.px ;
			 return this.openDialogNoCallBack(title,url,width,height);
		}else if(length == 5){   // 带回调函数
			 width += this.px ;
			 height += this.px ;
			 return this.openDialogWithCallBack(title,url,width,height,callback);
		}
	},
	/**
	 * 图片预览的窗口
	 * @param url
	 */
	openImgDialog:function(url){
		return this.toplayer.open({
			type : 2,
			title : "图片预览" ,
			content : url ,
			area: ['1050px', '610px'],
		    maxmin: true,
		    scrollbar: false
		});
	},
	/**
	 * 加载层
	 * @return {}
	 */
	loading : function(shade){
		return this.toplayer.load(0, {shade: shade ? shade : false });
	},
	/**
	 * 关闭弹出层
	 * @param {} index
	 */
	closeLayer : function(index){
		this.toplayer.close(index);
	},
	/**
	 * 关闭所有的消息框
	 */
	closeMessage : function(){
		this.toplayer.closeAll('dialog'); //关闭信息框
	},
	/**
	 * 关闭所有的Dialog
	 */
	closeDialog : function(){
	 	this.toplayer.closeAll('iframe');
	},
	/**
	 * 关闭所有的窗口
	 * @param {} content
	 */
	closeAll : function(){
		this.toplayer.closeAll();
	},	
	/**
	 * 关闭Dialog带有操作成功的提示
	 * @param {} content
	 */
	closeDialogWithMsg : function(content){
		this.toplayer.closeAll('iframe');
		if(!content) content = "操作成功" ;
		this.showSucMsg(content);
	},
	/**
	 * 显示提示框
	 * @param {} content
	 */
	showMsg : function(content, msgLevel){
		var icon = null;
		switch (msgLevel){
			case 'info' :
				icon = 7;
				break;
			case 'success' :
				icon = 1;
				break;
			case 'fail' :
			case 'exception':
				icon = 2;
				break;
		}
		this.toplayer.msg(content,{time:this.colseTime, icon:icon}) ;
	},
	/**
	 * 显示操作成功的提示框
	 * @param {} content
	 */
	showSucMsg : function(content,callBack){
		var length = arguments.length ;   //  实际传入参数的长度
		if(!content) content = "操作成功" ;
		if(length==1)
			this.toplayer.msg(content,{icon: 1,time:this.colseTime}) ;
		else
			this.toplayer.msg(content,{icon: 1,time:this.colseTime},callBack) ;
	},
	/**
	 * 显示验证框
	 * @param {} content   提示内容
	 * @param {} yesFunction 确定以后的回调函数
	 * @param {} yesFunction 取消以后的回调函数
	 */
	showConfirm : function(content,yesFunction,noFunction){
		return this.toplayer.confirm(content,{
			btn: ['确定', '取消'],
			icon : 3
		},yesFunction,noFunction);
	},
	/**
	 * 显示验证框
	 * @param {} content   提示内容
	 * @param {} yesFunction 确定以后的回调函数
	 */
	determinationDialog : function(content,yesFunction){
		return this.toplayer.confirm(content,{
			btn: ['确定'],
			icon : 3
		},yesFunction);
	},
	/**
	 * 单选污染源
	 * return 比选中的对象
	 */
	singleSelectWry : function(callBack){
		var url = ctx+'/pages/ydzfv3/common/singleSelectWry.jsp';
		var closeIndex = this.openDialog("选择污染源",url,callBack);
		this.setData('closeIndex', closeIndex);
	},
	/**
	 * 多选污染源
	 * @param {} callBack   被选中污染源的污染源名称和编号
	 */
	multiSelectWry : function(callBack){
		var url = ctx+'/pages/ydzfv3/common/multiSelectWry.jsp';
		var closeIndex = this.openDialog("选择污染源",url,900,600,callBack);
		this.setData('closeIndex', closeIndex);
	},
	/**
	 * Tabs弹出框
	 * @param width 	弹出框的宽度 eg：800  *必须传
	 * @param height	弹出框的搞定  eg：600 *必须传
	 * Tab页数据 title1,url1,title2,url2...
	 * 调用方式Layer.showTabs(800,600,'测试1','demo02Edit.jsp','测试2','addModel.jsp')
	 */
	showTabs : function(width,height){
		var length = arguments.length ;  
		if(length.length<2) return ;
		width += this.px ;
		height += this.px ;
		var array = new Array();
		for (var i = 2; i < length; i+=2) {
			array.push({title:arguments[i],content:'<iframe width="100%" height="'+ (height + 40) +'" frameborder="0"  marginheight="0" marginwidth="0" src="'+arguments[i+1]+'"></iframe>'});
		}     
		this.toplayer.tab({
		    area: [width, height],
		    tab: array
		}); 
	},
	setFrameHeight : function(frame){
		var subWeb = document.frames ?  document.frames[frame.name].document : frame.contentDocument;
		if(frame != null && subWeb != null) {
			frame.height = $(subWeb).height();
		}
	},
	openPhots : function(json){
		return layer.photos({
	        photos: json
	        //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
	   });
	}
	
};

var Layer = new Layer();