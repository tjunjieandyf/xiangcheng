<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"
%><%@page import="com.szboanda.platform.v3.util.helper.ActionHelper"
%><%@page import="com.szboanda.gas.resources.StationCache"
%><%@page import="org.apache.commons.beanutils.DynaBean"
%><%@page import="com.szboanda.gas.common.bean.Constants"
%><%@page import="com.szboanda.gas.common.bean.StationBean"
%><%@page import="com.szboanda.gas.common.service.ggdm.GgdmService"
%><%@page import="com.szboanda.platform.v3.util.StringUtils"
%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" 
%><%@ taglib uri="/WEB-INF/tld/struts-bean.tld" prefix="bean"
%><%
	String xzqhdm = ActionHelper.getShareOrgId();
System.out.println("----------------------------xzqhdm"+xzqhdm);
	String type = request.getParameter("type");
	String csbh = request.getParameter("xzqhdm");
 	String zdqx = request.getParameter("zdqx");
 	String checkBox = request.getParameter("checkBox");
	System.out.println("----------------------------"+zdqx);
	StationCache ser = StationCache.getInstance();
    Map<Map<String,String>,List<DynaBean>> map =null;
    List<Map<String,String>> qxzds = null; 
	if(Constants.YB_TYPE_XZQ.equals(type)){
	    map=ser.getXzq(StringUtils.isEmpty(csbh)?xzqhdm:csbh);
	}else if(Constants.YB_TYPE_AREA.equals(type)){
	    map=ser.getArea(StringUtils.isEmpty(csbh)?xzqhdm:csbh);
	}else if("QXZD".equals(type)){
		qxzds=GgdmService.getInstance().queryGgdmj("QXZD");
		
	}
	else{
		if("true".equals(zdqx)){
			List<StationBean> station = ser.getZdqxStationData();
			map= ser.getCityStationData(station,StringUtils.isEmpty(csbh)?xzqhdm:csbh);
		}else{
			List<StationBean> station = ser.getStationData(StringUtils.isEmpty(csbh)?xzqhdm:csbh);
			System.out.println("----------------------------station"+station);
			 map= ser.getCityStationData(station,StringUtils.isEmpty(csbh)?xzqhdm:csbh); 
		   
		}
	    
	}
	
	request.setAttribute("QXZD", "QXZD");
	if("QXZD".equals(type)){
	
		request.setAttribute("stationData",qxzds);
	}else{
		request.setAttribute("stationData",map);	
	}
	request.setAttribute("type",type);
	request.setAttribute("cityType",Constants.YB_TYPE_CITY);
	request.setAttribute("areaType",Constants.YB_TYPE_AREA);
	request.setAttribute("stationType",Constants.YB_TYPE_STATION);
	request.setAttribute("xzqType",Constants.YB_TYPE_XZQ);
	request.setAttribute("checkBox",checkBox);
%>
<style>
.hide{display: none;}
.show{display: block;}
</style>
<i class="inputBox-arrow"></i>
<div class="allcategorys">
<c:if test="${not empty stationData}">
	<c:choose>
		<c:when test="${type eq cityType }">
			<ul class="sublist_city">
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<li>
						<h3 class="mcate-item-hd">
							<a href="javascript:void(0);" dm = "${item.key }" lb="CITY">${item.value }</a>
								
						</h3>
					</li>
				</c:forEach>
			</ul>
		</c:when>	
		<c:when test="${type eq QXZD }">
			<ul class="sublist_city">
				
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<li>
						<h3 class="mcate-item-hd">
							<a href="javascript:void(0);" dm = "${item.DMNR }" lb="STATION">${item.DM }</a>
							
						</h3>
					</li>
				</c:forEach>
			</ul>
		</c:when>
		<c:when test="${type eq areaType }">
			<ul class="sublist_city">
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<li>
						<h3 class="mcate-item-hd">
							<c:forEach items="${item.key }" var = "city" varStatus="statCity">
								<c:if test="${statCity.index eq 0}">
									<a href="javascript:void(0);" dm = "${city.key }" lb="CITY">${city.value }</a>
								</c:if>
							</c:forEach>
						</h3>
					</li>
				</c:forEach>
			</ul>
		</c:when>
		<c:when test="${ not empty  checkBox }">
			<ul class="sublist outer">
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<c:if test="${stat.index % 3 eq 0 }">
						<div class="divider">
					</c:if>
						<li>
						<h3 class="mcate-item-hd">
							<c:forEach items="${item.key }" var = "city" varStatus="statCity">
                                <c:if test="${statCity.index eq 0}">
                                    <a href="javascript:void(0);" dm = "${city.key }" lb="CITY">${city.value }</a>
                                </c:if>
                            </c:forEach>
						</h3>
						<p class="mcate-item-bd">
							<c:forEach items="${item.value }" var = "station" varStatus="statStation">
								<div class="checkbox"><input type="checkbox" href="javascript:void(0);" dm = "${station.map.DM}" lb="STATION" name="${station.map.MC }">${station.map.MC }</input></div>
                            	
                            </c:forEach>
						</p>
					</li>
				    <c:if test="${stat.index % 3 eq 2 }">
						</div>
					</c:if>
				</c:forEach>
			</ul>
		</c:when>
		<%-- <c:when test="${type eq areaType }">
			<ul class="sublist outer">
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<c:if test="${stat.index % 3 eq 0 }">
						<div class="divider">
					</c:if>
						<li>
						<h3 class="mcate-item-hd">
							<c:forEach items="${item.key }" var = "city" varStatus="statCity">
								<c:if test="${statCity.index eq 0}">
									<a href="javascript:void(0);" dm = "${city.key }" lb="AREA">${city.value }</a>
								</c:if>
							</c:forEach>
						</h3>
						<p class="mcate-item-bd">
							<c:forEach items="${item.value }" var = "station" varStatus="statStation">
								<a href="javascript:void(0);" dm="${station.map.DM }" lb="${type}">${station.map.MC }</a>
							</c:forEach>
						</p>
					</li>
				    <c:if test="${stat.index % 3 eq 2 }">
						</div>
					</c:if>
				</c:forEach>
			</ul>
		</c:when> --%>
		<c:when test="${ not empty type }">
			<ul class="sublist outer">
				<c:forEach items="${stationData }" var = "item" varStatus="stat">
					<c:if test="${stat.index % 3 eq 0 }">
						<div class="divider">
					</c:if>
						<li>
						<h3 class="mcate-item-hd">
							<c:forEach items="${item.key }" var = "city" varStatus="statCity">
								<c:if test="${statCity.index eq 0}">
									<a href="javascript:void(0);" dm = "${city.key }" lb="CITY">${city.value }</a>
								</c:if>
							</c:forEach>
						</h3>
						<p class="mcate-item-bd">
							<c:forEach items="${item.value }" var = "station" varStatus="statStation">
								<a href="javascript:void(0);" dm="${station.map.DM }" lb="${type}">${station.map.MC }</a>
							</c:forEach>
						</p>
					</li>
				    <c:if test="${stat.index % 3 eq 2 }">
						</div>
					</c:if>
				</c:forEach>
			</ul>
		</c:when> 
		<c:otherwise>
			<ul class="sublist outer">
                <c:forEach items="${stationData }" var = "item" varStatus="stat">
                    <c:if test="${stat.index % 3 eq 0 }">
                        <div class="divider">
                    </c:if>
                        <li>
                        <h3 class="mcate-item-hd">
                            <c:forEach items="${item.key }" var = "city" varStatus="statCity">
                                <c:if test="${statCity.index eq 0}">
                                    <a href="javascript:void(0);" dm = "${city.key }" lb="CITY">${city.value }</a>
                                </c:if>
                            </c:forEach>
                        </h3>
                        <p class="mcate-item-bd">
                            <c:forEach items="${item.value }" var = "station" varStatus="statStation">
                                <a href="javascript:void(0);" dm="${station.map.DM }" lb="STATION">${station.map.MC }</a>
                            </c:forEach>
                        </p>
                    </li>
                    <c:if test="${stat.index % 3 eq 2 }">
                        </div>
                    </c:if>
                </c:forEach>
            </ul>
		</c:otherwise>
	</c:choose>
</c:if>
<c:if test="${empty stationData}">
	<ul class="sublist">
		<li>
			<h3 class="mcate-item-hd">
				<c:choose>
					<c:when test="${type eq stationType }">
						<span><a href="javascript:void(0);" dm = "99999999" lb="STATION">无数据</a></span>
					</c:when>
					<c:otherwise>
						<span><a href="javascript:void(0);" dm = "99999999" lb="CITY">无数据</a></span>
					</c:otherwise>
				</c:choose>
			</h3>
		</li>
	</ul>
</c:if>
</div>
