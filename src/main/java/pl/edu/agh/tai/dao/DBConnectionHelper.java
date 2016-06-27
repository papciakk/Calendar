package pl.edu.agh.tai.dao;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class DBConnectionHelper {

    private static MongoDatabase db = null;

    DBConnectionHelper() {
    }

    private static void init() {
        String mongolabStr;
        if(System.getenv("MONGOLAB_URI") != null) {
            mongolabStr = System.getenv("MONGOLAB_URI");
        } else {
            mongolabStr = "mongodb://127.0.0.1:27017/calendar";
        }

        MongoClientURI mongolabUri = new MongoClientURI(mongolabStr);
        MongoClient mongoClient = new MongoClient(mongolabUri);

        db = mongoClient.getDatabase(mongolabUri.getDatabase());
    }

    public static MongoCollection<Document> getCalendarsCol() {
        return getDb().getCollection("calendars");
    }

    public static MongoCollection<Document> getUsersCol() {
        return getDb().getCollection("users");
    }

    public static MongoCollection<Document> getEventsCol() {
        return getDb().getCollection("events");
    }

    private static MongoDatabase getDb() {
        if (db == null) {
            init();
        }
        return db;
    }
}
