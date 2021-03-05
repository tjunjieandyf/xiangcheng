/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.mobile.decision.zhkb.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.szboanda.business.BaseBusinessController;
import com.szboanda.dqxt.index.service.ITaskService;
import com.szboanda.mobile.decision.zhkb.service.IMobileWarningService;
import com.szboanda.platform.common.utils.CollectionUtils;

/**
* @Title:钉钉端预警任务首页控制器
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月19日 唐俊杰 新建
*/
@RestController
@RequestMapping("/mobile/decision/zhkb/mobilewarningtaskcontroller")
public class MobileWarningTaskController extends BaseBusinessController {
    
    /**
     * 钉钉移动端service
     */
    @Autowired
    private IMobileWarningService mobileWarningService;
    
    /**
     * 预警任务PC端service
     */
    @Autowired
    private ITaskService pcService;
    
    /**
     * 各类型预警任务统计信息
     * @return
     */
	@RequestMapping(value = "/getTaskCountGroupByType/{type}", method = RequestMethod.GET)
	public Map<String, Object> getTaskCountGroupByType(@PathVariable(value="type")String type) {
		Map<String, Object> responseData = super.getSuccessMap();
		responseData.put("data", mobileWarningService.getTaskCountGroupByType(type));
		responseData.put("status", "000");
		return responseData;
	}
    
    /**
     * 各科室待办任务统计信息
     * @param params
     * @return
     */
    @RequestMapping(value="/getNeedHandleTasksGroupByDept",method=RequestMethod.POST)
    public Map<String, Object> getNeedHandleTasksGroupByDept(@RequestBody Map<String, Object> params){
        Map<String, Object> responseData = super.getSuccessMap();
        responseData.put("data", mobileWarningService.getNeedHandleTasksGroupByDept(params));
        responseData.put("status", "000");
        return responseData;
    }
    
    /**
     * 预警任务办结情况年度趋势
     * @return
     */
    @RequestMapping(value = "/getwarningtaskmonthlytrend", method = RequestMethod.GET)
    public Map<String, Object> getWarningTaskMonthlyTrend() {
        Map<String, Object> responseData = super.getSuccessMap();
        List<Map<String, Object>> resultList = pcService.getAnnualTrend();
		responseData.put("data", resultList);
		responseData.put("status", "000");
        return responseData;
    }
    
    @RequestMapping(value = "/getLoginLog/{type}", method = RequestMethod.GET)
    public Map<String, Object> getLoginLog(@PathVariable("type")String type){
        Map<String, Object> result = getSuccessMap();
        List<Map<String, Object>> list = mobileWarningService.getLoginLog(type);
        result.put("data", list);
        result.put("status", "000");
        return result;
    }
}
