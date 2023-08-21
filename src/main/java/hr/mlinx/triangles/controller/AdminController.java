package hr.mlinx.triangles.controller;

import hr.mlinx.triangles.entity.Role;
import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.repository.RoleRepository;
import hr.mlinx.triangles.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;private final RoleRepository roleRepository;

    @GetMapping("/users")
    public Collection<User> getUsers() {
        log.info("Admin request to get all users");
        return userService.getUsers();
    }

}
