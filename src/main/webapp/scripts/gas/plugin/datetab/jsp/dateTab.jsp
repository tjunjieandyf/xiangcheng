<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"
%><%@page import="org.apache.commons.beanutils.DynaBean"
%><%@page import="org.apache.commons.beanutils.LazyDynaBean"
%><%@page import="com.szboanda.platform.v3.util.DateUtils"
%><%@page import="com.szboanda.gas.common.utils.DateUtilsEx"
%><%@page import="net.sf.json.JSONArray"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" 
%><%
	String ybcsrq =  request.getParameter("ybcsrq");
    String ybhour=  request.getParameter("ybHour");
    String delay =  request.getParameter("delay");
    String sjjg=  request.getParameter("sjjg");
	int s_offhour = 24*Integer.parseInt(delay);
	int e_offhour = Integer.parseInt(ybhour);
	int t_sjjg = Integer.parseInt(sjjg)<1?1:Integer.parseInt(sjjg);
	Date curDate = DateUtils.parseDate(ybcsrq,DateUtils.F_YYYY_MM_DD);
	Date sDate = DateUtils.delay(curDate,Calendar.HOUR_OF_DAY,s_offhour);
	Date eDate = DateUtils.delay(sDate,Calendar.HOUR_OF_DAY,e_offhour);
	int dateDiff = DateUtils.dateDiff(sDate,eDate,Calendar.DAY_OF_MONTH);
	List<Map<String,Object>> jsonList = new ArrayList<Map<String,Object>>();
	Map<String,Object> map = null;
	for(int i=0;i<=dateDiff;i++){
		map = new LinkedHashMap<String,Object>();
		Date tmpDate = DateUtils.delay(sDate,i);
		String tmpDateStr = DateUtils.simpleDateFormat(tmpDate,DateUtils.F_YYYY_MM_DD);
		String key = DateUtils.stringFormat(tmpDate,DateUtilsEx.MM_DD);
		Calendar tmpCal =  Calendar.getInstance();
		tmpCal.setTime(tmpDate);
		int tmpHour =tmpCal.get(Calendar.HOUR_OF_DAY);
		List<DynaBean> list = new ArrayList<DynaBean>();
		if(tmpHour == 0){
			for(int j=0;j<24;j=j+t_sjjg){
				String hourStr = "";
				if(j<10){
					hourStr = "0"+j;
				}else{
					hourStr = String.valueOf(j);
				}
				DynaBean bean = new LazyDynaBean();
				bean.set("ybsj",tmpDateStr+" "+hourStr);
				bean.set("text",DateUtils.stringFormat(tmpDate,DateUtils.C_YYYY_MM_DD)+" "+hourStr+"时");
				bean.set("xsxs",hourStr+"时");
				list.add(bean);
			}
		}else{
			
		}
		map.put("key",key);
		map.put("value",list);
		jsonList.add(map);
	}
	JSONArray json = JSONArray.fromObject(jsonList);
	response.getWriter().write(json.toString());
%>