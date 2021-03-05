/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.mobile.decision.zhkb.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.business.BaseBusinessDAO;
import com.szboanda.platform.common.annotation.AutoLoadDAO;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月19日 唐俊杰 新建
*/
@AutoLoadDAO
public interface MobileWarningTaskDAO extends BaseBusinessDAO {
	/**
	 * 分类型获取预警任务数
	 * @param type month -本月，year-本年，premonth-上月
	 * @return
	 */
	List<Map<String, Object>> getTaskCountGroupByType(@Param("type")String type);
	
	/**
	 * 获取任务总数
	 * @param type month -本月，year-本年，premonth-上月
	 * @return
	 */
	int getTaskCount(@Param("type")String type);
    
    /**
     * 获取各科室待办任务数
     * @param type
     * @return
     */
    List<Map<String, Object>> getNeedHandleTasksGroupByDept(@Param("type")String type);
       
    /**
     * 日志分组信息
     * @param type
     * @return
     */
    List<Map<String, Object>> listLoginLogs(@Param("type")String type);
}
