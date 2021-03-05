package com.szboanda.smart.geo.domain;

/**
 * EsriPoint
 */
public class EsriPoint implements EsriGeometry {

    /**
     * x点位
     */
    private double x;
    
    /**
     * y点位
     */
    private double y;

    /**
     * @return
     */
    public double getX() {
        return x;
    }

    /**
     * @param x
     */
    public void setX(double x) {
        this.x = x;
    }

    /**
     * @return
     */
    public double getY() {
        return y;
    }

    /**
     * @param y
     */
    public void setY(double y) {
        this.y = y;
    }

    /**
     * @param x
     * @param y
     */
    public EsriPoint(double x,double y)
    {
        this.x = x;
        this.y = y;
    }

    /**
     * EsriPoint
     */
    public EsriPoint(){}
}
