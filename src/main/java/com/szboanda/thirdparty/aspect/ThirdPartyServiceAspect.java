/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.thirdparty.aspect;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.aspectj.lang.JoinPoint;

import com.szboanda.platform.common.utils.CollectionUtils;
import com.szboanda.thirdparty.service.IThirdPartyService;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月22日 唐俊杰 新建
*/
public class ThirdPartyServiceAspect {
    private List<IThirdPartyService> serviceList;
    
    public void setServiceList(List<IThirdPartyService> serviceList) {
        this.serviceList = serviceList;
    }

    public void after(JoinPoint jp){
        Object []  arr = jp.getArgs();
        if(CollectionUtils.isNotEmpty(serviceList)){
            for(IThirdPartyService service:serviceList){
                service.run(arr[0]);
            }
        }
        @SuppressWarnings("unchecked")
        Map<String, Object> map = (Map<String, Object>) arr[0];
        System.out.println("查看返回值");
        for(Entry<String, Object> entry:map.entrySet()){
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        }
    }
}
