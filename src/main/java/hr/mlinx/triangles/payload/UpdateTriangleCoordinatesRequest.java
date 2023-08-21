package hr.mlinx.triangles.payload;

import lombok.Data;

@Data
public class UpdateTriangleCoordinatesRequest {

    private Double ax, ay;
    private Double bx, by;
    private Double cx, cy;

}
