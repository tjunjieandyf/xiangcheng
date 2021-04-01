/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.job;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.szboanda.job.dao.OtherDataSourceDAO;
import com.szboanda.job.dao.UserAndDeptDAO;
import com.szboanda.job.service.IUserAndDeptService;
import com.szboanda.job.service.impl.UserAndDeptServiceImpl;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.system.job.AbstractBaseJob;

/**
* @Title: 用户和部门信息同步
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月30日 唐俊杰 新建
*/
public class SyncJob extends AbstractBaseJob{
    
    @Override
    public String getRunLog() {
        return null;
    }

    @Override
    public void run(JobExecutionContext arg0, List<Map<String, Object>> arg1) throws JobExecutionException {
        IUserAndDeptService service=(IUserAndDeptService) Toolkit.getSpringBean(UserAndDeptServiceImpl.class);
        service.syncDept();
        service.syncUser();
    }

}
