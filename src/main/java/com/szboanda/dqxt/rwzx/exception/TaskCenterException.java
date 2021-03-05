/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.rwzx.exception;

import com.szboanda.platform.common.base.BaseException;

/**
* @Title:任务中心预警任务异常
* @author  唐俊杰
* @since   JDK1.8
* @history 2020年10月21日 唐俊杰 新建
*/
public class TaskCenterException extends BaseException{
    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    /**
     * 构造函数
     */
    public TaskCenterException() {
        super();
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     */
    public TaskCenterException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param cause
     */
    public TaskCenterException(Throwable cause) {
        super(cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param code 异常代码
     */
    public TaskCenterException(String message, String code) {
        super(message, code);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     */
    public TaskCenterException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     * @param code 异常代码
     */
    public TaskCenterException(String message, Throwable cause, String code) {
        super(message, cause, code);
    }
}
