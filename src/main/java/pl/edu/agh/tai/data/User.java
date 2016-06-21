package pl.edu.agh.tai.data;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User {
    private String username;

    public User() {
    }

    public User(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
