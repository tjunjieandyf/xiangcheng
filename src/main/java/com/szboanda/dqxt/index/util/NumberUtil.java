/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.util;

import com.szboanda.dqxt.index.exception.TaskException;

/**
* @Title:数据计算工具类
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月17日 唐俊杰 新建
*/
public class NumberUtil {
    /**
     * 做除法，并保留指定的位数
     * @param bj
     * @param total
     * @param digit
     * @return
     */
    public static double divide(int bj,int total,int digit){
        int size = (int) Math.pow(10,digit);
        double result = 0;
        try {
            result = (double)bj/total;
            result = (double)Math.round(size*result)/size;
        } catch (Exception e) {
            throw new TaskException("计算办结率异常：",e);
        }
        
        return result; 
    }
}
