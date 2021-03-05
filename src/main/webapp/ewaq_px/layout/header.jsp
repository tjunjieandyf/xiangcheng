<%@page import="com.szboanda.platform.v3.util.StringUtils"
%><%@page import="com.szboanda.platform.v3.util.resources.SystemParamConfigCache"
%><%@ page language="java" pageEncoding="UTF-8" contentType="text/html;charset=UTF-8"
%><%@page import="com.szboanda.gas.common.service.xtcs.XtcshPz"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" 
%><%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql" 
%><%@ taglib uri="/WEB-INF/tld/szboanda.tld" prefix="nbean"
%><%@ taglib uri="/WEB-INF/tld/struts-html.tld" prefix="html"
%><%@ taglib uri="/WEB-INF/tld/struts-logic.tld" prefix="logic"
%><%@ taglib uri="/WEB-INF/tld/struts-bean.tld" prefix="bean"
%><%
	//清除缓存
	response.setHeader("Pragma","No-cache"); 
	response.setHeader("Cache-Control","no-cache"); 
	response.setDateHeader("Expires", 0);
	String ctx = request.getContextPath();
	if ("/".equals(ctx)) {
	    ctx = "";
	}
	String skinPath = (String)session.getAttribute("SKIN_PATH");
	if(skinPath != null){
		skinPath = skinPath.substring(skinPath.lastIndexOf("/") + 1);
	}else{
		skinPath = "default";
	}
	//系统级别
	String sysLevel = SystemParamConfigCache.getSystemParamer(XtcshPz.XTJB.getKey());
	String customerName = SystemParamConfigCache.getSystemParamer("system.customer.name");
	customerName = StringUtils.isEmpty(customerName) ? "" : (customerName + "-");
	String systemName = SystemParamConfigCache.getSystemParamer("system.name");
	systemName = StringUtils.isEmpty(systemName) ? "" : systemName;
	session.setAttribute("skin", skinPath);
	session.setAttribute("ctx", ctx);
	session.setAttribute("pageTitle", customerName + systemName);
	session.setAttribute("sysLevel",sysLevel);

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>  
	<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
	<title>${sessionScope.pageTitle}</title>
	<meta http-equiv="pragma" content="no-cache" /> 
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />    
	<meta http-equiv="keywords" content="深圳市博安达软件开发有限公司,${Sysparam['system.name']},POWERDATA" />
	<meta http-equiv="description" content="${Sysparam['system.name']}" />
	<meta http-equiv="Page-Enter" content="blendTrans(Duration=0.5)" /> 
	<meta http-equiv="Page-Exit" content="blendTrans(Duration=0.5)" />
	<link rel="icon" href="${ctx }/pages/platform/layout/favicon.ico" type="image/x-icon" />  
	<link rel="shortcut icon" href="${ctx }/pages/platform/layout/favicon.ico" type="image/x-icon" />
	<script type="text/javascript">
	<!--
		var ctx = '${ctx}';  
		var skin = '${skin}';
		var sysName= "${Sysparam['system.name']}";
		var userId = "${helper.id}";
		var departmentId = "${helper.department}";
		var sysLevel = "${sysLevel}";
	//-->
	</script>
	<%-- easyUI样式文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/themes/${skin }/easyui.css"/>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/themes/${skin }/commonSmall.css"/>
	<%-- easyUI图标文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/themes/${skin }/icon.css"/> 
	<%-- jquery --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/jquery.min.js"/>  
	<%-- easyUI --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/jquery.easyui.min.js"/>
	<%-- easyUI messager源文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/plugins/jquery.messager.js"/>
	<%-- easyUI datagrid源文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/plugins/jquery.datagrid.js"/>
	<%-- easyUI tree源文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/plugins/jquery.tree.js"/>
	<%-- easyUI datebox扩展文件 提供选择年月，  --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/datebox-ext.js"/>
	<%-- easyUI 扩展文件 提供选择时分，时分秒  --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/timebox.js"/>
	<%-- easyUI国际化 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/locale/easyui-lang-zh_CN.js"/>
	<%-- 扩展easyUI 样式文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/themes/${skin }/ext/easyui.css"/>
	<%-- 扩展easyUI 样式文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/themes/${skin }/ext/icon.css"/>
	<%-- 解决 JSON.stringif(Object) 将Json转成字符串，不兼容问题 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/json.js"/>
	<%-- 对cookie操作的文件 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/jquery.cookie.js"/>
	<%-- 常用方法JS --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/common.js"/>
	<%-- 扩展easyUI功能JS --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/easyui-ext.js"/>
	<%-- 操作easyUI功能，如“保存”等 --%>
	<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/easyui-plat.js"/>
	
	<%--空气质量预报预警系统 公用js --%>
	<nbean:css foldar="scripts" path="ewaq_px/common_temp/common.js"/>
	<%--空气质量预报预警系统 公用样式 --%>
	<nbean:css foldar="skins" path="${skin}/style/ewaq/system.css"/>
	
	<%-- echarts --%>
	<c:if test="${requestScope.isEcharts eq true}">
		<%-- echarts 默认皮肤--%>
		<%-- echarts 方法--%>
		<nbean:css foldar="scripts" path="plugin/echarts/common.js"/>
		<nbean:css foldar="scripts" path="plugin/echarts/echarts.min.js"/> 
		<nbean:css foldar="scripts" path="plugin/echarts/themes/default/custom.js"/>
	</c:if>
	
    <%-- layer插件 --%>
    <nbean:css foldar="scripts" path="ewaq_px/plugin_temp/layer/layer.js"/>
    <nbean:css foldar="scripts" path="ewaq_px/plugin_temp/layer/extend/layer.ext.js"/>
    <nbean:css foldar="scripts" path="ewaq_px/plugin_temp/layer/extend/layer-commom.js"/>
    <nbean:css foldar="scripts" path="ewaq_px/plugin_temp/layer/extend/layer-util.js"/>
	
	<%-- fontawesome样式 --%>
	<nbean:css foldar="fontawesome" path="css/font-awesome.min.css"/>
	 
    <!--站点选择插件  -->    
    <nbean:css foldar="scripts" path="gas/plugin/listchoice/listChoice.js" />
    <nbean:css foldar="scripts" path="gas/plugin/listchoice/css/system.css" />
    <nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/jQuery.Hz2Py-min.js" />
    <!-- segment -->
    <nbean:css foldar="scripts" path="/plugin/segment/themes/${skin }/segment.css"/>  
    <nbean:css foldar="scripts" path="/plugin/segment/jquery.segment.js"/> 
	
	<%-- 滚动条scrollup 
	<nbean:css foldar="scripts" path="ewaq/plugin_temp/scrollup/js/scrollup.js"/>--%>
	<%-- 滚动条scrollup样式 
	<nbean:css foldar="scripts" path="ewaq/plugin_temp/scrollup/css/scrollup.css"/>--%>
	
	
	<script type="text/javascript">
	
		//禁止自动渲染
		$.parser.auto = false;
		<c:if test="${not empty param.fmdid }">
			<%-- 当fmdid参数不为空时，记录菜单访问日志 --%>
			<nbean:ajaxUrl clazz="com.szboanda.platform.v3.util.log.load.LogAjaxService" method="saveMenuLog" var="menuLogUrl"/>
			/**调用记录菜单访问日志的服务*/
			var imgMenuLog = new Image(); 
			imgMenuLog.src = '${menuLogUrl}&' + power.getReqUrlParams().join('&');
		</c:if>
		
		$(function(){
			//渲染jquery easyui对象
			$.parser.parse();
			//增加搜索框的默认提示条件
			power.initSearchInput();
			//添加字体类型
			$("*").css("font-family", "微软雅黑");
			
			//设置字体字号  
		    var vFontSize = power.localStorage.getItem("20140801101612db59108a321a4894bac26a7fd9202216");
			if (vFontSize) power.setFontSize(vFontSize); 
 
			/*
				从cookie中取出页面布局, 
				如果当前页面只有一个布局，并且在body上，则不需要传参数，只需要调用方法plat.datagrid.layoutCookie();即可。
				如果一个页面中有多个布局则需要将布局对象传递到方法中，将多个对象通过","分开。如：plat.datagrid.layoutCookie("body,#layout1");
			*/
			<c:if test="${requestScope.layoutCookie eq true}" >
				plat.datagrid.layoutCookie();
			</c:if>
			
			<c:if test="${requestScope.monitorChange eq true}" >
				/* 
					将页面控件中初始数据加载到JSON中，缓存使用 
					如果页面中只有一个form表单，并且id为"autoform"，此方法则不需要传入参数，默认为autoform
					如果页面中的form表单id不为"autoform"，则需要在方法中写入参数。如：power.monitorDataChange("#autoform_1");
					如果页面中有多个form表单需要监听，可以传入多个参数，通过“,”将参数分开。如：power.monitorDataChange("#autoform_1,form[name=autoform_2]");
					参数也可以通过其它属性传递，只要是jQuery能取到此对象即可
				*/
				power.monitorDataChange();
			</c:if>
		});
	
		<c:if test="${requestScope.monitorChange eq true}" >
			/* 判断页面数据是否变化*/
			function isChange(){
				return power.isChange();
			}
			
			/* 刷新或关闭页面时，判断页面数据是否变化*/
			$(window).on('beforeunload', function(){
				if(isChange()) return "当前页面数据已有修改，是否离开？";
			});
		</c:if>
		
		/**
		* 初始化dialog
		* @param params 初始化dialog所需要的参数,参数为JSON格式，参数可参考dailog API
		*				如：{basicUrl:'${ctx}/pages/platform/layout/demo/edit.jsp?gridID=ldDatagrid',title:'行政区划信息'}
		*/
		var dialogId;
		function initDialog(params){
			dialogId = power.UUID();
			$("<div id='"+ dialogId +"' style='display:none;overflow: hidden;'></div>").appendTo("body");
			$("#"+ dialogId).dialog(params).dialog("minimize");
			return dialogId;
		}
		
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
		function operDialog(oper, params){
			if(power.isEmpty(params)) params = {};
			var panel = power.isNotEmpty(params.panel) ? "#" + params.panel : "#" + dialogId;
			try{$(panel).dialog("open");}catch(e){}
			operPanel(oper, $.extend(params, {panel:panel}));
		}
		
		/**
		* 操作panel，新增或编辑
		* @param oper 操作 add or edit
		* @param
		* @param params 新增或编辑需要的参数，参数为JSON格式，
		*		如：{datagrid:'#datagrid',panel:'#panel',basicUrl:'${ctx}/pages/platform/demo.jsp',param:'YHMC=SYSTEM'}
		*		参数 datagrid: 	代表添加时需要清空选择的datagrid表格
		*			basicUrl： 	代表基本路径
		*			param:		代表连接时需要的参数
		*			panel: 		需要操作的面板
		*/
		function operPanel(oper, params){
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
		}
		/*
		设置字体字号大小
		obj：当前点击元素
		objName：字号名称
		*/
		function powersetFont(obj,objName){
			$(obj).addClass('undefontColor');
			$(obj).siblings().removeClass('undefontColor');
			power.setFontSize(objName);
		}

	//-->
	</script>
</head>
