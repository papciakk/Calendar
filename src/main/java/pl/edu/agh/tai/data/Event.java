package pl.edu.agh.tai.data;

import org.bson.types.ObjectId;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Event {
    private String id;
    private String title;
    private String date;
    private String startTime;
    private String endTime;
    private String info;
    private int color;

    public Event() {}

    public Event(String id, String title, String date, String startTime, String endTime, String info, int color) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.info = info;
        this.color = color;
    }

    public Event(String id, String title, String date, String startTime, String endTime) {
        this(id, title, date, startTime, endTime, "", 1);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public int getColor() {
        return color;
    }

    public void setColor(int color) {
        this.color = color;
    }

    public String toString() {
        return "Event " + id + "\n" +
            "title: " + title + "\n" +
            "date: " + date + "\n" +
            "startTime: " + startTime + "\n" +
            "endTime: " + endTime + "\n" +
            "info: " + info + "\n" +
            "color: " + color + "\n";
    }

    public void genId() {
        this.id = new ObjectId().toString();
    }
}
