/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.zhkb.exception;

import com.szboanda.platform.common.base.BaseException;

/**
 * @title:      AAA_异常处理类
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author:     彭志群
 * @date:       2020-10-17 10:07
 * @version:    V1.0
 */
public class WryException extends BaseException {

    private static final long serialVersionUID = 1L;

    /**
     * 构造函数
     */
    public WryException() {
        super();
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     */
    public WryException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param cause
     */
    public WryException(Throwable cause) {
        super(cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param code 异常代码
     */
    public WryException(String message, String code) {
        super(message, code);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     */
    public WryException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     * @param code 异常代码
     */
    public WryException(String message, Throwable cause, String code) {
        super(message, cause, code);
    }
}