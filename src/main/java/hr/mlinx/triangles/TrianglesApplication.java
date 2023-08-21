package hr.mlinx.triangles;

import hr.mlinx.triangles.entity.Role;
import hr.mlinx.triangles.entity.RoleName;
import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.exception.ResourceNotFoundException;
import hr.mlinx.triangles.repository.RoleRepository;
import hr.mlinx.triangles.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

import static hr.mlinx.triangles.controller.AuthController.giveRoleOfUser;

@Slf4j
@SpringBootApplication
public class TrianglesApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrianglesApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User user = new User();

            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("admin"));

            giveRoleOfUser(user, roleRepository);
            Role userRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new ResourceNotFoundException("role", "name", RoleName.ROLE_ADMIN.name()));
            user.getRoles().add(userRole);

            userRepository.save(user);

            log.info("Created user 'admin' with admin rights and the password 'admin'");
        };
    }

}
