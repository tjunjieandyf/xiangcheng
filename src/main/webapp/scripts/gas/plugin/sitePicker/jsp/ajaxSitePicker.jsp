<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"
%><%@page import="com.szboanda.gas.resources.StationCache"
%><%@page import="com.szboanda.gas.common.bean.StationBean"
%><%@page import="net.sf.json.JSONArray"
%><%@page import="net.sf.json.JSONObject"
%><%@page import="com.szboanda.platform.v3.util.StringUtils"
%><%
	String type = request.getParameter("TYPE");
	StationCache cache = StationCache.getInstance();
	if(StringUtils.equals(type,"STATION")){
		//城市信息
		List<StationBean> cityMap = cache.getCityList();
		JSONArray cityJson = JSONArray.fromObject(cityMap);
		//request.setAttribute("cityMap",cityMap);
		//城市站点信息
		Map<String,List<StationBean>> staCityMap = cache.getStationCityMap();
		JSONArray staCityJson = JSONArray.fromObject(staCityMap);
		JSONObject json = new JSONObject();
		json.put("cityValue",cityJson);
		json.put("staCityJson",staCityJson);
		response.getWriter().write(json.toString());
	}else if(StringUtils.equals(type,"CITY")){
		//城市信息
		List<StationBean> cityMap = cache.getCityList();
		JSONArray cityJson = JSONArray.fromObject(cityMap);
		JSONObject json = new JSONObject();
		json.put("cityValue",cityJson);
		response.getWriter().write(json.toString());
	}else if(StringUtils.equals(type,"AREA")){
		List<StationBean> areaList = cache.getAreaList();
		JSONArray areaJson = JSONArray.fromObject(areaList);
		JSONObject json = new JSONObject();
		json.put("areaValue",areaJson);
		response.getWriter().write(json.toString());
	}else if(StringUtils.equals(type,"XZQ")){
		//城市信息
		List<StationBean> cityMap = cache.getCityList();
		JSONArray cityJson = JSONArray.fromObject(cityMap);
		//城市站点信息
		Map<String,List<StationBean>> xzqCityMap = cache.getXzqCityMap();
		JSONArray xzqCityJson = JSONArray.fromObject(xzqCityMap);
		JSONObject json = new JSONObject();
		json.put("cityValue",cityJson);
		json.put("xzqCityJson",xzqCityJson);
		response.getWriter().write(json.toString());
		
	}
	
	//request.setAttribute("staCityValue",staCityJson);
%>