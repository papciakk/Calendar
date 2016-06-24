package pl.edu.agh.tai.dao;

import com.mongodb.client.MongoCollection;
import org.bson.Document;
import pl.edu.agh.tai.CalendarException;
import pl.edu.agh.tai.data.Event;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

public class EventDAO {
    public EventDAO() {}

    public Event getEventById(String calendarName, String eventID) throws CalendarException {


        //col.find(and(eq("_id", eventID), eq("")));

        return new Event("1", "Ala1", "2015-05-21", "10:20", "12:53", "Ala ma kota2", 2);
    }
	
	public List<Event> getEventsByDate(String calendarName, String date) throws CalendarException {
        List<Event> events = new ArrayList<>();
        events.add(new Event("2", "pffffyyyyff", "2015-05-21", "7:20", "9:53", "Ala ma ff", 2));
        events.add(new Event("1", "Ala1", "2015-05-21", "10:20", "12:53", "Ala ma kota2", 2));

        return events;
	}

    public void addEvent(String calendarName, Event event) throws CalendarException {
        try {
            event.genId();

            final String calendarId = getCalendarIdByName(calendarName);

            final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();

            Document doc = new Document("_id", event.getId());
            doc.append("title", event.getTitle());
            doc.append("date", event.getDate());
            doc.append("startTime", event.getStartTime());
            doc.append("endTime", event.getEndTime());
            doc.append("info", event.getInfo());
            doc.append("color", event.getColor());
            doc.append("calendarId", calendarId);

            col.insertOne(doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    public void editEvent(String calendarName, Event event) throws CalendarException {
        System.out.println("Editing event: \n" + event);
    }

    public void deleteEvent(String calendarName, String eventID) throws CalendarException {
        System.out.println("Deleting event " + eventID);
    }

    private String getCalendarIdByName(String calendarName) throws CalendarException {
        final Document calendar = DBConnectionHelper.getCalendarsCol().find(eq("name", calendarName)).first();
        if (calendar == null) {
            throw new CalendarException("No calendar with name " + calendarName);
        }
        return calendar.getString("_id");
    }
}
