package hr.mlinx.triangles.repository;

import hr.mlinx.triangles.entity.Triangle;
import hr.mlinx.triangles.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TriangleRepository extends JpaRepository<Triangle, Long> {
    List<Triangle> findAllByUser(User user);
}
