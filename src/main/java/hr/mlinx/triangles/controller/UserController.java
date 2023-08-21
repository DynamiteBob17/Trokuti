package hr.mlinx.triangles.controller;

import hr.mlinx.triangles.entity.Triangle;
import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.payload.CreateTriangleRequest;
import hr.mlinx.triangles.payload.GenericApiResponse;
import hr.mlinx.triangles.payload.UpdateTriangleCoordinatesRequest;
import hr.mlinx.triangles.payload.UpdateTriangleNameRequest;
import hr.mlinx.triangles.security.CustomUserDetails;
import hr.mlinx.triangles.service.TriangleService;
import hr.mlinx.triangles.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final TriangleService triangleService;

    @GetMapping("/me")
    public ResponseEntity<User> getAccountInfo(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested account information", currentUser.getId());
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }

    @DeleteMapping("/account")
    public ResponseEntity<GenericApiResponse> deleteYourAccount(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested account deletion", currentUser.getId());
        userService.deleteUserById(currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted user " + currentUser.getId()));
    }

    @GetMapping("/triangle/{triangleId}")
    public ResponseEntity<Triangle> getTriangle(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long triangleId) {
        log.info("User {} requested to get triangle {}", currentUser.getId(), triangleId);
        return ResponseEntity.ok(triangleService.checkAndGetTriangleByUserId(triangleId, currentUser.getId()));
    }

    @GetMapping("/triangles")
    public Collection<Triangle> getTriangles(@AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested to get all of his triangles", currentUser.getId());
        return triangleService.getTrianglesByUserId(currentUser.getId());
    }

    @PostMapping("/createTriangle")
    public ResponseEntity<Triangle> createTriangle(@Valid @RequestBody CreateTriangleRequest createTriangleRequest, @AuthenticationPrincipal CustomUserDetails currentUser) {
        log.info("User {} requested to add a new triangle to his collection");

        Triangle triangle = new Triangle();
        triangle.setName(createTriangleRequest.getName());
        triangle.setA(new Point(createTriangleRequest.getAx(), createTriangleRequest.getAy()));
        triangle.setB(new Point(createTriangleRequest.getBx(), createTriangleRequest.getBy()));
        triangle.setC(new Point(createTriangleRequest.getCx(), createTriangleRequest.getCy()));

        return ResponseEntity.ok(triangleService.createTriangle(triangle, currentUser.getId()));
    }

    @PatchMapping("/updateTriangleCoordinates/{triangleId}")
    public ResponseEntity<Triangle> updateTriangleCoordinates(
            @Valid @RequestBody UpdateTriangleCoordinatesRequest newCoordinates,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long triangleId) {
        log.info("User {} requested to update coordinates of triangle {}", currentUser.getId(), triangleId);
        return ResponseEntity.ok(triangleService.updateTriangleCoordinatesById(
                new Point(newCoordinates.getAx(), newCoordinates.getAy()),
                new Point(newCoordinates.getBx(), newCoordinates.getBy()),
                new Point(newCoordinates.getCx(), newCoordinates.getCy()),
                triangleId,
                currentUser.getId()
        ));
    }

    @PatchMapping("/updateTriangleName/{triangleId}")
    public ResponseEntity<Triangle> updateTriangleName(
            @Valid @RequestBody UpdateTriangleNameRequest newName,
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long triangleId) {
        log.info("User {} requested to update name of triangle {}", currentUser.getId(), triangleId);
        return ResponseEntity.ok(triangleService.updateTriangleNameById(newName.getName(), triangleId, currentUser.getId()));
    }

    @DeleteMapping("/deleteTriangle/{triangleId}")
    public ResponseEntity<GenericApiResponse> deleteTriangle(@AuthenticationPrincipal CustomUserDetails currentUser, @PathVariable Long triangleId) {
        log.info("User {} requested to delete triangle {}", currentUser.getId(), triangleId);
        triangleService.deleteTriangleById(triangleId, currentUser.getId());
        return ResponseEntity.ok(new GenericApiResponse("Successfully deleted triangle " + triangleId));
    }

}
