package pl.edu.agh.tai.main;

import pl.edu.agh.tai.dao.CalendarDAO;
import pl.edu.agh.tai.data.Calendar;
import pl.edu.agh.tai.data.Response;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/calendars")
public class CalendarResource {
    private CalendarDAO calendarDAO = new CalendarDAO();

    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response<List<Calendar>> getAll() {

        Response<List<Calendar>> response = new Response<>();

        try {
            List<Calendar> calendarList = calendarDAO.getAll();
            response.setSuccess(true);
            response.setObject(calendarList);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @POST
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addCalendar(Calendar calendar) {

        Response response = new Response();

        try {
            calendarDAO.add(calendar);
            response.setSuccess(true);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @PUT
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response editCalendar(Calendar calendar) {

        Response response = new Response();

        try {
            calendarDAO.edit(calendar);
            response.setSuccess(true);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @DELETE
    @Path("/{calendarID}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteEvent(@PathParam("calendarID") String calendarID) {

        Response response = new Response();

        try {
            calendarDAO.delete(calendarID);
            response.setSuccess(true);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }
}