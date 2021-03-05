package com.szboanda.smart.geo.geoservice;

import com.vividsolutions.jts.geom.Geometry;

/**
 * @author LENOVO
 *
 */
public class QueryParams {
    
	/**
	 * 要查询的图形
	 */
	private Geometry geometry;
	
	/**
	 * 是否包含工业源
	 */
	private boolean includeIndustrialSource;
	
	/**
	 * 是否包含最近的空气站
	 */
	private boolean includeNearestAirStation;
	
	/**
	 * 是否包含扬尘源
	 */
	private boolean includeRaiseDustSource;
	
	/**
	 * 是否包含机动车遥感
	 */
	private boolean includeVehicleMotorSource;
	
	/**
	 * 是否包含面污染源
	 */
	private boolean includeAreaPollutionSource;
	
	/**
	 * @return
	 */
	public Geometry getGeometry() {
		return geometry;
	}
	/**
	 * @param geometry
	 */
	public void setGeometry(Geometry geometry) {
		this.geometry = geometry;
	}
	/**
	 * @return
	 */
	public boolean isIncludeIndustrialSource() {
		return includeIndustrialSource;
	}
	/**
	 * @param includeIndustrialSource
	 */
	public void setIncludeIndustrialSource(boolean includeIndustrialSource) {
		this.includeIndustrialSource = includeIndustrialSource;
	}
	/**
	 * @return
	 */
	public boolean isIncludeNearestAirStation() {
		return includeNearestAirStation;
	}
	/**
	 * @param includeNearestAirStation
	 */
	public void setIncludeNearestAirStation(boolean includeNearestAirStation) {
		this.includeNearestAirStation = includeNearestAirStation;
	}
	/**
	 * @return
	 */
	public boolean isIncludeRaiseDustSource() {
		return includeRaiseDustSource;
	}
	/**
	 * @param includeRaiseDustSource
	 */
	public void setIncludeRaiseDustSource(boolean includeRaiseDustSource) {
		this.includeRaiseDustSource = includeRaiseDustSource;
	}
	/**
	 * @return
	 */
	public boolean isIncludeVehicleMotorSource() {
		return includeVehicleMotorSource;
	}
	/**
	 * @param includeVehicleMotorSource
	 */
	public void setIncludeVehicleMotorSource(boolean includeVehicleMotorSource) {
		this.includeVehicleMotorSource = includeVehicleMotorSource;
	}
	/**
	 * @return
	 */
	public boolean isIncludeAreaPollutionSource() {
		return includeAreaPollutionSource;
	}
	/**
	 * @param includeAreaPollutionSource
	 */
	public void setIncludeAreaPollutionSource(boolean includeAreaPollutionSource) {
		this.includeAreaPollutionSource = includeAreaPollutionSource;
	}
	
	
}
