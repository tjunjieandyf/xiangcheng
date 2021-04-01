/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.szboanda.business.BaseBusinessController;
import com.szboanda.dqxt.rwzx.service.ITaskCenterService;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.rms.user.mode.UserVO;
import com.szboanda.platform.system.commoncode.cache.CommonCodeCache;

/**
* @Title:任务中心controller
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月21日 唐俊杰 新建
*/
@Controller
@RequestMapping("/taskcentercontroller")
public class TaskCenterController extends BaseBusinessController{
    
    /**
     * 注入处理业务接口
     */
    @Autowired
    private ITaskCenterService taskCenterService;
    

    /**
     * 查询【移动决策-预警任务办理】业务集合信息
     `*
     * @param    params 业务集合
     * @return   返回Map集合信息
     * @throws   WarningTaskException
     */
    @RequestMapping(value = "/queryTasks", method = { RequestMethod.POST })
    @ResponseBody
    public Map<String, Object> queryTasks(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = super.getSuccessMap();
        int pageNum = getPageNum(params);//获取分页数
        int pageSize = getPageSize(params);//获取分页长度
        //获取当前用户，并根据用户获取部门信息和角色信息
        UserVO user = getCurrUser();
        //添加用户信息
        params.put("UserVO", user);
        result.put("data", taskCenterService.queryTasks(pageNum, pageSize, params));
        return result;
    }
    
    
    /**
     * 兼容处理
     * @param xh
     * @return
     * @throws WarningTaskException
     */
    @RequestMapping(value = "/getTaskById/{xh}/{type}", method = { RequestMethod.GET })
    @ResponseBody
    public Map<String, Object> getTaskById(@PathVariable(value="xh")String xh,@PathVariable(value="type")boolean type) {
        Map<String, Object> result = super.getSuccessMap();
        //新版本中pc端和钉钉接口返回一致，调用warningTaskService中方法
        //获取当前用户，并根据用户获取部门信息和角色信息
        if(type){
            result.put("data", taskCenterService.getTaskById(xh));
        }else{
            result.put("data", taskCenterService.getNoticeById(xh));
        }
        result.put("status", "000");
        return result;
    }

	/**
	 * 获取所有部门科室
	 * @param param
	 *            业务集合
	 * @return 返回某个业务Map信息
	 * @throws WarningTaskException
	 */
	@RequestMapping(value = "/getAllDepartments", method = { RequestMethod.GET })
	@ResponseBody
	public Map<String, Object> getAllDepartments(){
		Map<String, Object> result = super.getSuccessMap();
		result.put("data", taskCenterService.getAllDepartments());
		return result;
	}
	
	/**
	 * 获取预警任务部门 公共代码值YJRWBM
	 * @param param
	 *            业务集合
	 * @return 返回某个业务Map信息
	 * @throws WarningTaskException
	 */
	@RequestMapping(value = "/getYjRwDepartments", method = { RequestMethod.GET })
	@ResponseBody
	public Map<String, Object> getYJRWDepartments(){
		Map<String, Object> result = super.getSuccessMap();
		result.put("data", taskCenterService.getYjRwDepartments());
		return result;
	}
	
	/**
	 * 获取所有预警任务类型
	 * @param param
	 *            业务集合
	 * @return 返回某个业务Map信息
	 * @throws WarningTaskException
	 */
	@RequestMapping(value = "/getAllWarningTypes/{type}", method = { RequestMethod.GET })
	@ResponseBody
	public Map<String, Object> getAllWarningTypes(@PathVariable(value="type")boolean type) {
		Map<String, Object> result = super.getSuccessMap();
		result.put("data", taskCenterService.getYwlx(type));
		return result;
	}
	
	/**
	 * 获取所有预警任务类型
	 * @param param
	 *            业务集合
	 * @return 返回某个业务Map信息
	 * @throws WarningTaskException
	 */
	@RequestMapping(value = "/taskFeedback", method = { RequestMethod.POST })
	@ResponseBody
	public Map<String, Object> taskFeedback(@RequestBody Map<String, Object> params) {
		Map<String, Object> result = super.getSuccessMap();
		if(taskCenterService.taskFeedback(params)>0){
            result = super.getSuccessMap();
            result.put("status", "000");
        }else{
            result = super.getFailMap();
            result.put("status", "500");
        }
		return result;
	}
	
	@RequestMapping(value = "/listUsers", method = { RequestMethod.GET })
	@ResponseBody
    public Map<String, Object> listUsers() {
	    return null;
    }
}
