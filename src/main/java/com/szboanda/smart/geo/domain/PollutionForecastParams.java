package com.szboanda.smart.geo.domain;

import java.util.Date;

/**
 * 污染源预判参数
 */
public class PollutionForecastParams {

    /**
     * 是否获取实时数据
     */
    private  boolean realtime;
    
    /**
     * 中心点X
     */
    private double centerX;
    
    /**
     * 中心点Y
     */
    private double centerY;
    
    /**
     * 风向
     */
    private float windDirection;
    
    /**
     * 风速
     */
    private float winVelocity;
    
    /**
     * 是否包含企业
     */
    private boolean includedEnterpriseInfo;
    
    /**
     * 是否包含最近空气监测点的数据
     */
    private boolean includedEnterpriseInNearestStation;
    
    /**
     * 预判类型
     */
    private int forecastType;
    
    /**
     * 空间数据
     */
    private String ring;
    
    /**
     * testingDate
     */
    private Date testingDate;

    /**
     * @return
     */
    public String getRing() {
        return ring;
    }

    /**
     * @param ring
     */
    public void setRing(String ring) {
        this.ring = ring;
    }
    
    /**
     * @return
     */
    public Date getTestingDate() {
    	if (testingDate != null) {
    		return (Date) testingDate.clone();
    	}
        return null;
    }

    /**
     * @param testingDate
     */
    public void setTestingDate(Date testingDate) {
    	if (testingDate != null) {
    		this.testingDate = (Date) testingDate.clone();
    	} else {
    		this.testingDate = null;
    	}
    }

    /**
     * @return
     */
    public boolean isRealtime() {
        return realtime;
    }

    /**
     * @param realtime
     */
    public void setRealtime(boolean realtime) {
        this.realtime = realtime;
    }

    /**
     * @return
     */
    public double getCenterX() {
        return centerX;
    }

    /**
     * @param centerX
     */
    public void setCenterX(double centerX) {
        this.centerX = centerX;
    }

    /**
     * @return
     */
    public double getCenterY() {
        return centerY;
    }

    /**
     * @param centerY
     */
    public void setCenterY(double centerY) {
        this.centerY = centerY;
    }

    /**
     * @return
     */
    public float getWindDirection() {
        return windDirection;
    }

    /**
     * @param windDirection
     */
    public void setWindDirection(float windDirection) {
        this.windDirection = windDirection;
    }

    /**
     * @return
     */
    public float getWinVelocity() {
        return winVelocity;
    }

    /**
     * @param winVelocity
     */
    public void setWinVelocity(float winVelocity) {
        this.winVelocity = winVelocity;
    }

    /**
     * @return
     */
    public boolean isIncludedEnterpriseInfo() {
        return includedEnterpriseInfo;
    }

    /**
     * @param includedEnterpriseInfo
     */
    public void setIncludedEnterpriseInfo(boolean includedEnterpriseInfo) {
        this.includedEnterpriseInfo = includedEnterpriseInfo;
    }

    /**
     * @return
     */
    public boolean isIncludedEnterpriseInNearestStation() {
        return includedEnterpriseInNearestStation;
    }

    /**
     * @param includedEnterpriseInNearestStation
     */
    public void setIncludedEnterpriseInNearestStation(boolean includedEnterpriseInNearestStation) {
        this.includedEnterpriseInNearestStation = includedEnterpriseInNearestStation;
    }

    /**
     * @return
     */
    public int getForecastType() {
        return forecastType;
    }

    /**
     * @param forecastType
     */
    public void setForecastType(int forecastType) {
        this.forecastType = forecastType;
    }
}
