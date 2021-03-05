<%@page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@include file="/gas/layout/header.jsp" %>
<%@page import="com.szboanda.ewaq_px.wrcbfx.*"%>
<%@page import="net.sf.json.JSONArray"%>
<%
List<Map<String, Object>> zdxx = WrcbfxService.getInstance().getSKZDXX();
System.out.println("----------------------------"+zdxx);
	request.setAttribute("jcsj", zdxx.get(0).get("JCSJ"));
	request.setAttribute("WD", zdxx.get(0).get("WD"));
	request.setAttribute("JD", zdxx.get(0).get("JD"));
	request.setAttribute("FX", zdxx.get(0).get("FX"));
    request.setAttribute("FS", zdxx.get(0).get("FS"));
	JSONArray array = new JSONArray();
	array = JSONArray.fromObject(zdxx);
	request.setAttribute("zdxx", array);
%>
<%-- <%@include file="/ewaq_px/layout/assets/header.jsp" %> --%>
<nbean:css foldar="ewaq_px" path="layout/assets/css/element.css"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/echarts.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/liquidFill.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/vue.js"/>
<nbean:css foldar="ewaq_px" path="layout/assets/js/element.js"/>


<nbean:css foldar="ewaq_px" path="wrcbfx/css/reset.css"/>
<nbean:css foldar="ewaq_px" path="wrcbfx/css/style.css"/>
<nbean:css foldar="ewaq_px" path="wrcbfx/lib/player/player.css"/>
<nbean:css foldar="ewaq_px" path="wrcbfx/css/embed.css"/>
<body class="embed">
<div class="px-pop" style="overflow: hidden;    overflow-y: scroll;" id="app">
    <div class="px-item px-message">
        <label style="display:inline-block;width:100px;position: relative;"></label>
        <select  id="cityList">
        <c:forEach items="${zdxx }" var = "item" varStatus="stat">
         <option value ="${item.get('ZDBH') }" <c:if test="${stat.index eq 0}"> selected="selected" </c:if>>${item.get('ZDMC') }</option>
           </c:forEach>
		</select>
        <label class="timer">
	        <div class="block">
			    <span class="demonstration">分析时段：</span>
			    <el-date-picker
			      @change="renderRegion"
			      v-model="time"
			      format="yyyy-MM-dd HH"
			      type="datetimerange"
			      range-separator="至"
			      start-placeholder="开始日期"
			      :picker-options="pickerOptionsEnd"
			      end-placeholder="结束日期">
			    </el-date-picker>
		  </div>
		</label>
        <div class="fr">
            <button type="button" class="btn" :class="{on: regionType== 'inside'}" @click="changeRegionType('inside')">区域内污染分析</button>
            <button type="button" style="display: none;" class="btn" :class="{on: regionType== 'outside'}" @click="changeRegionType('outside')">区域外传输分析</button>
        </div>
    </div>
    <div style="height: 890px">
    <div class="px-map-big" v-show="regionType=='outside'" style="height: 890px;background: none">
    	<iframe id="iframeBox" style="width:100%;height:100%;border:none;"></iframe>
        <!-- <div class="px-map-big-mess clearfix">
	       	
            <div class="px-item fr" style="box-shadow: 0 0 10px rgba(121,121,121,0.24)">
	             <el-radio-group v-model="pollutionType">
			      <el-radio-button label="o3">O<sub>3</sub></el-radio-button>
			      <el-radio-button label="pm25">PM<sub>2.5</sub></el-radio-button>
			    </el-radio-group>
                <h3>区域内排放源解析 </h3>
                <div class="pd-item-img">
                   <div style="width: 400px;height: 250px" id="pieChart"></div>
                </div>
                <h3>区域污染来源解析</h3>
                <div class="pd-item-img">
                    <div style="width: 400px;height: 320px" id="barChart"></div>
                </div>
            </div>
            <div class="px-map-cut fr">
                <ul>
                    <li class="on">后向</li>
                    <li>前向</li>
                </ul>
            </div>
        </div>
		<div id="palyerBar"></div>
        时间轴
        <div class="px-map-big-timer pd-item-img">
            <img src="images/timer-c.png" alt="">
        </div>   -->
    </div>
    
    <div class="px-item px-conclusion" v-show="regionType=='inside'">
        <h3>污染来源初步判定结论  <i class="edit" v-if="false"></i></h3>
        <div class="px-conclusion-mess" style="font-weight: bold;">
            {{result}} 
        </div>
    </div>
    <div class="gap"></div>
    <div class="raster" v-show="regionType=='inside'">
        <div class="row">
            <div class="col col-7">
                <div class="px-item">
                    <h3>空气质量及气象参数变化趋势</h3>
                    <div style="height: 123px;width: 100%;" id="airChart"></div>
                    <div style="height: 143px;width: 100%;" id="windChart"></div>
                    <!-- <div class="pd-item-img">
                    	
                        <img src="images/chart-a.png" alt="">
                    </div> -->
                    <div class="gap"></div><div class="gap"></div>
                    <h3>污染物浓度比值变化趋势 <i class="query">
                        <div class="px-query-mess">
                            <i class="close"></i>
                            <p>PM<sub>2.5</sub>/PM<sub>10</sub>比值都在0.5以上，表明城市的大气PM<sub>10</sub>主要是由PM<sub>2.5</sub>所构成。一般该比值越大，污染类型偏向细颗粒物污染，主要来源本地积累和附近地区传输；该比值越小，说明污染类型偏向于粗颗粒物污染，主要来自本地扬尘积累和长距离的浮沉区域传输，结合风向可判断区域传输方向。</p>
                            <br>
                            <p>SO<sub>2</sub>/NO<sub>2</sub>比值（S/N）在一定程度上指示燃煤和机动车排放的相对重要性，S/N值越高反映燃煤排放对大气污染的贡献越大。</p>
                        </div>
                    </i></h3>
                    <div class="pd-item-img">
                       <div style="height: 123px;width: 100%;" id="pollutionChart"></div>
                    </div>
                </div>
                <div class="gap"></div>
                <div class="px-item">
                    <h3>特征雷达图 <i class="query" v-if="false">
                        <div class="px-query-mess">
                            <i class="close"></i>
                            <p>PM2.5/PM10比值都在0.5以上，表明城市的大气PM10主要是由PM25所构成。一般该比值越大，污染类型偏向细颗粒物污染，主要来源本地积累和附近地区传输；该比值越小，说明污染类型偏向于粗颗粒物污染，主要来自本地扬尘积累和长距离的浮沉区域传输，结合风向可判断区域传输方向。</p>
                            <br>
                            <p>SO2/NO2比值（S/N）在一定程度上指示燃煤和机动车排放的相对重要性，S/N值越高反映燃煤排放对大气污染的贡献越大。</p>
                        </div>
                    </i></h3>
                    <div class="px-radar-roll">
                        <div class="bd" style="height: 230px;">
                             <el-carousel indicator-position="outside">
							    <el-carousel-item v-for="item in radiaNum" :key="item">
							      <div> 
							      	  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
									  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
									  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
									  <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
									</div>
							    </el-carousel-item>
							  </el-carousel>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-5">
                <div class="px-item">
                    <h3>周边污染源分析 <i class="query">
                        <div class="px-query-mess" style="background: none;">
                          <!--   <i class="close"></i> -->
                            <p><img src="${ctx}/ewaq_px/wrcbfx/images/wind.png"  width=330/></p>
                        </div>
                    </i></h3>
                    <div class="px-map-mess">
                      <iframe style="width:100%;height:100%; border:none"  webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""  src="" id="insideBox"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
   
</div>
</body>
 <nbean:ajaxUrl var="drawStationFxBhqs" clazz="com.szboanda.ewaq_px.wrcbfx.WrcbfxService" method="queryKqzlAndQxData"/> 
  <nbean:ajaxUrl var="getQXXX" clazz="com.szboanda.ewaq_px.wrcbfx.WrcbfxService" method="getQXXX"/> 
 
<!--站点选择插件  -->    
<%--  <nbean:css foldar="scripts" path="gas/plugin/listchoice/listChoice.js" />  --%>
<nbean:css foldar="scripts" path="gas/plugin/listchoice/css/system.css" />
<nbean:css foldar="scripts" path="plugin/jquery-easyui/ext/jQuery.Hz2Py-min.js" />
<script type="text/javascript">
var drawStationFxBhqs = '${drawStationFxBhqs}' ;
	var lastDate = '${lastDate}';
	var CDBH = $("#cityList").find("option:selected").val();
	var jcsj = '${jcsj}';
	var zdxx = '${zdxx}';
	zdxx = JSON.parse(zdxx);
	var getQXXX= '${getQXXX}' ;
	var startTime;
	var name = $("#cityList").find("option:selected").text();
	// 处理时间
	Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') {
        let o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (this.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
            for (let k in o) {
                if (new RegExp('(' + k + ')').test(fmt)) {
                    fmt = fmt.replace(
                        RegExp.$1,
                        RegExp.$1.length === 1
                            ? o[k]
                            : ('00' + o[k]).substr(('' + o[k]).length)
                    );
                }
            }
            return fmt;
        }
    };
	var date= new Date(Date.parse(jcsj.replace(/-/g, '/')));	
	var preDate = new Date(date.getTime() - 24*60*60*1000); //前一天
	var nextDate = new Date(date.getTime() + 24*60*60*1000); //后一天
	console.log(123);
	var JD = '${JD}';
	var WD = '${WD}';
	var FX = '${FX}';
	var FS = '${FS}';
	var bh = $("#cityList").find("option:selected").val();
	var STtype;
	var qyxz = "inside";
	let data = {
            type: 'param',
            GIS: {
                centerY: WD, //必须
                warmingType: 2,
                centerX: JD, //必须
                JGJB: 1,
                time: jcsj, //必须
                windDirection: FX, //必须
                winVelocity: FS //必须
            }
        };
	window.addEventListener(
            'message',
            function(e) {
                if (e.data.type == 'traceloadComplete') {
                    //预警gis页面加载完成
                    //执行消息的方法
                    $('#insideBox')[0].contentWindow.postMessage(data, '*'); 
                   /*  insideSrc="http://183.131.138.90:8384/DQHJJC_ZJ_SuiChang_GIS/index.html#/home/WryTraceMap";
                    $('#insideBox').attr('src', insideSrc); */
                     
                }
            },
            false
        );
     
        
         //$('#insideBox')[0].contentWindow.postMessage(data, '*'); 
        var insideSrc="http://183.131.138.90:8384/DQHJJC_ZJ_SuiChang_GIS/index.html#/home/WryTraceMap";
         $('#insideBox').attr('src', insideSrc); 

</script>

<nbean:css foldar="ewaq_px" path="wrcbfx/lib/player/player.js"/>
 <nbean:css foldar="ewaq_px" path="wrcbfx/js/index.js"/> 