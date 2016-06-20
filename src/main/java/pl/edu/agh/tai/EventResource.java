package pl.edu.agh.tai;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/{calendar}/event")
public class EventResource {
    private EventDAO eventDAO = new EventDAO();

    @GET
    @Path("/id/{eventID}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response<Event> getEventById(@PathParam("calendar") String calendarName,
                                        @PathParam("eventID") String eventID) {

        Response<Event> response = new Response<>();

        try {
            Event event = eventDAO.getEventById(calendarName, eventID);
            response.setSuccess(true);
            response.setObject(event);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @GET
    @Path("/date/{date}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response<List<Event>> getEventsByDate(@PathParam("calendar") String calendarName,
                                                 @PathParam("date") String date) {


        Response<List<Event>> response = new Response<>();

        try {
            List<Event> events = eventDAO.getEventsByDate(calendarName, date);
            response.setSuccess(true);
            response.setObject(events);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @POST
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response addEvent(Event event, @PathParam("calendar") String calendarName) {

        Response response = new Response();

        try {
            eventDAO.addEvent(calendarName, event);
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
    public Response editEvent(Event event, @PathParam("calendar") String calendarName) {

        Response response = new Response();

        try {
            eventDAO.editEvent(calendarName, event);
            response.setSuccess(true);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    @DELETE
    @Path("/{eventID}")
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    public Response deleteEvent(@PathParam("calendar") String calendarName,
                                @PathParam("eventID") String eventID) {

        Response response = new Response();

        try {
            eventDAO.deleteEvent(calendarName, eventID);
            response.setSuccess(true);
        } catch (CalendarException e) {
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }
}