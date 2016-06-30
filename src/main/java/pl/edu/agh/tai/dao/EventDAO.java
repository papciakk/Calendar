package pl.edu.agh.tai.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import pl.edu.agh.tai.main.CalendarException;
import pl.edu.agh.tai.data.Event;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

public class EventDAO {
    public EventDAO() {}

    private Event docToEvent(Document eventDoc) {
        final Event event = new Event();
        event.setId(eventDoc.getString("_id"));
        event.setColor(eventDoc.getInteger("color"));
        event.setDate(eventDoc.getString("date"));
        event.setEndTime(eventDoc.getString("endTime"));
        event.setStartTime(eventDoc.getString("startTime"));
        event.setInfo(eventDoc.getString("info"));
        event.setTitle(eventDoc.getString("title"));
        return event;
    }

    private Document eventToDoc(Event event, String calendarId) {
        final Document doc = new Document("_id", event.getId());
        doc.append("title", event.getTitle());
        doc.append("date", event.getDate());
        doc.append("startTime", event.getStartTime());
        doc.append("endTime", event.getEndTime());
        doc.append("info", event.getInfo());
        doc.append("color", event.getColor());
        doc.append("calendarId", calendarId);
        return doc;
    }

    private String getCalendarIdByName(String calendarName) throws CalendarException {
        final Document calendar = DBConnectionHelper.getCalendarsCol().find(eq("name", calendarName)).first();
        if (calendar == null) {
            throw new CalendarException("No calendar with name " + calendarName);
        }
        return calendar.getString("_id");
    }

    public Event getEventById(String calendarName, String eventID) throws CalendarException {
        final String calendarId = getCalendarIdByName(calendarName);
        final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();

        BasicDBObject query = new BasicDBObject("_id", eventID);
        query.append("calendarId", calendarId);
        final Document eventDoc = col.find(query).first();

        return docToEvent(eventDoc);
    }

    public List<Event> getEventsByDate(String calendarName, String date) throws CalendarException {
        final List<Event> events = new ArrayList<>();

        final String calendarId = getCalendarIdByName(calendarName);
        final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();

        final BasicDBObject query = new BasicDBObject("calendarId", calendarId);
        query.append("date", date);

        final FindIterable<Document> eventDocs = col.find(query);
        for(Document eventDoc : eventDocs) {
            final Event event = docToEvent(eventDoc);
            events.add(event);
        }

        return events;
	}

    public void addEvent(String calendarName, Event event) throws CalendarException {
        try {
            event.genId();

            final String calendarId = getCalendarIdByName(calendarName);
            final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();

            final Document doc = eventToDoc(event, calendarId);
            col.insertOne(doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    public void editEvent(String calendarName, Event event) throws CalendarException {
        try {
            final String calendarId = getCalendarIdByName(calendarName);
            final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();

            final Document doc = eventToDoc(event, calendarId);

            col.replaceOne(eq("_id", event.getId()), doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    public void deleteEvent(String calendarName, String eventID) throws CalendarException {
        try {
            final String calendarId = getCalendarIdByName(calendarName);
            final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();
            col.deleteMany(and(eq("calendarId", calendarId), eq("_id", eventID)));
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }
}
