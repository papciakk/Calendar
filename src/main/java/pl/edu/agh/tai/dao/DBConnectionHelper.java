package pl.edu.agh.tai.dao;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

//@Component
class DBConnectionHelper {

    private MongoDatabase db;

    DBConnectionHelper() {
    }

    void init() {
        MongoClient mongoClient = new MongoClient("localhost", 27017);
        db = mongoClient.getDatabase("calendar");
    }

    MongoCollection<Document> getCalendarsCol() {
        return db.getCollection("calendars");
    }

    MongoCollection<Document> getUsersCol() {
        return db.getCollection("users");
    }

    MongoCollection<Document> getEventsCol() {
        return db.getCollection("calendars");
    }

    public MongoDatabase getDb() {
        return db;
    }
}
