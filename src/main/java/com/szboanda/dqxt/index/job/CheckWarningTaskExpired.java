/******************************************************************************
 * Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/
package com.szboanda.dqxt.index.job;

import java.util.List;
import java.util.Map;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.szboanda.dqxt.index.service.ITaskService;
import com.szboanda.dqxt.index.service.impl.TaskServiceImpl;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.system.job.AbstractBaseJob;

/**
 * 检查预警任务是否过期 
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月23日
 * @version:    V1.0
 */
public class CheckWarningTaskExpired extends AbstractBaseJob {

    /** (非 Javadoc)
     * <p>Description: </p>
     * @param jobContext
     * @param jobItem
     * @throws JobExecutionException
     * @see com.szboanda.platform.system.job.AbstractBaseJob#run(org.quartz.JobExecutionContext, java.util.List)
     */
    @Override
    public void run(JobExecutionContext jobContext, List<Map<String, Object>> jobItem) throws JobExecutionException {
    	
    	ITaskService service = (TaskServiceImpl) Toolkit.getSpringBean(TaskServiceImpl.class);
        service.checkWarningTaskExpired();
    }

    /** (非 Javadoc)
     * <p>Description: </p>
     * @return
     * @see com.szboanda.platform.system.job.AbstractBaseJob#getRunLog()
     */
    @Override
    public String getRunLog() {
        return "检查预警任务是否过期";
    }

}
