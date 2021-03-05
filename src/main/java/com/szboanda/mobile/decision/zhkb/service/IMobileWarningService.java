/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.mobile.decision.zhkb.service;

import java.util.List;
import java.util.Map;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月19日 唐俊杰 新建
*/
public interface IMobileWarningService {
    /**
     * 分类型获取预警任务数
     * @return
     */
	Map<String, Object> getTaskCountGroupByType(String type);
    /**
     * 获取各科室待办任务数
     * @param param 指定查询类型（今天/当月）
     * @return
     */
	List<Map<String, Object>> getNeedHandleTasksGroupByDept(Map<String, Object> param);
	/**
	 * 获取日志统计信息
	 * @param type
	 * @return
	 */
	List<Map<String, Object>> getLoginLog(String type);
}
