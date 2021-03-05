/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.yjrwbl.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.szboanda.business.BaseBusinessDAO;
import com.szboanda.mobile.decision.yjrwbl.exception.WarningTaskException;
import com.szboanda.mobile.decision.zhkb.exception.WryException;
import com.szboanda.platform.common.annotation.AutoLoadDAO;

/**
 * 钉钉端:预警任务办理
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月17日
 * @version:    V1.0
 */
@AutoLoadDAO
public interface WarningTaskDAO extends BaseBusinessDAO {

    /**
     * 查询【移动决策-预警任务】业务集合
     * @param searchInfo 业务Map对象
     * @return 业务集合
     * @throws WarningTaskException
     */
    List<Map<String, Object>> queryTasks(Map<String, Object> searchInfo) throws WarningTaskException;

   /* *//**
     * 根据任务名称模糊查询【移动决策-预警任务办理】业务集合
     * @param searchInfo 配置的筛选条件
     * @return
     * @throws WarningTaskException
     *//*
    List<Map<String, Object>> getTasksByRwmc(Map<String, Object> searchInfo) throws WarningTaskException;*/

    /**
     * 查询【移动决策-预警任务】某个预警信息
     * @param searchInfo 业务Map对象
     * @return
     * @throws WryException
     */
    Map<String, Object> getTaskById(@Param("XH") String xh) throws WarningTaskException;

    /**
     * 修改【修改任务的状态:代表办理完成任务】业务
     * @param model 业务Map对象
     * @return int  返回操作标识符
     * @throws WarningTaskException
     */
    int updateTaskStatus(Map<String, Object> model) throws WarningTaskException;

    /**
     * 保存反馈信息
     * @param params
     * @return
     * @throws WarningTaskException
     */
    int saveTaskFeedBack(Map<String, Object> params) throws WarningTaskException;

    /**
     * 查询附件
     * @param xh 序号
     * @return
     */
    List<Map<String, Object>> queryFjxx(@Param("XH")String xh);
    
    /**
     * 插入流转信息
     * @param params
     * @return
     */
    int insertLzxx(Map<String, Object> params);
    
    /**
     * 更新流转信息
     * @param params
     * @return
     */
    int updateLzxx(Map<String, Object> params);
    
    /**
     * 查询反馈内容（如果为空，则是新添加的记录，客户未实际提交内容）
     * @param xh
     * @return
     */
//    String queryFknr(@Param("XH")String xh);
    
    /**
     * 获取任务的流转状态
     * @param xh
     * @return
     */
    String queryLzzt(@Param("XH")String xh);
    
    /**
     * 获取用户列表
     * @return
     */
    List<Map<String, Object>> listUsers();
    /**
     * 获取该任务的流转记录
     * @param rwbh
     * @return
     */
    List<Map<String, Object>> listLzxx(@Param("RWBH")String rwbh);
    
    /**
     * 根据rwbh和blr查询流转信息
     * @param params
     * @return
     */
    int queryLzxx(Map<String, Object> params);
}