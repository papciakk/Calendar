package pl.edu.agh.tai.dao;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

class DBConnectionHelper {

    private static MongoDatabase db = null;

    DBConnectionHelper() {
    }

    private static void init() {
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        db = mongoClient.getDatabase("calendar");
    }

    static MongoCollection<Document> getCalendarsCol() {
        return getDb().getCollection("calendars");
    }

    static MongoCollection<Document> getUsersCol() {
        return getDb().getCollection("users");
    }

    static MongoCollection<Document> getEventsCol() {
        return getDb().getCollection("events");
    }

    private static MongoDatabase getDb() {
        if (db == null) {
            init();
        }
        return db;
    }
}
