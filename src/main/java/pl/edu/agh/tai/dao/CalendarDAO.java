package pl.edu.agh.tai.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import pl.edu.agh.tai.CalendarException;
import pl.edu.agh.tai.data.Calendar;
import pl.edu.agh.tai.security.CurrentUser;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

public class CalendarDAO {

    public CalendarDAO() {}

    private void checkCalendarOwner(String id, MongoCollection<Document> col) throws CalendarException {
        final String currentUser = CurrentUser.getName();
        final Document checkUser = col.find(and(eq("userID", currentUser), eq("_id", id))).first();
        if (checkUser == null) {
            throw new CalendarException("You don't have rights to edit this calendar");
        }
    }

    public List<Calendar> getAll() throws CalendarException {
        List<Calendar> calendars = new ArrayList<>();

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            final String currentUser = CurrentUser.getName();

            try (MongoCursor<Document> cur = col.find(new BasicDBObject("userID", currentUser)).iterator()) {
                if (!cur.hasNext()) {
                    addDefaultCalendar();
                }

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

            final String currentUser = CurrentUser.getName();

            Document doc = new Document("_id", calendar.getId());
            doc.append("name", calendar.getName());
            doc.append("userID", currentUser);

            col.insertOne(doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    public void edit(Calendar calendar) throws CalendarException {
        final UpdateResult updateResult;

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            // check if calendar belongs to current user
            checkCalendarOwner(calendar.getId(), col);

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
            final MongoCollection<Document> col = DBConnectionHelper.getCalendarsCol();

            // check if calendar belongs to current user
            checkCalendarOwner(calendarID, col);

            deleteEventsByCalendarId(calendarID);
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
