package pl.edu.agh.tai.dao;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import pl.edu.agh.tai.data.Calendar;
import pl.edu.agh.tai.CalendarException;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;


@Component
public class CalendarDAO {

    @Autowired
    DBConnectionHelper dbConn;

    public CalendarDAO() {}

    public List<Calendar> getAll() throws CalendarException {

        List<Calendar> calendars = new ArrayList<>();

        System.out.println(dbConn);

        final MongoCollection<Document> col = dbConn.getCalendarsCol();

        if(col.count() == 0) {
            addDefaultCalendar();
        }

        try(MongoCursor<Document> cur = col.find().iterator()) {
            while(cur.hasNext()) {
                Document doc = cur.next();

                Calendar calendar = new Calendar();
                calendar.setId(doc.getObjectId("_id").toString());
                calendar.setName(doc.getString("name"));

                calendars.add(calendar);
            }
        }

        return calendars;
    }

    private void addDefaultCalendar() throws CalendarException {
        Calendar calendar = new Calendar();
        calendar.setName("Kalendarz bez nazwy");
        add(calendar);
    }

    public void add(Calendar calendar) throws CalendarException {
        calendar.genId();

        final MongoCollection<Document> col = dbConn.getCalendarsCol();

        Document doc = new Document("_id", calendar.getId());
        doc.append("name", calendar.getName());

        col.insertOne(doc);
    }

    public void edit(Calendar calendar) throws CalendarException {
        final MongoCollection<Document> col = dbConn.getCalendarsCol();

        col.updateOne(new Document("_id", calendar.getId()),
                new Document("$set", new Document("name", calendar.getName())));
    }

    public void delete(String calendarID) throws CalendarException {
        final MongoCollection<Document> col = dbConn.getCalendarsCol();

        col.deleteOne(eq("_id", calendarID));

    }
}
