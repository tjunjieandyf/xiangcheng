package com.szboanda.dqxt.index.job;

import java.util.List;
import java.util.Map;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.szboanda.dqxt.index.service.ITqybService;
import com.szboanda.dqxt.index.service.impl.TqybServiceImpl;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.system.job.AbstractBaseJob;

/**
 * 同步天气预报数据 
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 彭志群
 * @date 2020年10月28日
 * @version:    V1.0
 */
public class AsynTqybJob extends AbstractBaseJob {

    /** 
     * 同步天气预报数据
     * @param jobContext
     * @param jobItem
     * @throws JobExecutionException
     */
    @Override
    public void run(JobExecutionContext jobContext, List<Map<String, Object>> jobItem) throws JobExecutionException {
    	
    	ITqybService service = (TqybServiceImpl) Toolkit.getSpringBean(TqybServiceImpl.class);
        service.asynTqybData();
    }

    /** 
     * @return
     * @see com.szboanda.platform.system.job.AbstractBaseJob#getRunLog()
     */
    @Override
    public String getRunLog() {
        return "同步天气预报数据";
    }

}
