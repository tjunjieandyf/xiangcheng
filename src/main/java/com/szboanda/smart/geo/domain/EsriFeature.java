package com.szboanda.smart.geo.domain;

import java.io.Serializable;
import java.util.Map;

import com.vividsolutions.jts.geom.Coordinate;
import  com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;

/**
 * @author LENOVO
 *
 */
public class EsriFeature implements Serializable {

	private static final long serialVersionUID = 1L;
	
	/**
	 * attributes
	 */
	private Map<String, Object> attributes;
	
    /**
     * geometry
     */
    private EsriGeometry geometry;

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
    public EsriGeometry getGeometry() {
        return geometry;
    }

    /**
     * @param geometry
     */
    public void setGeometry(EsriGeometry geometry) {
        this.geometry = geometry;
    }

    /**
     * @param fe
     * @return
     */
    public  EsriFeature fromFeature(Feature fe)  {
        if (fe.getGeometry() instanceof Point) {
            Point p = (Point) fe.getGeometry();
            this.geometry = new EsriPoint(p.getX(), p.getY());
        }else if(fe.getGeometry() instanceof Polygon)
        {
            EsriPolygon pg2 =  new EsriPolygon();
            Polygon pg = (Polygon)fe.getGeometry();
            Coordinate[] coordinates =  pg.getCoordinates();
            EsriRing ring = new EsriRing();
            for (Coordinate c:
                  coordinates) {
                EsriCoordinate c1 = new EsriCoordinate();
                c1.add(c.x);
                c1.add(c.y);
                ring.add(c1);
            }
            pg2.add(ring);
            this.geometry = pg2;
        }
        this.attributes = fe.getAttributes();
        return this;
    }
}
