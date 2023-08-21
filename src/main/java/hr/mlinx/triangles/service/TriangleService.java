package hr.mlinx.triangles.service;

import hr.mlinx.triangles.entity.Triangle;
import org.springframework.data.geo.Point;

import java.util.Collection;

public interface TriangleService {

    // database operations
    Collection<Triangle> getTrianglesByUserId(Long userId);
    Triangle getTriangleById(Long triangleId);
    Triangle checkAndGetTriangleByUserId(Long triangleId, Long userId);
    Triangle saveTriangle(Triangle triangle);
    Triangle createTriangle(Triangle triangle, Long userId);
    void deleteTriangleById(Long triangleId, Long userId);
    Triangle updateTriangleNameById(String newName, Long triangleId, Long userId);
    Triangle updateTriangleCoordinatesById(
            Point a,
            Point b,
            Point c,
            Long triangleId,
            Long userId
    );

}
