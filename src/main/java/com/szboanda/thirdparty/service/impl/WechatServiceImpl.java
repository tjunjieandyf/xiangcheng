/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.thirdparty.service.impl;

import java.util.Map;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.szboanda.thirdparty.service.IThirdPartyService;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月22日 唐俊杰 新建
*/
@Service("wechat")
public class WechatServiceImpl implements IThirdPartyService {

    @Override
    public void run(Object obj) {
        System.out.println("微信接口");
        Map<String, Object> map = (Map<String, Object>) obj;
        for(Entry<String, Object> entry:map.entrySet()){
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        }
        //设置返回值
        map.put("WechatServiceImpl", true);
    }

}
