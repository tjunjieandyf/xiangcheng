/******************************************************************************
* Copyright (C) 2020 ShenZhen Powerdata Information Technology Co.,Ltd
* All Rights Reserved.
* 本软件为深圳博安达开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
* 复制、修改或发布本软件.
*****************************************************************************/

package com.szboanda.dqxt.index.exception;

import com.szboanda.platform.common.base.BaseException;

/**
* AsynTqybException
*/
public class TqybException extends BaseException {
    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;
    

    /**
     * 构造函数
     */
    public TqybException() {
        super();
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     */
    public TqybException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param cause
     */
    public TqybException(Throwable cause) {
        super(cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param code 异常代码
     */
    public TqybException(String message, String code) {
        super(message, code);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     */
    public TqybException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     * @param code 异常代码
     */
    public TqybException(String message, Throwable cause, String code) {
        super(message, cause, code);
    }
}
