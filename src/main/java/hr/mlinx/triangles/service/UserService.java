package hr.mlinx.triangles.service;

import hr.mlinx.triangles.entity.Role;
import hr.mlinx.triangles.entity.User;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface UserService {

    Collection<User> getUsers();
    User getUserById(Long userId);
    Optional<User> getUserByUsername(String username);
    boolean existsUserWithUsername(String username);
    User saveUser(User user);
    void deleteUserById(Long userId);
    Set<Role> getRolesOfUser(User user);

}
