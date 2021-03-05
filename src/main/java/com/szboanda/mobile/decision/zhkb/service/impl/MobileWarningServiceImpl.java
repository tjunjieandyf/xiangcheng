/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.mobile.decision.zhkb.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.szboanda.business.BaseBusinessService;
import com.szboanda.mobile.decision.zhkb.dao.MobileWarningTaskDAO;
import com.szboanda.mobile.decision.zhkb.service.IMobileWarningService;
import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.platform.common.utils.MapUtils;
import com.szboanda.platform.common.utils.StringUtils;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月19日 唐俊杰 新建
*/
@Service
public class MobileWarningServiceImpl extends BaseBusinessService implements IMobileWarningService {
    
    @Autowired
    private MobileWarningTaskDAO dao;
    
    @Override
    public Map<String, Object> getTaskCountGroupByType(String type) {
        if(StringUtils.isEmpty(type)){
            //默认查询本月数据
            type="month";
        }
        int total = dao.getTaskCount(type);
        Map<String, Object> result = new HashMap<>();
        result.put("total", total);
        //初始化
        result.put("handled", 0);
        result.put("handling", 0);
        List<Map<String, Object>> list = dao.getTaskCountGroupByType(type);
        if(CollectionUtils.isNotEmpty(list)){
            for(Map<String, Object> map:list){
                int count = MapUtils.getBigDecimal(map, "NUM", 4).intValue();
                if("1".equals(MapUtils.getString(map, "BJQK"))){
                    result.put("handled", count);
                }else{
                    result.put("handling", count);
                }
            } 
        }
        
        return result;
    }

    @Override
    public List<Map<String, Object>> getNeedHandleTasksGroupByDept(Map<String, Object> param) {
        String type = MapUtils.getString(param, "TYPE");
        //默认查看“今天”的信息
        if(StringUtils.isEmpty(type)){
            type="today";
        }
        //默认返回空列表
        List<Map<String, Object>> resultList = null;
        resultList = dao.getNeedHandleTasksGroupByDept(type);
        return resultList;
    }

    @Override
    public List<Map<String, Object>> getLoginLog(String type) {
        if(StringUtils.isEmpty(type)){
            type = "today";
        }
        return dao.listLoginLogs(type);
    }

}
