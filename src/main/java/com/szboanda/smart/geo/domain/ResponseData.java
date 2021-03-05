package com.szboanda.smart.geo.domain;

/**
 * 返回对象
 * @author LENOVO
 *
 */
public class ResponseData {

    /**
     * 状态
     */
    public String status;
    
    /**
     * 消息
     */
    private String msg;
    
    /**
     * 数据
     */
    private Object data;

    /**
     * @return
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return
     */
    public String getMsg() {
        return msg;
    }

    /**
     * @param msg
     */
    public void setMsg(String msg) {
        this.msg = msg;
    }

    /**
     * @return
     */
    public Object getData() {
        return data;
    }

    /**
     * @param data
     */
    public void setData(Object data) {
        this.data = data;
    }
}
