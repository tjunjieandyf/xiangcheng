/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.job.dao;

import java.util.List;
import java.util.Map;

import com.szboanda.platform.common.annotation.AutoLoadDAO;
import com.szboanda.platform.common.base.BaseDAO;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月30日 唐俊杰 新建
*/
@AutoLoadDAO
public interface OtherDataSourceDAO extends BaseDAO {
    String dataSource = "jdbc/sjzx";
    /**
     * 查询用户列表
     * @return
     */
    List<Map<String, Object>> queryUsers();
    /**
     * 查询部门列表
     * @return
     */
    List<Map<String, Object>> queryDepts();
}
