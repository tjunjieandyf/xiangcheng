/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.yjrwbl.service;

import java.util.List;
import java.util.Map;

import com.github.pagehelper.PageInfo;
import com.szboanda.mobile.decision.yjrwbl.exception.WarningTaskException;
import com.szboanda.mobile.decision.zhkb.exception.WryException;

/**
 * 钉钉端:预警任务办理
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月17日
 * @version:    V1.0
 */
public interface IWarningTaskService {

    /**
     * 查询【预警任务】业务集合
     *
     * @param   pageNum 分页数
     * @param   pageSize 分页长度
     * @param   modelInfo  业务Map集合
     * @return  返回业务集合
     * @throws  WryException
     */
    PageInfo<Map<String, Object>> queryTasks(int pageNum, int pageSize, Map<String, Object> modelInfo) throws WryException;

    /**
     * 查询【预警任务】某个预警信息
     *
     * @param   modelInfo  业务Map集合
     * @return  返回业务集合
     * @throws  WryException
     */
    Map<String, Object> getTaskById(String xh,String xtzh) throws WryException;

    /**
     * 保存任务反馈情况
     * @param params
     * @param flag true钉钉端调用，false pc端调用
     * @return
     * @throws WarningTaskException
     */
    int saveTaskFeedBack(Map<String, Object> params,boolean flag) throws WarningTaskException;
    
    /**
     * 用户列表
     * @return
     * @throws WarningTaskException
     */
    List<Map<String, Object>> listUsers() throws WarningTaskException;
}