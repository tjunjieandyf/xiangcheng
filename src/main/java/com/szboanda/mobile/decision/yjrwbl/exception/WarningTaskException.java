/******************************************************************************
 * Copyright (C) ShenZhen Powerdata Information Technology Co.,Ltd
 * All Rights Reserved.
 * 本软件为深圳市博安达信息技术股份有限公司开发研制。未经本公司正式书面同意，其他任何个人、团体不得使用、
 * 复制、修改或发布本软件.
 *****************************************************************************/

package com.szboanda.mobile.decision.yjrwbl.exception;

import com.szboanda.platform.common.base.BaseException;

/**
 * 钉钉端:预警任务办理, 异常处理类
 * @copyright:  PowerData Software Co.,Ltd. Rights Reserved.
 * @company:    深圳市博安达信息技术股份有限公司
 * @author 朱传露
 * @date 2020年10月17日
 * @version:    V1.0
 */
public class WarningTaskException extends BaseException {

    private static final long serialVersionUID = 1L;

    /**
     * 构造函数
     */
    public WarningTaskException() {
        super();
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     */
    public WarningTaskException(String message) {
        super(message);
    }

    /**
     * 构造函数
     *
     * @param cause
     */
    public WarningTaskException(Throwable cause) {
        super(cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param code 异常代码
     */
    public WarningTaskException(String message, String code) {
        super(message, code);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     */
    public WarningTaskException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 构造函数
     *
     * @param message 异常信息
     * @param cause 父类信息
     * @param code 异常代码
     */
    public WarningTaskException(String message, Throwable cause, String code) {
        super(message, cause, code);
    }
}