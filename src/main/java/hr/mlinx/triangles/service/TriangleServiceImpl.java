package hr.mlinx.triangles.service;

import hr.mlinx.triangles.entity.Triangle;
import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.exception.BadRequestException;
import hr.mlinx.triangles.exception.ResourceNotFoundException;
import hr.mlinx.triangles.repository.TriangleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Objects;

@RequiredArgsConstructor
@Service
@Transactional
public class TriangleServiceImpl implements TriangleService {

    private final TriangleRepository triangleRepository;
    private final UserService userService;

    @Override
    public Collection<Triangle> getTrianglesByUserId(Long userId) {
        return triangleRepository.findAllByUser(userService.getUserById(userId));
    }

    @Override
    public Triangle getTriangleById(Long triangleId) {
        return triangleRepository.findById(triangleId)
                .orElseThrow(() -> new ResourceNotFoundException("trokut", "id-jem", triangleId));
    }

    @Override
    public Triangle checkAndGetTriangleByUserId(Long triangleId, Long userId) {
        Triangle triangle = getTriangleById(triangleId);

        if (!Objects.equals(triangle.getUser().getId(), userId)) {
            throw new BadRequestException("Ne možete uređivati trokut " + triangleId + " jer nije vaš.");
        }

        return triangle;
    }

    @Override
    public Triangle saveTriangle(Triangle triangle) {
        return triangleRepository.save(triangle);
    }

    @Override
    public Triangle createTriangle(Triangle triangle, Long userId) {
        User user = userService.getUserById(userId);

        triangle.setUser(user);

        calculateAndDetermineTriangleFields(triangle);

        return saveTriangle(triangle);
    }

    @Override
    public void deleteTriangleById(Long triangleId, Long userId) {
        triangleRepository.delete(checkAndGetTriangleByUserId(triangleId, userId));
    }

    @Override
    public Triangle updateTriangleById(
            Point a,
            Point b,
            Point c,
            String name,
            Long triangleId,
            Long userId) {
        Triangle triangle = checkAndGetTriangleByUserId(triangleId, userId);

        triangle.setA(a);
        triangle.setB(b);
        triangle.setC(c);
        triangle.setName(name);

        calculateAndDetermineTriangleFields(triangle);

        return saveTriangle(triangle);
    }


    private void calculateAndDetermineTriangleFields(Triangle triangle) {
        triangle.calculatePerimeter()
                .calculateArea()
                .determineTypeByAngles()
                .determineTypeBySides();
    }

}
