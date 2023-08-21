package hr.mlinx.triangles.service;

import hr.mlinx.triangles.entity.Role;
import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.exception.ResourceNotFoundException;
import hr.mlinx.triangles.repository.TriangleRepository;
import hr.mlinx.triangles.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@RequiredArgsConstructor
@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TriangleRepository triangleRepository;

    @Override
    public Collection<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user", "userId", userId));
    }

    @Override
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public boolean existsUserWithUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long userId) {
        User user = getUserById(userId);
        triangleRepository.deleteAll(triangleRepository.findAllByUser(user));
        userRepository.delete(user);
    }

    @Override
    public Set<Role> getRolesOfUser(User user) {
        Hibernate.initialize(user.getRoles());
        return user.getRoles();
    }

}
