/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.szboanda.business.BaseBusinessController;
import com.szboanda.dqxt.index.service.ITaskService;

/**
* @Title:丽水市生态环境局遂昌分局预警监控管理平台首页controller
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月16日 唐俊杰 新建
*/
@RestController
@RequestMapping("/warninghomecontroller")
public class WarningHomeController extends BaseBusinessController {

    @Autowired
    private ITaskService service;

    /**
     * 获取待办预警任务统计情况
     * @return
     */
    @RequestMapping(value = "/getneedhandletask", method = RequestMethod.GET)
    public Map<String, Object> getNeedHandleTask() {
    	Map<String, Object> data = super.getSuccessMap();
    	data.put("data", service.getNeedHandleTasksGroupByDept());
        return data;
    }

    /**
     * 获取预警任务类型统计信息
     * @return
     */
    @RequestMapping(value = "/gettasktypeinfo/{type}", method = RequestMethod.GET)
    public Map<String, Object> getTaskTypeInfo(@PathVariable(value = "type") String type) {
    	Map<String, Object> data = super.getSuccessMap();
    	data.put("data", service.getTaskTypeInfo(type));
        return data;
    }

    /**
     * 获取科室预警任务办理排名
     * @return
     */
    @RequestMapping(value = "/gettaskhandleorderinfo/{type}", method = RequestMethod.GET)
    public Map<String, Object> getTaskHandleOrderInfo(@PathVariable(value = "type") String type) {
    	Map<String, Object> data = super.getSuccessMap();
    	data.put("data", service.getTaskHandleOrderInfo(type));
        return data;
    }

    /**
     * 获取告警任务月度变化趋势
     * @return
     */
    @RequestMapping(value = "/getwarningtaskmonthlytrend", method = RequestMethod.GET)
    public Map<String, Object> getWarningTaskMonthlyTrend() {
    	Map<String, Object> data = super.getSuccessMap();
    	data.put("data", service.getPCAnnualTrend());
        return data;
    }
    
    /**
     * 预警平台调用接口用成预警任务
     * @Title: getLIDARDataTimes
     * @Description: TODO
     * @param @param time
     * @param @return   
     * @return Map<String,Object>   
     * @throws
     * @author 朱传露
     */
	@RequestMapping(value = "/insert/task/record" , method = RequestMethod.POST)
	public Map<String, Object> insertTaskRecord(@RequestBody Map<String, Object> params) {
		return service.insertTaskRecord(params);
	}
	
    /**
     * 添加负责人与业务关联信息:手工导入数据用
     * @return
     */
    @RequestMapping(value = "/save", method = RequestMethod.GET, produces = "text/json;charset=utf-8")
    public String save(@RequestParam("yhmc")  String yhmc, @RequestParam("bmmc") String bmmc, 
    		 @RequestParam("yjlx") String yjlx,  @RequestParam("blqx") String blqx) {
        service.save(yhmc, bmmc, yjlx, blqx);
        return "success";
    }
    
}
