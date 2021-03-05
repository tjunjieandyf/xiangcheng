/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.yjrwbl.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.szboanda.business.BaseBusinessController;
import com.szboanda.mobile.decision.yjrwbl.exception.WarningTaskException;
import com.szboanda.mobile.decision.yjrwbl.service.IWarningTaskService;
import com.szboanda.platform.rms.user.mode.UserVO;

/**
 * 钉钉端:预警任务办理
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月17日
 * @version:    V1.0
 */
@Controller
@RequestMapping("/mobile/decision/wjrwbl/warningtaskhandlecontroller")
public class WarningTaskHandleController extends BaseBusinessController {

    /**
     * 注入处理业务接口
     */
    @Autowired
    private IWarningTaskService warningTaskService;
    
    /**
     * 查询【移动决策-预警任务办理】业务集合信息
     *
     * @param    params 业务集合
     * @return   返回Map集合信息
     * @throws   WarningTaskException
     */
    @RequestMapping(value = "/queryTasks", method = { RequestMethod.POST })
    @ResponseBody
    public Map<String, Object> queryTasks(@RequestBody Map<String, Object> params) throws WarningTaskException {
        int pageNum = getPageNum(params);//获取分页数
        int pageSize = getPageSize(params);//获取分页长度
        //获取当前用户，并根据用户获取部门信息和角色信息
        UserVO user = getCurrUser();
        PageInfo<Map<String, Object>> resultPageInfo = null;
        if(user!=null&&user.getSfyx()==1){
//            List<Map<String, Object>> roleList = dingdingService.getRole(user.getYhid());
//                if(CollectionUtils.isNotEmpty(roleList)){
//                    for(Map<String, Object> map:roleList){
//                        //角色为预警任务查看角色，并且该角色有效时，不过滤数据
//                        if(!"预警任务查看角色".equals(MapUtils.getString(map, "JSMC"))){
//                            System.out.println("非预警任务查看角色");
//                            params.put("YHID", user.getXtzh());
//                        }else{
//                            if(MapUtils.getBigDecimal(map, "SFYX",0).intValue()!=1){
//                                //预警任务查看角色，但无效
//                                params.put("YHID", "XXXXXXXXXX");
//                            }else{
//                                if(params.containsKey("YHID")){
//                                    params.remove("YHID");
//                                }
//                                break;
//                            }
//                        }
//                    }
//                }else{
//                    params.put("YHID", "XXXXXXXXXX");
//                }
            resultPageInfo = warningTaskService.queryTasks(pageNum, pageSize, params);
        }
        
        Map<String, Object> result = super.getSuccessMap();
        result.put("data", resultPageInfo);
        result.put("status", "000");
        return result;
    }
    

    /**
     * 污染源在线监测
     * 废水废气企业达标率
     * @param    param 业务集合
     * @return   返回某个业务Map信息
     * @throws   WarningTaskException
     */
	@RequestMapping(value = "/getTaskById/{xh}", method = { RequestMethod.GET })
    @ResponseBody
    public Map<String, Object> getTaskById(@PathVariable(value="xh")String xh) throws WarningTaskException {
	    Map<String, Object> result = super.getSuccessMap();
	    //获取当前用户，并根据用户获取部门信息和角色信息
        UserVO user = getCurrUser();
        String xtzh = null;
        if(user!=null){
            xtzh = user.getXtzh();
        }
	    result.put("data", warningTaskService.getTaskById(xh,xtzh));
	    result.put("status", "000");
	    return result;
    }
    
    /**
     * 保存反馈情况
     * @param params
     * @return
     * @throws WarningTaskException
     */
    @RequestMapping(value = "/saveTaskFeedBack", method = { RequestMethod.POST })
    @ResponseBody
    public Map<String, Object> saveTaskFeedBack(@RequestBody Map<String, Object> params) throws WarningTaskException {
        Map<String, Object> result = null;
        if(warningTaskService.saveTaskFeedBack(params,true)>0){
            result = super.getSuccessMap();
            result.put("status", "000");
        }else{
            result = super.getFailMap();
            result.put("status", "500");
        }
        return result;
    }
    
    //人员信息列表
    @RequestMapping(value = "/listUsers", method = { RequestMethod.GET })
    @ResponseBody
    public Map<String, Object> listUsers() throws WarningTaskException {
        Map<String, Object> result = super.getSuccessMap();
        result.put("status", "000");
        result.put("data", warningTaskService.listUsers());
        return result;
    }
}