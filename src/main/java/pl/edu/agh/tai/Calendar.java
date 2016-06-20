package pl.edu.agh.tai;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Calendar {
    private String name;

    public Calendar() {
    }

    public Calendar(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
