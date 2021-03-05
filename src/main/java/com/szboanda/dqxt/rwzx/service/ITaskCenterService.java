/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.service;

import java.util.List;
import java.util.Map;

import com.szboanda.dqxt.rwzx.exception.TaskCenterException;

/**
* @Title: 任务中心服务接口
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月21日 唐俊杰 新建
*/
public interface ITaskCenterService {
    /**
     * 根据配置的查询信息查询预警任务列表
     * @param pageSize 
     * @param pageNum 
     * @param param
     * @return
     * @throws TaskCenterException
     */
    Map<String, Object> queryTasks(int pageNum, int pageSize, Map<String, Object> param) throws TaskCenterException;

    /**
     * 根据序号查询任务信息详细信息
     * @param param
     * @return
     */
    Map<String, Object> getTaskById(String xh);
    
    /**
     * 获取所有部门科室
     * @param xh 序号
     * @return
     */
    List<Map<String, Object>> getAllDepartments();
    
    /**
     * 获取预警任务部门科室
     * @param
     * @return
     */
    List<Map<String, Object>> getYjRwDepartments();
    /**
     * 任务反馈
     * @Title: taskFeedback
     * @Description: TODO
     * @param @param param
     * @param @return   
     * @return int   
     * @throws
     * @author 朱传露
     */
    int taskFeedback(Map<String, Object> param);
    
}
