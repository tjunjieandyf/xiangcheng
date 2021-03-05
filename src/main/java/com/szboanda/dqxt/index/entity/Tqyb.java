package com.szboanda.dqxt.index.entity;

import java.util.Date;

/**
 * Tqyb 天气预报实体类
 *
 */
public class Tqyb {

	/**
	 * 序号
	 */
	private String xh;
	/**
	 * 类型
	 */
	private String type;
	/**
	 * 预测时间
	 */
	private Date ycsj;
	/**
	 * 温度
	 */
	private String wd;
	/**
	 * 天气
	 */
	private String tq;
	/**
	 * 风向
	 */
	private String fx;
	/**
	 * 风速
	 */
	private String fs;
	/**
	 * 推送时间
	 */
	private Date publishtime;
	
	/**
	 * @return
	 */
	public String getXh() {
		return xh;
	}
	/**
	 * @param xh
	 */
	public void setXh(String xh) {
		this.xh = xh;
	}
	/**
	 * @return
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return
	 */
	public Date getYcsj() {
	    if(this.ycsj!=null){
	        return new Date(ycsj.getTime());
	    }else{
	        return null;
	    }
	}
	/**
	 * @param ycsj
	 */
	public void setYcsj(Date ycsj) {
	    if(ycsj!=null){
	        this.ycsj = (Date)ycsj.clone();
	    }else{
	        this.ycsj = null;
	    }
	}
	/**
	 * @return
	 */
	public String getWd() {
		return wd;
	}
	/**
	 * @param wd
	 */
	public void setWd(String wd) {
		this.wd = wd;
	}
	/**
	 * @return
	 */
	public String getTq() {
		return tq;
	}
	/**
	 * @param tq
	 */
	public void setTq(String tq) {
		this.tq = tq;
	}
	/**
	 * @return
	 */
	public String getFx() {
		return fx;
	}
	/**
	 * @param fx
	 */
	public void setFx(String fx) {
		this.fx = fx;
	}
	/**
	 * @return
	 */
	public String getFs() {
		return fs;
	}
	/**
	 * @param fs
	 */
	public void setFs(String fs) {
		this.fs = fs;
	}
	/**
	 * @return
	 */
	public Date getPublishtime() {
	    if(this.publishtime!=null){
            return new Date(publishtime.getTime());
        }else{
            return null;
        }
	}
	/**
	 * @param publishtime
	 */
	public void setPublishtime(Date publishtime) {
	    if(publishtime!=null){
            this.publishtime = (Date)publishtime.clone();
        }else{
            this.publishtime = null;
        }
	}

}
