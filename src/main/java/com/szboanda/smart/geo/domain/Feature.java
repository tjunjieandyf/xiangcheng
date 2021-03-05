package com.szboanda.smart.geo.domain;
import java.util.HashMap;
import java.util.Map;

import com.vividsolutions.jts.geom.Geometry;
/**
 * Feature
 */
public class Feature {

    /**
     * attributes
     */
    private Map<String,Object> attributes = new HashMap<>();
    /**
     * Geometry
     */
    private Geometry geometry;

    /**
     * @return
     */
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    /**
     * @param attributes
     */
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

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
}
