package pl.edu.agh.tai.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import pl.edu.agh.tai.data.Calendar;
import pl.edu.agh.tai.CalendarException;

import java.util.ArrayList;
import java.util.List;


@Component
public class CalendarDAO {

    @Autowired
    DBConnectionHelper dbConn;

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

    public void delete(String calendarID) throws CalendarException {
        System.out.println("Deleting calendar with id: " + calendarID);
    }
}
