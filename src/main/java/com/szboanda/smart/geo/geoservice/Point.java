package com.szboanda.smart.geo.geoservice;

/**
 * @author LENOVO
 *
 */
public class Point {
    
	/**
	 * X
	 */
	private float x;
	
	/**
	 * Y
	 */
	private float y;
	
	/**
	 * @return
	 */
	public float getX() {
		return x;
	}
	/**
	 * @param x
	 */
	public void setX(float x) {
		this.x = x;
	}
	/**
	 * @return
	 */
	public float getY() {
		return y;
	}
	/**
	 * @param y
	 */
	public void setY(float y) {
		this.y = y;
	}
	
	/**
	 * 
	 */
	public Point() {}
	
	/**
	 * @param x
	 * @param y
	 */
	public Point(float x,float y) {
			this.x = x;
			this.y= y;
		
	}
}
