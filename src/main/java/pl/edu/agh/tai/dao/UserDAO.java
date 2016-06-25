package pl.edu.agh.tai.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import pl.edu.agh.tai.CalendarException;
import pl.edu.agh.tai.data.User;

import static com.mongodb.client.model.Filters.eq;

public class UserDAO {

    public UserDAO() {
    }

    public User getByName(String username) throws CalendarException {
        final Document userDoc;

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getUsersCol();
            userDoc = col.find(new BasicDBObject("username", username)).first();

            if (userDoc == null) return null;

        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }

        return new User(userDoc.getString("_id"), userDoc.getString("username"), userDoc.getString("password"));
    }


    public void add(User user) throws CalendarException {
        try {
            user.genId();

            final MongoCollection<Document> col = DBConnectionHelper.getUsersCol();

            Document doc = userToDoc(user);
            col.insertOne(doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }
    }

    private Document userToDoc(User user) {
        Document doc = new Document("_id", user.getId());
        doc.append("username", user.getUsername());
        doc.append("password", user.getPassword());
        return doc;
    }

    public void edit(User user) throws CalendarException {
        final UpdateResult updateResult;

        try {
            final MongoCollection<Document> col = DBConnectionHelper.getUsersCol();

            Document doc = userToDoc(user);
            updateResult = col.replaceOne(eq("_id", user.getId()), doc);
        } catch (Exception e) {
            throw new CalendarException(e.getMessage());
        }

        if (updateResult.getMatchedCount() < 1) {
            throw new CalendarException("no user with given id");
        }
    }
}
