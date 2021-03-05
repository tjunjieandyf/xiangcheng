package com.szboanda.smart.geo.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.szboanda.platform.v3.util.StringUtils;
import com.szboanda.smart.geo.service.PollutionForecastService;

import cn.hutool.core.map.MapUtil;

/**
 *
 */
@Controller
@RequestMapping("/api/pollutionForecast")
public class PollutionForecastController {
	/**
	 * Logger
	 */
	private static final Logger LOGGER = Logger.getLogger(PollutionForecastController.class);

	/**
	 * 污染源预判服务
	 */
	@Resource
	private PollutionForecastService service;

	/**
	 * 获取报警企业信息
	 * @param jcsj 监测时间
	 * @param rings 图形，多个环
	 * @return
	 */
	@RequestMapping(value = "/getAlarmEnterpriseInfo", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getAlarmEntepriseInfo(String jcsj, String rings) {
		Map<String, Object> responseData = new HashMap<>();
		Object data = service.getAlarmEnterpriseInfo(jcsj, rings);
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}

	/**
	 *根据风速风向获取对应的报警企业信息
	 * @param jcsj 监测时间
	 * @param x 经度
	 * @param y 维度
	 * @param windDirection 风向
	 * @param winVelocity 风速
	 * @return 返回企业信息列表集合
	 */
	@RequestMapping(value = "/getAlarmEnterpriseInfoByWind", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getEntepriseInfoByWind(String jcsj, String x, String y, String windDirection, String winVelocity, 
			String wrw) {
		Map<String, Object> responseData = new HashMap<>();
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd HH").parse(jcsj);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage());
		}

		Map<String, Object> data = service.getAlarmEnterpriseInfo(date, Double.parseDouble(x), Double.parseDouble(y),
				Float.parseFloat(windDirection), Float.parseFloat(winVelocity));
		
	    //对扬尘源和工业源排序 
        if (!StringUtils.isEmpty(wrw)) {
        	@SuppressWarnings("unchecked")
        	Map<String, List<Map<String, Object>>> features = (Map<String, List<Map<String, Object>>>) data.get("data");
        	if (!MapUtil.isEmpty(features)) {
        		service.orderByEnterpriseAndDusting(features, date, wrw);
        		data.put("data", features);
        	}
        }
		
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}

	/**
	 根据所属的行政区获取
	 * @param jcsj
	 * @param x
	 * @param y
	 * @param city   所属地市
	 * @param region 所属区县
	 * @return
	 */
	@RequestMapping(value = "/getAlarmEnterpriseInfoByRegion", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getAlarmEnterpriseInfoByRegion(String jcsj, String x, String y, String city, String region, String wrw) {
		Map<String, Object> responseData = new HashMap<>();
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd HH").parse(jcsj);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage());
		}

		Map<String, Object> data = service.getAlarmEnterpriseInfoByRegion(date, Double.parseDouble(x), Double.parseDouble(y), city,
				region);
		
	    //对扬尘源和工业源排序 
        if (!StringUtils.isEmpty(wrw)) {
        	@SuppressWarnings("unchecked")
			Map<String, List<Map<String, Object>>> features = (Map<String, List<Map<String, Object>>>) data.get("data");
        	if (!MapUtil.isEmpty(features)) {
        		service.orderByEnterpriseAndDusting(features, date, wrw);
        		data.put("data", features);
        	}
        }
		
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}

	/**
	 *
	 * @param jcsj
	 * @param centerX
	 * @param centerY
	 * @param city
	 * @param region
	 * @param nearestStationType
	 * @param includedEnterpriseInfo
	 * @param includedEnterpriseInNearestStation
	 * @return
	 */
	@RequestMapping(value = "/getAlarmEnterpriseInfoByRegion2", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getAlarmEnterpriseInfoByRegion2(String jcsj, double centerX, double centerY, String city,
			String region, String nearestStationType, boolean includedEnterpriseInfo,
			boolean includedEnterpriseInNearestStation) {
		Map<String, Object> responseData = new HashMap<>();
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd HH").parse(jcsj);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage());
		}
		Object data = service.getAlarmEnterpriseInfo(date, centerX, centerY, city, region, nearestStationType,
				includedEnterpriseInfo, includedEnterpriseInNearestStation);
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}

	@RequestMapping(value = "/getAlarmEnterpriseInfoByCustom", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getAlarmEnterpriseInfoByCustom(String jcsj, double centerX, double centerY, float windDirection,
			float winVelocity, String nearestStationType, boolean includedEnterpriseInfo,
			boolean includedEnterpriseInNearestStation, String wrw) {
		Map<String, Object> responseData = new HashMap<>();
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd HH").parse(jcsj);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage());
		}
		Map<String, Object> data = service.getAlarmEnterpriseInfo(date, centerX, centerY, windDirection, winVelocity,
				nearestStationType, includedEnterpriseInfo, includedEnterpriseInNearestStation);
		
		//对扬尘源和工业源排序 
        if (!StringUtils.isEmpty(wrw)) {
        	@SuppressWarnings("unchecked")
        	Map<String, Object> enterpriseInfoMap = (Map<String, Object>) data.get("includedEnterpriseInfo");
        	@SuppressWarnings("unchecked")
			Map<String, List<Map<String, Object>>> features = (Map<String, List<Map<String, Object>>>) enterpriseInfoMap.get("data");
        	if (!MapUtil.isEmpty(features)) {
        		service.orderByEnterpriseAndDusting(features, date, wrw);
        		enterpriseInfoMap.put("data", features);
        		data.put("includedEnterpriseInfo", enterpriseInfoMap);
        	}
        }
		
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}

	
	/**
	 * 根据站点的经度,纬度,半经来获取企业信息
	 * @Title: getTracingEntepriseInfo
	 * @Description: TODO
	 * @param @param jcsj
	 * @param @param x
	 * @param @param y
	 * @param @param windDirection
	 * @param @param winVelocity
	 * @param @param wrw
	 * @param @return   
	 * @return Object   
	 * @throws
	 * @author 朱传露
	 */
	@RequestMapping(value = "/getTracingEntepriseInfo", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	@ResponseBody
	public Object getTracingEntepriseInfo(String jcsj, String x, String y, String windDirection, String width) {
		Map<String, Object> responseData = new HashMap<>();
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd HH").parse(jcsj);
		} catch (ParseException e) {
			LOGGER.error(e.getMessage());
		}
		
		float windD = 0.0f;
		if (!StringUtils.isEmpty(windDirection)) {
			windD = Float.parseFloat(windDirection);
		}
		Map<String, Object> data = service.getTracingEnterpriseInfo(date, Double.parseDouble(x), Double.parseDouble(y),
				windD, Float.parseFloat(width));
		
		responseData.put("data", data);
		responseData.put("status", "000");
		return responseData;
	}
}
