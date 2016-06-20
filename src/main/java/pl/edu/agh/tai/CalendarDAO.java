package pl.edu.agh.tai;

import java.util.ArrayList;
import java.util.List;

public class CalendarDAO {
    public CalendarDAO() {}

    public List<Calendar> getAll() throws CalendarException {
        List<Calendar> calendars = new ArrayList<>();

        calendars.add(new Calendar("1", "szkola"));
        calendars.add(new Calendar("2", "praca"));
        calendars.add(new Calendar("3", "rozrywka"));

        return calendars;
    }

    public void add(Calendar calendar) throws CalendarException {
        calendar.genId();
        System.out.println("Adding calendar: \n" + calendar);
    }

    public void edit(Calendar calendar) throws CalendarException {
        System.out.println("Editing calendar: \n" + calendar);
    }

    public void delete(String calendarName) throws CalendarException {
        System.out.println("Deleting calendar: " + calendarName);
    }
}
