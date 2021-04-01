/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.job.service;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月31日 唐俊杰 新建
*/
public interface IUserAndDeptService {
    /**
     * 用户同步
     */
    void syncUser();
    /**
     * 部门同步
     */
    void syncDept();
}
