/******************************************************************************
* Copyright (C) 2021 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.thirdparty.service.impl;

import org.springframework.stereotype.Service;

import com.szboanda.thirdparty.service.IThirdPartyService;

/**
* @Title:
* @author  唐俊杰
* @since   JDK1.8
* @history 2021年3月22日 唐俊杰 新建
*/
@Service("dingding")
public class DingdingServiceImpl implements IThirdPartyService{

    @Override
    public void run(Object obj) {
        System.out.println("钉钉");
    }

}
