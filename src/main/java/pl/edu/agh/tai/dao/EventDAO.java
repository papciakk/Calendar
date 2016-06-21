package pl.edu.agh.tai.dao;

import pl.edu.agh.tai.CalendarException;
import pl.edu.agh.tai.data.Event;

import java.util.ArrayList;
import java.util.List;

public class EventDAO {
    public EventDAO() {}

    public Event getEventById(String calendarName, String eventID) throws CalendarException {
        //throw new CalendarException("aa");
        return new Event("1", "Ala1", "2015-05-21", "10:20", "12:53", "Ala ma kota2", 2);
    }
	
	public List<Event> getEventsByDate(String calendarName, String date) throws CalendarException {
        List<Event> events = new ArrayList<>();
        events.add(new Event("2", "pffffyyyyff", "2015-05-21", "7:20", "9:53", "Ala ma ff", 2));
        events.add(new Event("1", "Ala1", "2015-05-21", "10:20", "12:53", "Ala ma kota2", 2));

        return events;
	}

    public void addEvent(String calendarName, Event event) throws CalendarException {
        event.genId();
        System.out.println("Adding event: \n" + event);
    }

    public void editEvent(String calendarName, Event event) throws CalendarException {
        System.out.println("Editing event: \n" + event);
    }

    public void deleteEvent(String calendarName, String eventID) throws CalendarException {
        System.out.println("Deleting event " + eventID);
    }
}
