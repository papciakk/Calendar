package pl.edu.agh.tai.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import pl.edu.agh.tai.CalendarException;
import pl.edu.agh.tai.data.Calendar;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

public class CalendarDAO {

    public CalendarDAO() {}

    public List<Calendar> getAll() throws CalendarException {
        List<Calendar> calendars = new ArrayList<>();

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            if (col.count() == 0) {
                addDefaultCalendar();
            }

            try (MongoCursor<Document> cur = col.find().iterator()) {
                while (cur.hasNext()) {
                    Document doc = cur.next();

                    Calendar calendar = new Calendar();
                    calendar.setId(doc.getString("_id"));
                    calendar.setName(doc.getString("name"));

                    calendars.add(calendar);
                }
            }
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }

        return calendars;
    }

    private void addDefaultCalendar() throws CalendarException {
        Calendar calendar = new Calendar();
        calendar.setName("Kalendarz bez nazwy");
        add(calendar);
    }

    public void add(Calendar calendar) throws CalendarException {
        try {
            calendar.genId();

            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            Document doc = new Document("_id", calendar.getId());
            doc.append("name", calendar.getName());

            col.insertOne(doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    public void edit(Calendar calendar) throws CalendarException {
        final UpdateResult updateResult;

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            updateResult = col.updateOne(new Document("_id", calendar.getId()),
                    new Document("$set", new Document("name", calendar.getName())));
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }

        if (updateResult.getMatchedCount() < 1) {
            throw new CalendarException("no calendar with given id");
        }
    }

    public void delete(String calendarID) throws CalendarException {
        final DeleteResult deleteResult;

        try {
            deleteEventsByCalendarId(calendarID);

            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();
            deleteResult = col.deleteOne(eq("_id", calendarID));
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }

        if (deleteResult.getDeletedCount() < 1) {
            throw new CalendarException("no calendar with given id");
        }

    }

    private void deleteEventsByCalendarId(String calendarID) throws CalendarException {
        try {
            final MongoCollection<Document> col = DBConnectionHelper.getEventsCol();
            col.deleteMany(eq("calendarId", calendarID));
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }
}
