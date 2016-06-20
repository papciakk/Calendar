package pl.edu.agh.tai;

import org.bson.types.ObjectId;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Calendar {
    private String id;
    private String name;

    public Calendar() {
    }

    public Calendar(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String toString() {
        return "Calendar " + id + "\n" +
                "name: " + name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void genId() {
        this.id = new ObjectId().toString();
    }
}
