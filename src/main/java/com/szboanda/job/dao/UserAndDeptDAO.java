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
* @history 2021年3月31日 唐俊杰 新建
*/
@AutoLoadDAO
public interface UserAndDeptDAO extends BaseDAO {
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
    /**
     * 插入用户
     * @param param
     * @return
     */
    int insertUser(Map<String, Object> param);
    /**
     * 插入部门
     * @param param
     * @return
     */
    int insertDept(Map<String, Object> param);
    /**
     * 更新用户
     * @param param
     * @return
     */
    int updateUser(Map<String, Object> param);
    /**
     * 更新部门
     * @param param
     * @return
     */
    int updateDept(Map<String, Object> param);
    
    /**
     * 删除用户
     * @param param
     * @return
     */
    int deleteUser(Map<String, Object> param);
    /**
     * 删除部门
     * @param param
     * @return
     */
    int deletDept(Map<String, Object> param);
}
