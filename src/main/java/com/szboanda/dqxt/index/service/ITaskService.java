/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.service;

import java.util.List;
import java.util.Map;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月16日 唐俊杰 新建
*/
public interface ITaskService {
    /**
     * 获取各科室待办报警信息
     * @return
     */
    List<Map<String, Object>> getNeedHandleTasksGroupByDept();

    /**
     * 获取科室预警任务办理排名
     * @return
     */
    List<Map<String, Object>> getTaskHandleOrderInfo(String type);

    /**
     * 返回预警任务类型列表
     * @param type
     * @return
     */
    Map<String, Object> getTaskTypeInfo(String type);

    /**
     * 查询当年的每个月的任务数和办结情况
     * @return
     */
    List<Map<String, Object>> getAnnualTrend();
    
    /**
     * 查询当年的每个月的任务数和办结情况 PC
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
    Map<String, Object> insertTaskRecord(Map<String, Object> params);
    
    /**
     * 添加负责人与业务关联信息
     * @Title: save
     * @Description: TODO
     * @param @return   
     * @return int   
     * @throws
     * @author 朱传露
     */
    int save(String yhmc, String bmmc, String yjlx, String blqx);
    
    void checkWarningTaskExpired();

}
