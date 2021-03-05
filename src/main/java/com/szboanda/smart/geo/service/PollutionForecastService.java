package com.szboanda.smart.geo.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 污染源预判服务
 */
public interface PollutionForecastService {
    /**
     * 根据坐标获取报警企业列表信息
     * @param jcsj
     * @param rings
     * @return
     */
    Map<String, List<Map<String,Object>>> getAlarmEnterpriseInfo(String jcsj, String rings);

    /**
     * 获取受影响的企业信息
     * @param centerX 中心经度
     * @param centerY 中心维度
     * @param windDirection 风向
     * @param winVelocity 风速
     * @return
     */
    Map<String,Object> getAlarmEnterpriseInfo(double centerX,double centerY,
                                                        float windDirection,
                                                        float winVelocity);


    /**
     *
     * @param jcsj
     * @param centerX
     * @param centerY
     * @param windDirection
     * @param winVelocity
     * @return
     */
    Map<String,Object> getAlarmEnterpriseInfo(Date jcsj,double centerX,double centerY,
                                              float windDirection,
                                              float winVelocity);

    /**
     * 根据风向、风速、国控点周边点获取最新的污染源数据
     * @param centerX 经度JD
     * @param centerY 维度WD
     * @param windDirection 风向
     * @param winVelocity 风速
     * @param nearestStationType 默认1：国控
     * @param includedEnterpriseInfo 是否包含企业信息相对于centerX，centerY
     * @param includedEnterpriseInNearestStation 是否包含最近国控点的污染源企业信息
     * @return {staton:查找的国控点，distance：距离，center:当前调用的坐标,includedEnterpriseInfo:当前调用点的企业信息，includedEnterpriseInNearestStation：当前最近国控点的企业信息}
     */
    Map<String,Object> getAlarmEnterpriseInfo(double centerX,double centerY,
                                             float windDirection,
                                             float winVelocity,
                                             String nearestStationType,
                                             boolean includedEnterpriseInfo,boolean includedEnterpriseInNearestStation);

    /**
     * 根据风向、风速、国控点周边点获取指定日期的污染源数据
     * @param jcsj
     * @param centerX
     * @param centerY
     * @param windDirection
     * @param winVelocity
     * @param nearestStationType
     * @param includedEnterpriseInfo
     * @param includedEnterpriseInNearestStation
     * @return
     */
    Map<String, Object> getAlarmEnterpriseInfo(Date jcsj, double centerX, double centerY,
                                                      float windDirection,
                                                      float winVelocity,
                                                      String nearestStationType,
                                                      boolean includedEnterpriseInfo,
                                                      boolean includedEnterpriseInNearestStation);

    /**
     * 根据所属区县的风速风向获取企业信息
     * @param date
     * @param centerX
     * @param centerY
     * @param city
     * @param region
     * @return
     */
    Map<String, Object>  getAlarmEnterpriseInfoByRegion(Date date, double centerX, double centerY, String city, String region);


    /**
     * 根据所属区县的风速风向获取企业信息
     * @param date
     * @param centerX
     * @param centerY
     * @param city
     * @param region
     * @param nearestStationType
     * @param includedEnterpriseInfo
     * @param includedEnterpriseInNearestStation
     * @return
     */
    Map<String, Object> getAlarmEnterpriseInfo(Date date, double centerX, double centerY, String city, String region, String nearestStationType, boolean includedEnterpriseInfo, boolean includedEnterpriseInNearestStation);
    
    /**
     * 对获取的工业源和污染源排序:判断优先级：1  重点源有报警消息的     2 非重点源有超标报警的企业     3  若1.2都没有  则判断范围内的重点源企业
     * @Title: orderByEnterpriseAndDusting
     * @Description: TODO
     * @param @param lstMotorVehicleBaseInfo
     * @param @param lstDustingSourcesBaseInfo
     * @param @param jcsj
     * @param @param wrw   
     * @return void   
     * @throws
     * @author 朱传露
     */
    public void orderByEnterpriseAndDusting(Map<String, List<Map<String, Object>>> resultData, Date jcsj, String wrw);
    
   /**
    * 溯源企业
    * @param jcsj
    * @param centerX
    * @param centerY
    * @param windDirection
    * @param winVelocity
    * @return
    */
   Map<String,Object> getTracingEnterpriseInfo(Date jcsj,double centerX,double centerY, float windDirection, float width);
}
