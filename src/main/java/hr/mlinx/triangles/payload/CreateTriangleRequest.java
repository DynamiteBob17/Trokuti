package hr.mlinx.triangles.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.geo.Point;

@Data
public class CreateTriangleRequest {

    @Size(max = 33)
    @NotBlank
    private String name;

    @NotNull private Double ax, ay;
    @NotNull private Double bx, by;
    @NotNull private Double cx, cy;

}
