//echarts公用对象类，封装相关公用操作
var echartsUtil = {
	/**
	 * echarts初始化函数
	 * @param divId 需初始化的div的id
	 */
	init:function(divId){
		return echarts.init(document.getElementById(divId),theme);
	},
	/**
	 * echarts显示加载中函数
	 * @param echartObj echarts实例对象
	 */
	showLoading:function(echartObj){
		echartObj.showLoading({
			effect:'whirling',
		    text: '正在努力的读取数据中...'    //loading话术
		});
	},
	/**
	 * echarts隐藏加载中函数
	 * @param echartObj echarts实例对象
	 */
	hideLoading:function(echartObj){
		echartObj.hideLoading();
	},
	/**
	 * ajax相关操作(暂负责单个统计图ajax请求的操作)
	 * 
	 * echartsUtil.echartsAjaxLoad:function({
	 	echartDivId:'xxx',
	 	ajax_url:'xxxx',
	 	ajax_Entity：{method:"test",adminId:"test01"}
	 	});
	 * 
	 * @param requestEntity 参数 如：{method:"test",adminId:"test01"}
	 */
	echartsAjaxLoad:function(requestEntity){
		var echartObj = this.init(requestEntity.echartDivId);
		this.showLoading(echartObj);
		//默认回调函数
		requestEntity.ajax_Entity.callBackFun = 'echartsUtil.ecCallBackFun';
		//回调函数的json对象参数,ec_key_id：echarts实例对象的id
		requestEntity.ajax_Entity.callBackParams = {ec_key_id:echartObj.id};
		//异步
		requestEntity.ajax_Entity.ajax_async = true;
		aaqfw.ajaxRequest(requestEntity.ajax_url,requestEntity.ajax_Entity);
	},
	/**
	 * ajax回调函数
	 * @param data ajax返回json对象
	 * @param jsonObj 参数
	 */
	ecCallBackFun:function(data,jsonObj){
		var ecObj = echarts.getInstanceById(jsonObj.ec_key_id);
		ecObj.setOption(data.result);
		echartsUtil.hideLoading(ecObj);
	}
};