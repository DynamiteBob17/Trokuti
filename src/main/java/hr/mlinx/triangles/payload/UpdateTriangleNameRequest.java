package hr.mlinx.triangles.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTriangleNameRequest {

    @Size(max = 33)
    @NotBlank
    private String name;

}
