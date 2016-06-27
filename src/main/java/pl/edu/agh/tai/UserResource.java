package pl.edu.agh.tai;

import org.springframework.security.core.context.SecurityContextHolder;
import pl.edu.agh.tai.dao.UserDAO;
import pl.edu.agh.tai.data.Response;
import pl.edu.agh.tai.data.User;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/user")
public class UserResource {
    private UserDAO userDAO = new UserDAO();

    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response<Boolean> isLoggedIn() {
// TODO: fix
        final Response<Boolean> response = new Response<>();

        final boolean isLoggedIn = SecurityContextHolder.getContext().getAuthentication() != null &&
                SecurityContextHolder.getContext().getAuthentication().isAuthenticated();

        response.setSuccess(true);
        response.setObject(isLoggedIn);

        return response;
    }

    @POST
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response register(User user) {

        final Response response = new Response();

        try {
            final String username = user.getUsername();
            final User userDuplicate = userDAO.getByName(username);

            if (userDuplicate != null) {
                response.setSuccess(false);
                response.setErrorCode(1);
            } else {
                userDAO.add(user);
                response.setSuccess(true);
            }
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

}