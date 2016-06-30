package pl.edu.agh.tai.security;

import jersey.repackaged.com.google.common.collect.Sets;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import pl.edu.agh.tai.main.CalendarException;
import pl.edu.agh.tai.dao.UserDAO;

import java.util.Collection;

public class MongoUserDetailsService implements UserDetailsService {
    private UserDAO userDAO = new UserDAO();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails userDetails = null;

        try {
            final pl.edu.agh.tai.data.User user = userDAO.getByName(username);

            if (user == null) {
                throw new UsernameNotFoundException("User with name " + username + " cannot be found");
            }

            Collection<SimpleGrantedAuthority> authorities = Sets.newHashSet(new SimpleGrantedAuthority("ROLE_USER"));
            userDetails = new User(user.getUsername(), user.getPassword(), true, true, true, true, authorities);

        } catch (CalendarException e) {
            e.printStackTrace();
        }

        return userDetails;
    }
}
