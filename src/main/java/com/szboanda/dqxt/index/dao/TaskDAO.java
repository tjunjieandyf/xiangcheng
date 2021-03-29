/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

/**
* @Title:预警任务首页接口DAO
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月16日 唐俊杰 新建
*/
@AutoLoadDAO
public interface TaskDAO extends BaseDAO{
    
    /**
     * 获取待办报警任务分科室情况
     * @return
     */
    List<Map<String, Object>> getNeedHandleTasksGroupByDept();
    
    /**
     * 查询各科室待办报警任务总数 
     * @return
     */
    List<Map<String, Object>> getTaskCountGroupByDept();
    
    /**
     * 查询各科室待办报警超期任务数
     * @param type all全部，month当月，year当年
     * @return
     */
    List<Map<String, Object>> getOvertimeTaskCountGroupByDept(@Param("type")String type);
    
    /**
     * 查询存在超期任务的科室
     * @return
     */
    List<String> getOvertimeDepts();
    
    /**
     * 当月/当年所有的任务数
     * @param type true为当月，false为当年
     * @return
     */
    Integer getAllTaskCount(@Param("type")String type);
    
    /**
     * 当月/当年按来源统计任务数
     * @return
     */
    List<Map<String, Object>> getTaskCountGroupByLy(@Param("type")String type);
    
    /**
     * 查询当月/当年排在前五的倒序排列各科室任务数列表
     * @return
     */
    List<Map<String, Object>> getOrderedTaskCountGroupbyDept(@Param("type")String type);
    
    /**
     * 查询当年的每个月的任务数和办结情况
     * @return
     */
    List<Map<String, Object>> getAnnualTrend();
    
    /**
     * 查询当年的每个月的任务数和办结情况 PC端
     * @return
     */
    List<Map<String, Object>> getPCAnnualTrend();
    
    /**
     * 预警平台调用接口用成预警任务
     * @Title: insertTaskRecord
     * @Description: TODO
     * @param @param params
     * @param @return   
     * @return int   
     * @throws
     * @author 朱传露
     */
    int insertTaskRecord(Map<String, Object> params);
    
    /**
     * 根据业务序号查询办理一和科室
     * @Title: getTransactorByBusinessId
     * @Description: TODO
     * @param @param params
     * @param @return   
     * @return Map<String,Object>   
     * @throws
     * @author 朱传露
     */
    List<Map<String, Object>> getTransactorByBusinessId(Map<String, Object> params);
    
    
    /**
     * 更新所有未办结的任务为过期的状态
     * @Title: queryAllWarningTask
     * @Description: TODO
     * @param @return   
     * @return List<Map<String,Object>>   
     * @throws
     * @author 朱传露
     */
    int updateAllExpiredWarningTask();
    
    int save(Map<String, Object> params);
    
    List<Map<String, Object>> listTaskGroupByMarkType(@Param("type") String type);
    
}
