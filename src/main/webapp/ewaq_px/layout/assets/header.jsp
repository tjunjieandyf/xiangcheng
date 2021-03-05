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
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>${sessionScope.pageTitle}</title>
<link rel="icon" href="${ctx }/pages/platform/layout/favicon.ico" type="image/x-icon" />  
<link rel="shortcut icon" href="${ctx }/pages/platform/layout/favicon.ico" type="image/x-icon" />
<nbean:css foldar="ewaq_px" path="layout/assets/css/element.css"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/jquery-1.11.1.min.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/echarts.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/liquidFill.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/vue.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/element.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/layer/layer.js"/>
</head>
</html>
