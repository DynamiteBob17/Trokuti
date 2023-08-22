package hr.mlinx.triangles.security;

import hr.mlinx.triangles.entity.User;
import hr.mlinx.triangles.exception.ResourceNotFoundException;
import hr.mlinx.triangles.service.UserService;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("korisnik", "korisničkim imenom", username));

        CustomUserDetails customUserDetails = new CustomUserDetails();
        customUserDetails.setId(user.getId());
        customUserDetails.setUsername(user.getUsername());
        customUserDetails.setPassword(user.getPassword());
        Hibernate.initialize(userService.getRolesOfUser(user));
        customUserDetails.setRoles(userService.getRolesOfUser(user));

        return customUserDetails;
    }

}
