/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.dqxt.rwzx.exception.TaskCenterException;
import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;


/**
* @Title:任务中心DAO
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月21日 唐俊杰 新建
*/
@AutoLoadDAO
public interface TaskCenterDAO extends BaseDAO {
    /**
     * 查询任务列表
     * @param param 查询的多个条件
     * @return
     * @throws TaskCenterException
     */
    List<Map<String, Object>> queryTasks(Map<String, Object> param) throws TaskCenterException;
    
    /**
     * 查询超期任务
     * @param param 查询的多个条件
     * @return
     * @throws TaskCenterException
     */
    List<Map<String, Object>> queryOvertimeTasks(Map<String, Object> param) throws TaskCenterException;

    /**
     * 根据序号获取任务详情
     * @param xh 序号
     * @return
     */
    Map<String, Object> getTaskById(@Param("XH")String xh);
    
    /**
     * 获取所有部门科室
     * @param xh 序号
     * @return
     */
    List<Map<String, Object>> getAllDepartments();
    
    /**
     * 查询附件信息
     * @Title: queryFjxx
     * @Description: TODO
     * @param @param xh
     * @param @return   
     * @return List<Map<String,Object>>   
     * @throws
     * @author 朱传露
     */
    List<Map<String, Object>> queryFjxx(@Param("XH")String xh);
    
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
