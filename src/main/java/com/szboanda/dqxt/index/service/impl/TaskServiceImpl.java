/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.szboanda.business.BaseBusinessService;
import com.szboanda.dqxt.index.dao.TaskDAO;
import com.szboanda.dqxt.index.exception.TaskException;
import com.szboanda.dqxt.index.service.ITaskService;
import com.szboanda.dqxt.index.util.NumberUtil;
import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.platform.common.utils.LoggerUtil;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.StringUtils;
import com.szboanda.platform.common.utils.Toolkit;
import com.szboanda.platform.system.commoncode.cache.CommonCodeCache;
import com.szboanda.platform.v3.util.BeanUtils;
import com.szboanda.platform.v3.util.DateUtils;

import cn.hutool.core.date.DateField;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.map.MapUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
* @Title:工作任务服务实现类
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月16日 唐俊杰 新建                   
*/
@Service
public class TaskServiceImpl extends BaseBusinessService implements ITaskService {

    @Autowired
    private TaskDAO dao;
    
    /*
     * (non-Javadoc)
     * 
     * @see
     * com.szboanda.dqxt.service.ITaskService#getNeedHandleTasksGroupByDept()
     */
    @Override
    public List<Map<String, Object>> getNeedHandleTasksGroupByDept() {
        try {
            List<Map<String, Object>> taskMap = dao.getNeedHandleTasksGroupByDept();
            List<String> overtimeDepts = dao.getOvertimeDepts();
            if (CollectionUtils.isNotEmpty(taskMap)) {
                // 根据存在超期任务的科室，对taskMap中对应的记录进行标记
                for (Map<String, Object> task : taskMap) {
                    task.put("OVERTIME", false);
                    if(CollectionUtils.isNotEmpty(overtimeDepts)){
                        for (String dept : overtimeDepts) {
                            if (task.get("FZJG").equals(dept)) {
                                task.put("OVERTIME", true);
                            }
                        }
                    }
                }
            }

            return taskMap;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警任务列表异常", e);
            throw new TaskException("查询预警任务列表异常", e);
        }
    }

    @Override
    public List<Map<String, Object>> getPCAnnualTrend() {
        try {
            List<Map<String, Object>> resultList = dao.getPCAnnualTrend();
            Map<String, List<Map<String, Object>>> yfMap = new HashMap<>();
            List<Map<String, Object>> resultMapList = new ArrayList<>();
            Map<String,List<Map<String, Object>>> yfTempMap = new HashMap<>();
            if (CollectionUtils.isNotEmpty(resultList)) {
                List<Map<String, Object>> list = null;
                for (Map<String, Object> data : resultList) {
                    if(yfTempMap.containsKey(MapUtils.getString(data, "YF"))){
                        list = yfTempMap.get(MapUtils.getString(data, "YF"));
                    }else{
                        list = new ArrayList<>();
                    }
                    list.add(data);
                    yfTempMap.put(MapUtils.getString(data, "YF"), list);
                    
                }
                
                
                Map<String, Object> bjlMap = new HashMap<String,Object>();
                Map<String, Object> yfBjlMap = new HashMap<String,Object>();
                for(Entry<String,List<Map<String, Object>>> entry:yfTempMap.entrySet()){
                    Map<String, Object> tempDmMap = new HashMap<>();
                    int total = 0,wbjTotal = 0;
                    for(Map<String, Object> map:entry.getValue()){
                        String dmjmc = MapUtils.getString(map, "DMJMC");
                        int zl = MapUtils.getBigDecimal(map, "NUM", 4).intValue();
                        total += zl;
                        
                        if("0".equals(MapUtils.getString(map, "BJQK"))){
                            wbjTotal+=MapUtils.getBigDecimal(map, "NUM", 4).intValue();
                        }
                        if(tempDmMap.containsKey(dmjmc)){
                            int ywTotal =zl+MapUtils.getBigDecimal(tempDmMap, dmjmc, 4).intValue();
                            tempDmMap.put(dmjmc, ywTotal);
                        }else{
                            tempDmMap.put(dmjmc, zl);
                        }
                    }
                    bjlMap.put(entry.getKey(), tempDmMap);
                    yfBjlMap.put(entry.getKey(), NumberUtil.divide(total-wbjTotal, total, 4));
                }
                
                
                for(Entry<String, Object> entry:bjlMap.entrySet()){
                    Map<String, Object> resultMap = new HashMap<>();
                    resultMap.put("CJSJ", entry.getKey());
                    Map<String, Object> map = (Map<String, Object>) entry.getValue();
                    List<Map<String, Object>> rList = new ArrayList<>();
                    for(Entry<String, Object> innerEntry:map.entrySet()){
                        Map<String, Object> rMap = new HashMap<>();
                        rMap.put("NAME", innerEntry.getKey());
                        rMap.put("TOTAL", innerEntry.getValue());
                        rList.add(rMap);
                    }
                    resultMap.put("list", rList);
                    resultMap.put("BJL", MapUtils.getString(yfBjlMap, entry.getKey()));
                    resultMapList.add(resultMap);
                }
                
                
            }
            return resultMapList;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警年度趋势情况异常", e);
            throw new TaskException("查询预警年度趋势情况异常", e);
        }
    }

    @Override
    public Map<String, Object> getTaskTypeInfo(String type) {
        try {
            List<Map<String, Object>> resultData = null;
            int total = 0;
            total = dao.getAllTaskCount(type);
            resultData = dao.getTaskCountGroupByLy(type);
            
            if(CollectionUtils.isNotEmpty(resultData)){
                for(Map<String, Object> map:resultData){
                    map.put("TYPE", MapUtils.getString(map, "DMJMC"));
                    map.remove("DMJMC");
                }
            }
            Map<String, Object> result = new HashMap<String, Object>(2);
            result.put("total", total);
            result.put("taskArr", resultData);

            return result;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警任务类型异常", e);
            throw new TaskException("查询预警任务类型异常", e);
        }
    }

    @Override
    public List<Map<String, Object>> getTaskHandleOrderInfo(String type) {
        try {
            List<Map<String, Object>> orderedDeptList = null;
            List<Map<String, Object>> overtimeList = null;
            orderedDeptList = dao.getOrderedTaskCountGroupbyDept(type);
            overtimeList = dao.getOvertimeTaskCountGroupByDept(type);
            // 处理融合两个map,设置对应科室超时任务数
            if (CollectionUtils.isNotEmpty(orderedDeptList)) {
                for (Map<String, Object> dept : orderedDeptList) {
                    // 初始化超时任务数
                    dept.put("OVERTIME", 0);
                    if (dept.get("BJ") == null) {
                        dept.put("BJ", 0);
                    }
                    if( CollectionUtils.isNotEmpty(overtimeList)){
                        for (Map<String, Object> overtiemDept : overtimeList) {
                            if (dept.get("FZJG").equals(overtiemDept.get("FZJG"))) {
                                dept.put("OVERTIME", MapUtils.getBigDecimal(overtiemDept, "NUM", 4).intValue());
                            }
                        }
                    }
                    dept.put("GREEN", 0);
                    dept.put("YELLOW", 0);
                    dept.put("RED", 0);
                    // 计算办结率,保留三位小数
                    dept.put("BJL", NumberUtil.divide(MapUtils.getBigDecimal(dept, "BJ", 4).intValue(), MapUtils.getBigDecimal(dept, "NUM", 4).intValue(), 3));
                    dept.remove("BJ");
                }
            }
            //根据markType的分组数据
            List<Map<String, Object>> markTypeList = dao.listTaskGroupByMarkType(type);
            for(Map<String, Object> markTypeMap:markTypeList){
                for(Map<String, Object> orderMap:orderedDeptList){
                    if(MapUtils.getString(markTypeMap, "FZJG").equals(MapUtils.getString(orderMap, "FZJG"))){
                        if("0".equals(MapUtils.getString(markTypeMap,"MARKTYPE"))){
                            orderMap.put("GREEN", MapUtils.getBigDecimal(markTypeMap, "NUM", 0).intValue());
                        }else if("1".equals(MapUtils.getString(markTypeMap,"MARKTYPE"))){
                            orderMap.put("YELLOW", MapUtils.getBigDecimal(markTypeMap, "NUM", 0).intValue());
                        }else{
                            orderMap.put("RED", MapUtils.getBigDecimal(markTypeMap, "NUM", 0).intValue());
                        }
                    }
                }
            }

            return orderedDeptList;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询各科室预警任务排名异常", e);
            throw new TaskException("查询各科室预警任务排名异常", e);
        }
    }

    @Override
	public Map<String, Object> insertTaskRecord(Map<String, Object> dataMap) {
		String dataStr = MapUtil.getStr(dataMap, "businessData");
		int index = 0; 
		String errorMsg = ""; // 错误信息
		try {
			List<Map<String, Object>> listData = new ArrayList<>();
			if (!StringUtils.isEmpty(dataStr)) {
				JSONArray array = JSONArray.fromObject(dataStr);
				for (int i = 0; i < array.size(); i++) {
					JSONObject obj = (JSONObject) array.get(i);
					Map<String, Object> param = new HashMap<>();
					String [] nrArr = strToArray(obj.getString("YJGLNR"),",");
					String [] glzArr = strToArray(obj.getString("YJGLZ"),",");
					//确定的
					param.put("YJJB", obj.get("YJDJ"));
                    param.put("ZDBH", obj.get("ZDBH"));
                    param.put("YJGLNR", arryToStr(nrArr, ";"));
                    param.put("YJGLZ", arryToStr(glzArr, ";"));
                    param.put("YJGZ", obj.get("YJGZ"));
                    param.put("YJSITE", obj.get("YJSITE"));
                    param.put("SJKSSJ", obj.get("YJSJ"));
					//需要修改
					param.put("YWLX", obj.get("YJLX"));
					param.put("YWZLX", obj.get("YJZLX"));
					param.put("RWBH", obj.get("YWBH"));
					param.put("RWNR", obj.get("YJNR"));
					param.put("RWCSYY", obj.get("CSYY"));
					//要去办结时间需要根据配置表自动获取
					param.put("TYPE", obj.get("TYPE"));
					if(obj.containsKey("ZXSJ")){
					   param.put("ZXSJ",DateUtils.parseDate(obj.getString("ZXSJ"), "yyyy-MM-dd HH:mm:ss"));     
					}
					
					listData.add(param);
				}
			}
			// 根据业务类型查询对应负责人和科室
			if (!BeanUtils.emptyCollection(listData)) {
				for (Map<String, Object> params : listData) {
					List<Map<String, Object>> resultList = dao.getTransactorByBusinessId(params);
					if (resultList != null && resultList.size() > 0) {
					    Map<String, Object> resultMap = resultList.get(0);
						String zrksxh = MapUtil.getStr(resultMap, "ZRKSXH"); // 责任科室编号
						String ksclr = MapUtil.getStr(resultMap, "KSCLR"); // 科室处理人
						int blqx = MapUtil.getInt(resultMap, "BLQX"); // 任务期限
						String sjkssj = MapUtil.getStr(params, "SJKSSJ");// 任务开始时间
						// 任务要求办结时间
						DateTime yqbjsj =  DateUtil.offset(DateUtil.parse(sjkssj), DateField.DAY_OF_MONTH, blqx);
						String yqbjsjStr = DateUtil.format(yqbjsj, "yyyy-MM-dd HH:mm:ss");
						params.put("SJKSSJ", DateUtils.parseDate(sjkssj));
						params.put("YQBJSJ", DateUtils.parseDate(yqbjsjStr));
						params.put("FZJG", zrksxh);
						params.put("BLR", ksclr);
						params.put("XH", Toolkit.getUUID());
						params.put("CJSJ", new Date());
						params.put("CJR","SYSTEM");
						index = dao.insertTaskRecord(params);
					}
				}
			}
			
		} catch (Exception e) {
			errorMsg = e.getMessage();
			index = 0;
		}
		
		// 返回值
		Map<String, Object> responseData = new HashMap<>();
		if (index > 0) {
			responseData.put("errcode", "ok");
		} else {
			responseData.put("errcode", "no");
			responseData.put("errmsg", errorMsg);
		}
		return responseData;
	}
	
	@Override
	public int save(String yhmc, String bmmc, String yjlx, String blqx) {
		CommonCodeCache cache = Toolkit.getBean("CommonCodeCache", CommonCodeCache.class);
		List<Map<String, Object>> commoncodeList = cache.getCommonCodeByTypeId(yjlx);
		for (Map<String, Object> map : commoncodeList) {
			String dm = MapUtils.getString(map, "DM");
			Map<String, Object> temp = new HashMap<String, Object>();
			temp.put("YWLX", yjlx);
			temp.put("YWZLX", dm);
			temp.put("XH", Toolkit.getUUID());
			temp.put("CJSJ", new Date());
			temp.put("KSCLR", yhmc);
			temp.put("ZRKSXH", bmmc);
			temp.put("BLQX", Integer.parseInt(blqx));
			temp.put("CJR", Toolkit.getCurrUser() == null ? "SYSTEM" : Toolkit.getCurrUser().getName());
			dao.save(temp);
		}
		return 0;
	}

	@Override
	public void checkWarningTaskExpired() {
		try {
			dao.updateAllExpiredWarningTask();
		} catch (Exception e) {
			LoggerUtil.error(this.getClass(), "检查任务超期异常", e);
			throw new TaskException("检查任务超期异常", e);
		}
	}

    @Override
    public List<Map<String, Object>> getAnnualTrend() {
        try {
            List<Map<String, Object>> resultList = dao.getAnnualTrend();
            if (CollectionUtils.isNotEmpty(resultList)) {
                for (Map<String, Object> data : resultList) {
                    if (data.get("BJ") == null) {
                        data.put("BJ", 0);
                    }
                    // 计算办结率，保留三位小数
                    data.put("BJL", NumberUtil.divide(MapUtils.getBigDecimal(data, "BJ", 4).intValue(), MapUtils.getBigDecimal(data, "TOTAL", 4).intValue(), 3));
                    data.remove("BJ");
                }
            }
            return resultList;
        } catch (Exception e) {
            LoggerUtil.error(this.getClass(), "查询预警年度趋势情况异常", e);
            throw new TaskException("查询预警年度趋势情况异常", e);
        }
    }
    
    /**
     * “[123,232,34]”字符串转数组
     * @param content
     * @param split
     * @return
     */
    private String [] strToArray(String content,String split){
        if(StringUtils.isEmpty(content)){
            return null;
        }
        if(content.indexOf("[")==-1||content.indexOf("]")==-1){
            return null;
        }
        String newContent = content.substring(1, content.length()-1);
        return newContent.split(split);
    }
    
    private String arryToStr(String [] arr,String split){
        StringBuilder sBuilder = new StringBuilder("[");
        for(String str:arr){
            sBuilder.append(str+split);
        }
        sBuilder.deleteCharAt(sBuilder.lastIndexOf(split));
        sBuilder.append("]");
        return sBuilder.toString();
    }
}
