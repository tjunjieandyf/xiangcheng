package com.szboanda.smart.geo.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.collections.map.HashedMap;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.testng.annotations.Test;

import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.v3.util.BeanUtils;
import com.szboanda.smart.geo.dao.AirStationDAO;
import com.szboanda.smart.geo.dao.CommonDAO;
import com.szboanda.smart.geo.dao.PollutionSourcesDAO;
import com.szboanda.smart.geo.domain.EsriCoordinate;
import com.szboanda.smart.geo.domain.EsriFeature;
import com.szboanda.smart.geo.domain.Feature;
import com.szboanda.smart.geo.geoservice.GeometryUtil;
import com.szboanda.smart.geo.service.PollutionForecastService;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.NumberUtil;
/**
 * PollutionForecastServiceImpl
 */
@Service
public class PollutionForecastServiceImpl implements PollutionForecastService {

    /**
     * Logger
     */
    private static final Logger LOGGER = LogManager.getLogger(PollutionForecastService.class);
    
    /**
     * 经纬度距离转换系数
     */
    public static final String DISTANCE_TRAN_COEFFICIENT = "110";

    /**
     * PollutionSourcesDAO
     */
    private PollutionSourcesDAO pollutionSourcesDAO;

    /**
     * VehicleRemoteSensingDAO
     */
//    private VehicleRemoteSensingDAO vehicleRemoteSensingDAO;

    /**
     * VocEnterpriseDAO
     */
//    private VocEnterpriseDAO vocEnterpriseDAO;

    /**
     * ConstructionRaiseDustDAO
     */
//    private ConstructionRaiseDustDAO constructionRaiseDustDAO;

    /**
     * AirStationDAO
     */
    private AirStationDAO airStationDAO;

    /**
     * CommonDAO
     */
    private CommonDAO commonDAO;

    //如果速度太慢就在内存进行缓存
    //private static Map<String,List<Feature>> cacheData = new HashedMap();
    /**
     * getAlarmEnterpriseInfo
     */
    @Override
    public Map<String, List<Map<String, Object>>> getAlarmEnterpriseInfo(String jcsj, String rings) {
        Geometry geometry = GeometryUtil.fromRingString(rings);
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH");
        Map<String, Object> params = new HashedMap();
        Date dDate = null;
        try {
            dDate = format.parse(jcsj);
            params.put("JCSJ", dDate);
        } catch (ParseException e) {
        	LOGGER.error(e);
            params.put("JCSJ", new Date());
        }
        return getFeatures2(dDate, geometry);
    }

    private void initDAO() {

        if (this.pollutionSourcesDAO == null) {
        	pollutionSourcesDAO = Toolkit.getBean(PollutionSourcesDAO.class);
        }
//        if (this.vehicleRemoteSensingDAO == null) {
//        	vehicleRemoteSensingDAO = Toolkit.getBean(VehicleRemoteSensingDAO.class);
//        }
//        if (this.constructionRaiseDustDAO == null){
//        	constructionRaiseDustDAO = Toolkit.getBean(ConstructionRaiseDustDAO.class);
//        }
        if (this.airStationDAO == null) {
        	airStationDAO = Toolkit.getBean(AirStationDAO.class);
        }
//        if (this.vocEnterpriseDAO == null) {
//        	vocEnterpriseDAO = Toolkit.getBean(VocEnterpriseDAO.class);
//        }
        if (this.commonDAO == null) {
        	commonDAO = Toolkit.getBean(CommonDAO.class);
        }
    }


    /**
     * 根据图形获取污染源、机动车遥感、扬尘点位数据
     *
     * @param geometry
     * @param data
     * @return
     */
    private Map<String, List<Map<String, Object>>> getFeatures2(Geometry geometry, Map<String, List<Map<String, Object>>> data) {
        Map<String, List<Map<String, Object>>> resultData = new HashMap<>();
        for (Entry<String, List<Map<String, Object>>> entry : data.entrySet()) {
        	String key = entry.getKey();
            List<Feature> features = (List<Feature>) GeometryUtil.getPointFeatures(entry.getValue(), "JD", "WD");
            List<Map<String, Object>> containFeatures = new ArrayList<>();
            for (Feature fe : features) {
                if (geometry.contains(fe.getGeometry())) {
                    containFeatures.add(fe.getAttributes());
                }
            }
            resultData.put(key, containFeatures);
        }
        return resultData;
    }
    
    private Map<String, List<Map<String, Object>>> getFeatures2(Date jcsj, Geometry geometry) {
        Map<String, List<Map<String, Object>>> features = new HashMap<>();
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("JCSJ", jcsj);
            Date startDate = DateUtil.offset(jcsj, DateField.MINUTE, -5);
            String startDateStr = DateUtil.formatDateTime(startDate);
            String endDateStr = DateUtil.formatDateTime(jcsj);
            params.put("startDateStr", startDateStr);
            params.put("endDateStr", endDateStr);
//            List<Map<String, Object>> lstMotorVehicleBaseInfo = this.vehicleRemoteSensingDAO.getMotorVehicleBaseInfo(params);
            List<Map<String, Object>> lstEnterpriseBaseInfo = this.pollutionSourcesDAO.getEnterpriseBaseInfo(params);
//            List<Map<String, Object>> lstDustingSourcesBaseInfo = this.constructionRaiseDustDAO.getDustingSourcesBaseInfo(params);

            startDate = DateUtil.offset(jcsj, DateField.HOUR, -1);
            startDateStr = DateUtil.formatDateTime(startDate);
            endDateStr = DateUtil.formatDateTime(jcsj);
            params.put("startDateStr", startDateStr);
            params.put("endDateStr", endDateStr);

//            List<Map<String, Object>> listVOCVocEnterpriseBaseInfo = this.vocEnterpriseDAO.getVOCBaseInfo(params);
            Map<String, List<Map<String, Object>>> requestData = new HashMap<>();
            requestData.put("WRY", lstEnterpriseBaseInfo);
//            requestData.put("JDC", lstMotorVehicleBaseInfo);
//            requestData.put("YCY", lstDustingSourcesBaseInfo);
//            requestData.put("VOC", listVOCVocEnterpriseBaseInfo);
            features = this.getFeatures2(geometry, requestData);
        } catch (RuntimeException e) {
        	LOGGER.error(e);
        }
        return features;
    }

    /**
     * getAlarmEnterpriseInfo
     */
    public Map<String, Object> getAlarmEnterpriseInfo(Date jcsj, double x, double y, float windDirection, float winVelocity) {
        this.initDAO();
        Map<String, Object> params = new HashMap<>();
        params.put("JCSJ", jcsj);
        Date startDate = DateUtil.offset(jcsj, DateField.MINUTE, -5);
        String startDateStr = DateUtil.formatDateTime(startDate);
        String endDateStr = DateUtil.formatDateTime(jcsj);
        params.put("startDateStr", startDateStr);
        params.put("endDateStr", endDateStr);
//        List<Map<String, Object>> lstMotorVehicleBaseInfo = this.vehicleRemoteSensingDAO.getMotorVehicleBaseInfo(params);
        List<Map<String, Object>> lstEnterpriseBaseInfo = this.pollutionSourcesDAO.getEnterpriseBaseInfo(params);
//        List<Map<String, Object>> lstDustingSourcesBaseInfo = this.constructionRaiseDustDAO.getDustingSourcesBaseInfo(params);


        startDate = DateUtil.offset(jcsj, DateField.HOUR, -1);
        startDateStr = DateUtil.formatDateTime(startDate);
        endDateStr = DateUtil.formatDateTime(jcsj);
        params.put("startDateStr", startDateStr);
        params.put("endDateStr", endDateStr);

//        List<Map<String, Object>> listVOCVocEnterpriseBaseInfo = this.vocEnterpriseDAO.getVOCBaseInfo(params);
        
//        Polygon geometry = GeometryUtil.createSector(new Coordinate(x, y), winVelocity,
//                windDirection - 45, windDirection + 45, 60);
        
        Polygon geometry = null;
        if (winVelocity <= 0) {
        	geometry = GeometryUtil.createSector(new Coordinate(x, y), 0.05f,
        			0, 360, 60);
        } else {
        	geometry = GeometryUtil.createSector(new Coordinate(x, y), winVelocity,
        			windDirection - 45, windDirection + 45, 60);
        }
        
        Map<String, List<Map<String, Object>>> requestData = new HashMap<>();
        requestData.put("WRY", lstEnterpriseBaseInfo);
//        requestData.put("JDC", lstMotorVehicleBaseInfo);
//        requestData.put("YCY", lstDustingSourcesBaseInfo);
//        requestData.put("VOC", listVOCVocEnterpriseBaseInfo);
        Map<String, List<Map<String, Object>>> features = this.getFeatures2(geometry, requestData);
        Map<String, Object> dataResult = new HashMap<>();
        Feature fe = new Feature();
        fe.setGeometry(geometry);
        fe.setAttributes(new HashedMap());
        dataResult.put("sector", new EsriFeature().fromFeature(fe).getGeometry());
        dataResult.put("data", features);
        return dataResult;
    }

    /**
     * 对获取的工业源和污染源排序:判断优先级：1  重点源有报警消息的     2 非重点源有超标报警的企业     3  若1.2都没有  则判断范围内的重点源企业
     * @param lstMotorVehicleBaseInfo
     * @param lstDustingSourcesBaseInfo
     * @param jcsj
     * @param  wrw   
     * @author 朱传露
     */
    public void orderByEnterpriseAndDusting(Map<String, List<Map<String, Object>>> resultData, Date jcsj, String wrw) {
    	 //查询最近二十四小时的报警信息
    	 Date startDate = DateUtil.offset(jcsj, DateField.HOUR, -24);
         String startDateStr = DateUtil.formatDateTime(startDate);
         String endDateStr = DateUtil.formatDateTime(jcsj);
         Map<String, Object> params = new HashMap<>();
         params.put("STARTDATE", startDateStr);
         params.put("ENDDATE", endDateStr);
         List<Map<String, Object>> bjxxList = commonDAO.getBjxxList(params);
         
         // 重点源有报警信息的且首要污染物的企业
         
         // 污染源所有的报警
         List<String> wryAlarmEnterpris = new ArrayList<>();
         
//         // 扬尘源所有的报警
//         List<String> ycyAlarmEnterpris = new ArrayList<>();
//         
//         // 机动车所有的报警
//         List<String> jdcAlarmEnterpris = new ArrayList<>();
//         
//         // VOC所有的报警
//         List<String> vocAlarmEnterpris = new ArrayList<>();
         
         /*
          * 根据污染物获取需要特别关注的报警企业 
          */
         boolean wrybs = getWryAlarmListByWrw(wryAlarmEnterpris, wrw, bjxxList);
//         boolean ycybs = getYcyAlarmListByWrw(ycyAlarmEnterpris, wrw, bjxxList);
//         boolean jdcbs = getJdcAlarmListByWrw(jdcAlarmEnterpris, wrw, bjxxList);
//         boolean vocbs = getVocAlarmListByWrw(vocAlarmEnterpris, wrw, bjxxList);

         List<Map<String, Object>> resultWryList = new ArrayList<>();// 排序后的工业源集合
//         List<Map<String, Object>> resultDustList = new ArrayList<>();// 排序后的扬尘源集合
         StringBuffer zdpcwry = new StringBuffer("重点排查污染源");// 组合重点排查污染源
         if (resultData != null && resultData.size() > 0) {
			for (Entry<String, List<Map<String, Object>>> entry : resultData.entrySet()) {
				String key = entry.getKey();
				List<Map<String, Object>> wrys = entry.getValue();
				switch (key) {
				case "WRY":
					doOrderByEnterpriseAndDusting(wryAlarmEnterpris, wrys, resultWryList, key, zdpcwry, wrybs);
					break;
//				case "YCY":
//					doOrderByEnterpriseAndDusting(ycyAlarmEnterpris, wrys, resultDustList, key, zdpcwry, ycybs);
//					break;
//				case "JDC":
//					doOrderByEnterpriseAndDusting(jdcAlarmEnterpris, wrys, null, key, zdpcwry, jdcbs);
//					break;
//				case "VOC":
//					doOrderByEnterpriseAndDusting(vocAlarmEnterpris, wrys, null, key, zdpcwry, vocbs);
//					break;
				default:
					break;
				}
			}
			resultData.put("WRY", resultWryList);
//			resultData.put("YCY", resultDustList);
			
			//组织重点排放污染源
			List<Map<String, Object>> zdpcwrwList = new ArrayList<>();
			Map<String, Object> zdpcwrwMap = new HashMap<>();
			zdpcwrwMap.put("ZDPFWRW", zdpcwry.toString());
			zdpcwrwList.add(zdpcwrwMap);
			resultData.put("ZDPFWRW", zdpcwrwList);
         }
    }
    
    /**
     *  对获取的工业源和污染源排序:判断优先级：1  重点源有报警消息的     2 非重点源有超标报警的企业     3  若1.2都没有  则判断范围内的重点源企业
     * @param @param alarmEnterpris
     * @param @param wrys
     * @param @param resultWryList
     * @param @param type
     * @param @param info   重点排查污染源组合 
     * @param @param bs   是否重点排查污染源组合 
     * @author 朱传露
     */
	public void doOrderByEnterpriseAndDusting(List<String> alarmEnterpris, List<Map<String, Object>> wrys,
			List<Map<String, Object>> resultWryList, String type, StringBuffer info, boolean bs) {
		List<Map<String, Object>> zdGyyBjList = new ArrayList<>();// 重点工业源有报警消息的
		List<Map<String, Object>> normalGyyBjList = new ArrayList<>();// 非重点源有超标报警的企业
		List<Map<String, Object>> zdGyyList = new ArrayList<>();// 重点工业源没有有报警消息的
		List<Map<String, Object>> normalGyyList = new ArrayList<>();// 非重点工业源没有有报警消息的
		String cddmColumn = ""; // 各种类型源存入报警的CDDM字段
		String cdmcColumn = ""; // 各种类型源存入报警的CDMC字段
		String sfzdqy = "0"; // 是否重点企业
		String typeDesp = "";// 类型描述
		switch (type) {
		case "WRY":
			cddmColumn = "QYBH";
			cdmcColumn = "QYMC";
			typeDesp = "工业源";
			break;
		case "YCY":
			cddmColumn = "GDBH";
			cdmcColumn = "GDMC";
			typeDesp = "扬尘源";
			break;
		case "JDC":
			cddmColumn = "CDBH";
			cdmcColumn = "CDMC";
			typeDesp = "机动车";
			break;
		case "VOC":
			cddmColumn = "qybh";
			cdmcColumn = "QYMC";
			typeDesp = "VOC";
			break;
		default:
			break;
		}
		// 
		for (Map<String, Object> tempMap : wrys) {
			String qybh = MapUtil.getStr(tempMap, cddmColumn);
			if ("WRY".equals(type)) {
//				sfzdqy = MapUtil.getStr(tempMap, "SFZDQY");; // 是否重点企业
			}
			if ("1".equals(sfzdqy) && alarmEnterpris.contains(qybh)) {
				tempMap.put("BJBS", "1");// 报警标示
				zdGyyBjList.add(tempMap);
			}
			if ("0".equals(sfzdqy) && alarmEnterpris.contains(qybh)) {
				tempMap.put("BJBS", "1");
				normalGyyBjList.add(tempMap);
			}
			if ("1".equals(sfzdqy) && !alarmEnterpris.contains(qybh)) {
				tempMap.put("BJBS", "0");
				zdGyyList.add(tempMap);
			}
			if ("0".equals(sfzdqy) && !alarmEnterpris.contains(qybh)) {
				tempMap.put("BJBS", "0");
				normalGyyList.add(tempMap);
			}
			// 扬尘源没有重点企业
		}
		// 只有工业源和扬尘源需要返回企业数据
		if (resultWryList != null) {
			if (!BeanUtils.emptyCollection(zdGyyBjList)) {
				resultWryList.addAll(zdGyyBjList);
			}
			if (!BeanUtils.emptyCollection(normalGyyBjList)) {
				resultWryList.addAll(normalGyyBjList);
			}
			if (!BeanUtils.emptyCollection(zdGyyList)) {
				resultWryList.addAll(zdGyyList);
			}
			if (!BeanUtils.emptyCollection(normalGyyList)) {
				resultWryList.addAll(normalGyyList);
			}
		}
		//组装重点排查污染源
		
		// 组装的企业个数
		if (bs) {
			// 只要是报警的, 所有企业都组装展示
			int count = 0; // 
			if (!BeanUtils.emptyCollection(wrys)) {
				info.append(typeDesp); // 有企业才组装 类型描述
				if (!BeanUtils.emptyCollection(zdGyyBjList)) {
					count = zdGyyBjList.size();
					for (Map<String, Object> temp : zdGyyBjList) {
						if (info.indexOf(MapUtil.getStr(temp, cdmcColumn)) == -1) { //去重复的企业
							info.append(MapUtil.getStr(temp, cdmcColumn)).append("、");
						}
					}
				}
				if (!BeanUtils.emptyCollection(normalGyyBjList)) {
					count += normalGyyBjList.size();
					for (Map<String, Object> temp : normalGyyBjList) {
						if (info.indexOf(MapUtil.getStr(temp, cdmcColumn)) == -1) { //去重复的企业
							info.append(MapUtil.getStr(temp, cdmcColumn)).append("、");
						}
					}
				}
				
				// 如果报警的组装的少于3个企业,则组装没有报警的企业, 最多显示三个没有报警的企业
				if (count < 3) {
					if (!BeanUtils.emptyCollection(zdGyyList)) {
						for (Map<String, Object> temp : zdGyyList) {
							if (count >= 3) {
								break;
							}
							if (info.indexOf(MapUtil.getStr(temp, cdmcColumn)) == -1) { //去重复的企业
								info.append(MapUtil.getStr(temp, cdmcColumn)).append("、");
								count++;
							}
						}
					}
					
					if (!BeanUtils.emptyCollection(normalGyyList)) {
						for (Map<String, Object> temp : normalGyyList) {
							if (count >= 3) {
								break;
							}
							if (info.indexOf(MapUtil.getStr(temp, cdmcColumn)) == -1) { //去重复的企业
								info.append(MapUtil.getStr(temp, cdmcColumn)).append("、");
								count++;
							}
						}
					}
				}
				if (info.length() > 0) {
					info.deleteCharAt(info.length() - 1).append("; ");
				}
			}
		}
	}
    
   /**
    * 通过污染物获取所有对应报警的企业:工业 源
    * @param @param wryAlarmEnterpris
    * @param @param wrw
    * @param @param bjxxList   
    * @author 朱传露
    */
	public boolean getWryAlarmListByWrw(List<String> wryAlarmEnterpris, String wrw, List<Map<String, Object>> bjxxList) {
		// 如果首要污染物是PM2.5,则是所有污染物
		boolean isZdwrpc = false; // 是否需要重点排查源
		wryAlarmEnterpris.addAll(bjxxList.stream().map(e -> MapUtil.getStr(e, "YWGLXH")).collect(Collectors.toList()));
//		if (wrw.indexOf("PM25") > -1 || wrw.indexOf("PM2.5") > -1 
//				|| wrw.indexOf("O3") > -1 || wrw.indexOf("CO") > -1) {
//			wryAlarmEnterpris.addAll(bjxxList.stream().filter(e -> "5".equals(MapUtil.getStr(e, "BJLX")))
//					.map(e -> MapUtil.getStr(e, "CDDM")).collect(Collectors.toList()));
//			isZdwrpc = true;
//		} else {
//			String[] wrwArr = wrw.split(",");
//			for (String wrwT : wrwArr) {
//				if (wrwT.indexOf("NO") > -1) {
//					wrwT = "NO";
//					isZdwrpc = true;
//				}
//				if (wrwT.indexOf("SO") > -1) {
//					wrwT = "SO2";
//					isZdwrpc = true;
//				}
//				if (wrwT.indexOf("PM10") > -1) {
//					wrwT = "烟尘";
//					isZdwrpc = true;
//				}
//				String wrwTemp = wrwT;
//				wryAlarmEnterpris.addAll(bjxxList.stream()
//						.filter(e -> MapUtil.getStr(e, "CBXM").indexOf(wrwTemp) > -1
//								&& "5".equals(MapUtil.getStr(e, "BJLX")))
//						.map(e -> MapUtil.getStr(e, "CDDM")).collect(Collectors.toList()));
//			}
//		}
		return isZdwrpc;
	}
    
	/**
	 * 通过污染物获取所有对应报警的企业:扬尘源
	 * @param wryAlarmEnterpris
	 * @param wrw
	 * @param  bjxxList
	 * @throws  朱传露
	 */
	public boolean getYcyAlarmListByWrw(List<String> ycyAlarmEnterpris, String wrw,
			List<Map<String, Object>> bjxxList) {
		// 扬尘源有当污染物是PM25和PM10, O3时才会报警
		boolean isZdwrpc = false; // 是否需要重点排查源
		String[] wrwArr = wrw.split(",");
		for (String wrwT : wrwArr) {
			if (wrwT.indexOf("PM10") > -1 || wrwT.indexOf("PM25") > -1 
					|| wrwT.indexOf("PM2.5") > -1 || wrw.indexOf("O3") > -1) {
				isZdwrpc = true;
//				String wrwTemp = wrwT;
				ycyAlarmEnterpris.addAll(bjxxList.stream()
						.filter(e -> "6".equals(MapUtil.getStr(e, "BJLX")))
						.map(e -> MapUtil.getStr(e, "CDDM")).collect(Collectors.toList()));
			}
		}
		return isZdwrpc;
	}
     
	/**
	 * 通过污染物获取所有对应报警的企业:机动车
	 * @param  wryAlarmEnterpris
	 * @param wrw
	 * @param bjxxList
	 * @throws 朱传露
	 */
	public boolean getJdcAlarmListByWrw(List<String> ycyAlarmEnterpris, String wrw,
			List<Map<String, Object>> bjxxList) {
		// 机动车有当污染物是除了SO2外的其它污染物都会报警
		boolean isZdwrpc = false; // 是否需要重点排查源
		String[] wrwArr = wrw.split(",");
		for (String wrwT : wrwArr) {
			isZdwrpc = true;
			if (wrwT.indexOf("SO2") == -1) {
				ycyAlarmEnterpris.addAll(bjxxList.stream().filter(e -> "7".equals(MapUtil.getStr(e, "BJLX")))
						.map(e -> MapUtil.getStr(e, "CDDM")).collect(Collectors.toList()));
			}
		}
		return isZdwrpc;
	}

	/**
	 * 通过污染物获取所有对应报警的企业:VOC
	 * @param  wryAlarmEnterpris
	 * @param  wrw
	 * @param  bjxxList
	 * @throws 朱传露
	 */
	public boolean getVocAlarmListByWrw(List<String> ycyAlarmEnterpris, String wrw, List<Map<String, Object>> bjxxList) {
		// VOC有当污染物是O3时才需要报警
		boolean isZdwrpc = false; // 是否需要重点排查源
		String[] wrwArr = wrw.split(",");
		for (String wrwT : wrwArr) {
			if (wrwT.indexOf("O3") > -1) {
				isZdwrpc = true;
				ycyAlarmEnterpris.addAll(bjxxList.stream().filter(e -> "8".equals(MapUtil.getStr(e, "BJLX")))
						.map(e -> MapUtil.getStr(e, "CDDM")).collect(Collectors.toList()));
			}
		}
		return isZdwrpc;
	}
    
    /**
     * getAlarmEnterpriseInfo
     */
    @Override
    public Map<String, Object> getAlarmEnterpriseInfo(double x, double y, float windDirection, float winVelocity) {
        this.initDAO();
        //Polygon geometry = GeometryUtils.createSector(new Coordinate(x, y), winVelocity, windDirection - 45, windDirection + 45, 60);
        Date jcsj = this.airStationDAO.getPointHourMaxDate();
        return this.getAlarmEnterpriseInfo(jcsj, x, y, windDirection, winVelocity);
    }


    /**
     * getAlarmEnterpriseInfo
     */
    public Map<String, Object> getAlarmEnterpriseInfo(Date jcsj, double centerX, double centerY,
                                                      float windDirection,
                                                      float winVelocity,
                                                      String nearestStationType,
                                                      boolean includedEnterpriseInfo,
                                                      boolean includedEnterpriseInNearestStation) {
        this.initDAO();
        Map<String, Object> params = new HashedMap();
        params.put("jgjb", nearestStationType);
        params.put("jcsj",jcsj);
        List<Map<String, Object>> airStationList = airStationDAO.list(params);
        List<Feature> airStationFeatures = GeometryUtil.getPointFeatures(airStationList, "JD", "WD");
        GeometryFactory geometryFactory = new GeometryFactory();
        Point point = geometryFactory.createPoint(new Coordinate(centerX, centerY));
        double distance = -1;
        Feature nearestFeature = null;
        for (Feature fe :
                airStationFeatures) {
            if (distance == -1) {
                nearestFeature = fe;
                distance = point.distance(fe.getGeometry());
            } else {
                double d = point.distance(fe.getGeometry());
                //忽略过近的点
                //&& Math.abs((distance-d))>0.001
                if (d < distance) {
                    nearestFeature = fe;
                    distance = d;
                }
            }
        }
        Map<String, Object> resultData = new HashedMap();
        if (includedEnterpriseInfo) {
            Coordinate c = new Coordinate(centerX, centerY);
            Map<String, Object> data = getAlarmEnterpriseInfo(jcsj, c.x, c.y, windDirection, winVelocity);
            resultData.put("includedEnterpriseInfo", data);
        }

        resultData.put("distance", distance);
        double judgeAngle = getJudgeAngle(point.getCoordinate(), nearestFeature.getGeometry().getCoordinate());
        if (includedEnterpriseInNearestStation && Math.abs(judgeAngle - windDirection) >= 90) {
            resultData.put("station", nearestFeature.getAttributes());
            Coordinate c = new Coordinate(
                    Double.parseDouble(nearestFeature.getAttributes().get("JD").toString()),
                    Double.parseDouble(nearestFeature.getAttributes().get("WD").toString()));
            Map<String, Object> data = getAlarmEnterpriseInfo(jcsj, c.x, c.y, windDirection, (float) distance);
            resultData.put("includedEnterpriseInNearestStation", data);
        }
        EsriCoordinate cc1 = new EsriCoordinate();
        cc1.add(centerX);
        cc1.add(centerY);
        resultData.put("center", cc1);
        return resultData;
    }

    /**
     * getAlarmEnterpriseInfoByRegion
     */
    @Override
    public Map<String, Object> getAlarmEnterpriseInfoByRegion(Date date, double centerX, double centerY, String city, String region) {
        this.initDAO();
        Map<String, Object> paramMap = new HashedMap();
        paramMap.put("jcsj",date);
        String regionStr = "";
        String cityStr = "";
        try {
            regionStr = URLDecoder.decode(region,"UTF-8");
            cityStr = URLDecoder.decode(city,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            LOGGER.error(e);
        }
        paramMap.put("ssqx",regionStr);
        paramMap.put("ssds",cityStr);
        Map<String,Object> wind = this.airStationDAO.getWindBySSQX(paramMap);
        
        float windDirection = 0.0f;
        Float winVelocity = new Float(0.0);
        // 如果没有气象数据，返回空值
        if (wind != null && wind.size() >= 0) {
        	windDirection = Float.parseFloat(wind.get("FXJD").toString());
        	winVelocity =  Float.parseFloat(wind.get("FS").toString());
        	winVelocity = NumberUtil.div( winVelocity.toString(), DISTANCE_TRAN_COEFFICIENT, 3).floatValue();
        }
        return  getAlarmEnterpriseInfo(date, centerX, centerY, windDirection, winVelocity);
    }

    /**
     * getAlarmEnterpriseInfo
     */
    @Override
    public Map<String, Object> getAlarmEnterpriseInfo(Date date, double centerX, double centerY, String city, String region, String nearestStationType, boolean includedEnterpriseInfo, boolean includedEnterpriseInNearestStation) {
        this.initDAO();
        Map<String, Object> paramMap = new HashedMap();
        paramMap.put("jcsj", date);
        paramMap.put("ssqx", region);
        paramMap.put("ssds", city);
        Map<String, Object> wind = this.airStationDAO.getWindBySSQX(paramMap);
        float windDirection = Float.parseFloat(wind.get("FXJD").toString());
        Float winVelocity =  Float.parseFloat(wind.get("FS").toString());
        winVelocity = NumberUtil.div( winVelocity.toString(), DISTANCE_TRAN_COEFFICIENT, 3).floatValue();
        return getAlarmEnterpriseInfo(date,centerX, centerY, windDirection, winVelocity, nearestStationType, includedEnterpriseInfo, includedEnterpriseInNearestStation);
    }

    /**
     * getAlarmEnterpriseInfo
     */
    public Map<String, Object> getAlarmEnterpriseInfo(double centerX, double centerY,
                                                      float windDirection,
                                                      float winVelocity,
                                                      String nearestStationType,
                                                      boolean includedEnterpriseInfo,
                                                      boolean includedEnterpriseInNearestStation) {
        this.initDAO();
        Date jcsj = this.airStationDAO.getPointHourMaxDate();
        return this.getAlarmEnterpriseInfo(jcsj, centerX, centerY,
                windDirection,
                winVelocity,
                nearestStationType,
                includedEnterpriseInfo,
                includedEnterpriseInNearestStation);
    }
//    @Override
//    public Map<String, Object> getAlarmEnterpriseInfo(double centerX, double centerY,
//                                                     float windDirection,
//                                                     float winVelocity,
//                                                     String nearestStationType,
//                                                     boolean includedEnterpriseInfo,
//                                                     boolean includedEnterpriseInNearestStation) {
//        this.initDAO();
//        Map<String, Object> params = new HashedMap();
//        params.put("jgjb", nearestStationType);
//        List<Map<String, Object>> airStationList = airStationDAO.list(params);
//        List<Feature> airStationFeatures = GeometryUtils
//               .getPointFeatures(airStationList, "JD", "WD");
//        GeometryFactory geometryFactory = new GeometryFactory();
//        Point point = geometryFactory.createPoint(
//                new Coordinate(centerX, centerY));
//        double distance = -1;
//        Feature nearestFeature = null;
//        for (Feature fe :
//                airStationFeatures) {
//            if (distance == -1) {
//                nearestFeature = fe;
//                distance = point.distance(fe.getGeometry());
//            } else {
//                double d = point.distance(fe.getGeometry());
//                //忽略过近的点
//                //&& Math.abs((distance-d))>0.001
//                if (d < distance) {
//                    nearestFeature = fe;
//                    distance = d;
//                }
//            }
//        }
//        Map<String, Object> resultData = new HashedMap();
//        if (includedEnterpriseInfo) {
//            Coordinate c = new Coordinate(centerX, centerY);
//            Map<String, Object> data = getAlarmEnterpriseInfo(c.x,
//                c.y, windDirection, winVelocity);
//            resultData.put("includedEnterpriseInfo", data);
//        }
//        resultData.put("distance", distance);
//        double judgeAngle =  getJudgeAngle(point.getCoordinate(),
//            nearestFeature.getGeometry().getCoordinate());
////        System.out.println("夹角=>"+judgeAngle+";风向=>"+windDirection);
////      if(this.hasNearestPointByWind(point,(Point)nearestFeature
//            .getGeometry(),windDirection))
//        if(Math.abs(judgeAngle -windDirection)<=90)
//       {
//            resultData.put("station", nearestFeature.getAttributes());
//            if (includedEnterpriseInNearestStation) {
//                Coordinate c = new Coordinate(
//                        Double.parseDouble(nearestFeature.getAttributes()
//                            .get("JD").toString()),
//                        Double.parseDouble(nearestFeature.getAttributes()
//                            .get("WD").toString()));
//                Map<String, Object> data = getAlarmEnterpriseInfo(c.x, c.y,
//                            windDirection, (float) distance);
//                resultData.put("includedEnterpriseInNearestStation", data);
//            }
//       }
//        EsriCoordinate cc1 = new EsriCoordinate();
//        cc1.add(centerX);
//        cc1.add(centerY);
//        resultData.put("center",cc1);
//        return resultData;
//    }


//    public Object getNearestPoint(double x, double y, double radius
//                , String shapeName) {
//        List<Map<String, Object>>  stationInfo = commonDAO
//                .getBaseInfoData(shapeName);
//        List<Feature> stationFeatures = GeometryUtils
//                .getPointFeatures(stationInfo, "JD", "WD");
//        double distance = -1;
//        GeometryFactory geometryFactory = new GeometryFactory();
//        Point point =geometryFactory.createPoint(new Coordinate(x,y));
//        Feature nearestFeature = null;
//        for (Feature fe :  stationFeatures) {
//            if (distance == -1) {
//                nearestFeature = fe;
//                distance = point.distance(fe.getGeometry());
//            } else {
//                double d = point.distance(fe.getGeometry());
//                //忽略过近的点
//                //&& Math.abs((distance-d))>0.001
//                if (d < distance) {
//                    nearestFeature = fe;
//                    distance = d;
//                }
//            }
//        }
//        return new EsriFeature().fromFeature(nearestFeature).getAttributes();
//    }



    /**
     * 获取相对于原点的角度
     * @param p1
     * @param p2
     * @return
     */
    private double getJudgeAngle(Coordinate p1,Coordinate p2) {
        double a = p2.x - p1.x;  //经度差
        double b = p2.y - p1.y;    //纬度差
        double c = Math.hypot(Math.abs(a), Math.abs(b));
        double cosy = 0.0;
        double angle = 0;
        if (a > 0 && b > 0) {                  // 判断road点在user点的东北位置
            cosy = b / c;
            angle = 0;
        } else if (a == 0 && b > 0) {           //在正北位置
            angle = -90;
        } else if (a > 0 && b < 0) {            // 判断road点在user点的东南位置
            cosy = a / c;
            angle = 90;
        } else if (a > 0 && b == 0) {           //在正东位置
            angle = 90;
        } else if (a < 0 && b < 0) {            // 判断road点在user点的西南位置
            cosy = Math.abs(b) / c;
            angle = 180;
        } else if (a == 0 && b < 0) {           //在正南位置
            angle = 90;
        } else if (a < 0 && b > 0) {            // 判断road点在user点的西北位置
            cosy = Math.abs(a) / c;
            angle = 270;
        } else if (a < 0 && b == 0) {           //在正西位置
            angle = 180;
        }
        double m = Math.acos(cosy);
        //n 即以正北为 0 的总角度
        double n = (m / Math.PI) * 180 + angle;
        return n;
    }


//    /**
//     * 判断点是否落在下风向
//     * @param center
//     * @param nearPoint
//     * @param windDirection
//     * @return
//     */
//    public boolean hasNearestPointByWind(Point center, Point nearPoint,
//                float windDirection) {
//        Integer nRegion = nRegion = getDirect(center.getCoordinate(),
//                nearPoint.getCoordinate());
//        if (windDirection <= 45 || windDirection >= 315 && 
//                    nRegion == 2) //相对于点在上方向
//        {
//            System.out.println("在上风向");
//            return false;
//        } else if (windDirection > 45 && windDirection < 135
//                    && nRegion == 1)//相对于点在右方向
//        {
//            System.out.println("在上风向");
//            return false;
//        } else if (windDirection > 135 && windDirection <= 225 
//                && nRegion == 4)//相对于点在下方向
//        {
//            System.out.println("在上风向");
//            return false;
//        } else if (nRegion == 3 && windDirection > 225 
//                    && windDirection <= 315) {
//            //相对于点在左方向
//            System.out.println("在上风向");
//            return false;
//        } else {
//            System.out.println("在下风向");
//            return true;
//        }
//    }

    /**
     * 测试
     */
    @Test
    public void point() {
        GeometryFactory geometryFactory = new GeometryFactory();
        List<Point> points = new ArrayList<>();
        points.add(geometryFactory.createPoint(new Coordinate(114.482000, 37.097000)));
        points.add(geometryFactory.createPoint(new Coordinate(114.540501, 37.092310)));
        points.add(geometryFactory.createPoint(new Coordinate(114.508158, 37.037694)));
        points.add(geometryFactory.createPoint(new Coordinate(114.484844, 37.078646)));
        Point p1 = geometryFactory.createPoint(new Coordinate(114.403000, 37.058000));
        double dx = -1;
        Point nearPoint = null;
        for (Point p : points) {
            double d = p.distance(p1);
            if (dx == -1) {
                dx = d;
                nearPoint = p;
            }
            if (dx < d) {
                dx = d;
                nearPoint = p;
            }
        }
        //double sum=Math.sqrt((n-x)*(n-x)+(m-y)*(m-y));
        /*
        double d = Math.sqrt((p1.getX() - nearPoint.getX()) * (p1.getX() 
//                - nearPoint.getX()) + (p1.getY() - nearPoint.getY())
// *               * (p1.getY() - nearPoint.getY()));
//        System.out.println(d);
        Integer nRegion = getDirect(p1.getCoordinate(), nearPoint.getCoordinate());
        if (winDir <= 45 || winDir >= 315 && nRegion == 2) //相对于点在上方向
        {
            //System.out.println("在上风向");

        } else if (winDir > 45 && winDir < 135 && nRegion == 1)//相对于点在右方向
        {
            //System.out.println("在上风向");
        } else if (winDir > 135 && winDir <= 225 && nRegion == 4)//相对于点在下方向
        {
           // System.out.println("在上风向");
        } else if (nRegion == 3 && winDir > 225 && winDir <= 315) {
            //相对于点在左方向
           // System.out.println("在上风向");
        } else {
           // System.out.println("在下风向");
        }
        */
    }

    /**
     * @param p1
     * @param p2
     * @return
     */
    int getDirect(
            Coordinate p1,
            Coordinate p2)
    {
        Integer nRegion =0;
        float fDis = (float)Math.sqrt((double)((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y)));
        if (fDis < 0.0001)
        {
            // 亮点重合
            nRegion = 0;
        }
        // 将p2转换为以p1为坐标中心的坐标系中
        p2.x -= p1.x;
        p2.y -= p1.y;
        if (Math.abs(p2.x) > Math.abs(p2.y) && p2.x > 0){
            nRegion = 1;
        }else if (Math.abs(p2.x) > Math.abs(p2.y) && p2.x < 0){
            nRegion = 3;
        }else if (Math.abs(p2.x) < Math.abs(p2.y) && p2.y < 0){
            nRegion = 2;
        }else if (Math.abs(p2.x) < Math.abs(p2.y) && p2.y > 0){
            nRegion = 4;
        }
        return nRegion;
    }
    
    /**
     * getAlarmEnterpriseInfo
     */
    public Map<String, Object> getTracingEnterpriseInfo(Date jcsj, double x, double y, float windDirection, float width) {
        this.initDAO();
        Map<String, Object> params = new HashMap<>();
        params.put("JCSJ", jcsj);
        Date startDate = DateUtil.offset(jcsj, DateField.MINUTE, -5);
        String startDateStr = DateUtil.formatDateTime(startDate);
        String endDateStr = DateUtil.formatDateTime(jcsj);
        params.put("startDateStr", startDateStr);
        params.put("endDateStr", endDateStr);
        List<Map<String, Object>> lstEnterpriseBaseInfo = this.pollutionSourcesDAO.getEnterpriseBaseInfo(params);

        startDate = DateUtil.offset(jcsj, DateField.HOUR, -1);
        startDateStr = DateUtil.formatDateTime(startDate);
        endDateStr = DateUtil.formatDateTime(jcsj);
        params.put("startDateStr", startDateStr);
        params.put("endDateStr", endDateStr);

        Polygon geometry = null;
        if (0 == windDirection) {
        	geometry = GeometryUtil.createSector(new Coordinate(x, y), width,
        			0, 360, 60);
        } else {
        	geometry = GeometryUtil.createSector(new Coordinate(x, y), width,
        			windDirection - 45, windDirection + 45, 60);
        }
        Map<String, List<Map<String, Object>>> requestData = new HashMap<>();
        requestData.put("WRY", lstEnterpriseBaseInfo);
        Map<String, List<Map<String, Object>>> features = this.getFeatures2(geometry, requestData);
        Map<String, Object> dataResult = new HashMap<>();
        Feature fe = new Feature();
        fe.setGeometry(geometry);
        fe.setAttributes(new HashedMap());
        dataResult.put("sector", new EsriFeature().fromFeature(fe).getGeometry());
        dataResult.put("data", features);
        return dataResult;
    }
}
