package hr.mlinx.triangles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "triangles")
public class Triangle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 33)
    private String name;

    @NotNull private Point a;
    @NotNull private Point b;
    @NotNull private Point c;

    private Double perimeter;
    private Double area;

    @Enumerated(EnumType.STRING) private TriangleTypeByAngles typeByAngles;
    @Enumerated(EnumType.STRING) private TriangleTypeBySides typeBySides;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public Triangle calculatePerimeter() {
        perimeter = Math.sqrt(euclidDistSquare(a, b))
                + Math.sqrt(euclidDistSquare(b, c))
                + Math.sqrt(euclidDistSquare(c, a));
        return this;
    }

    public Triangle calculateArea() {
        area = (1. / 2) * Math.abs(
                a.getX() * (b.getY() - c.getY())
                + b.getX() * (c.getY() - a.getY())
                + c.getX() * (a.getY() - b.getY())
        );
        return this;
    }

    public Triangle determineTypeByAngles() {
        double ab2 = euclidDistSquare(a, b),
                bc2 = euclidDistSquare(b, c),
                ca2 = euclidDistSquare(c, a);

        List<Double> sorted = new TreeSet<>(Set.of(ab2, bc2, ca2)).stream().toList();
        double sideA = sorted.get(0);
        double sideB = sorted.get(1);
        double sideC = sorted.get(2);

        if (Double.compare(sideA + sideB, sideC) > 0) {
            typeByAngles = TriangleTypeByAngles.ACUTE;
        } else if (Double.compare(sideA + sideB, sideC) == 0) {
            typeByAngles = TriangleTypeByAngles.RIGHT;
        } else {
            typeByAngles = TriangleTypeByAngles.OBTUSE;
        }

        return this;
    }

    public Triangle determineTypeBySides() {
        double ab = Math.sqrt(euclidDistSquare(a, b)),
                bc = Math.sqrt(euclidDistSquare(b, c)),
                ca = Math.sqrt(euclidDistSquare(c, a));

        if (Double.compare(ab, bc) == 0 && Double.compare(bc, ca) == 0) {
            typeBySides = TriangleTypeBySides.EQUILATERAL;
        } else if (Double.compare(ab, bc) == 0 || Double.compare(bc, ca) == 0) {
            typeBySides = TriangleTypeBySides.ISOSCELES;
        } else {
            typeBySides = TriangleTypeBySides.SCALENE;
        }

        return this;
    }

    public static double euclidDistSquare(Point p, Point q) {
        return Math.pow(q.getX() - p.getX(), 2)
                + Math.pow(q.getY() - p.getY(), 2);
    }

}
