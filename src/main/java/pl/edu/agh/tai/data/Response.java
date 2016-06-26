package pl.edu.agh.tai.data;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Response<T> {
    private boolean success;
    private String message;
    private T object;

    private int errorCode;

    public Response() {
        this.success = false;
        this.message = "";
        this.object = null;
        this.errorCode = 0;
    }

    public Response(boolean success, String message, T object) {
        this.success = success;
        this.message = message;
        this.object = object;
        this.errorCode = 0;
    }

    public Response(boolean success, String message, T object, int errorCode) {
        this(success, message, object);
        this.errorCode = errorCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getObject() {
        return object;
    }

    public void setObject(T object) {
        this.object = object;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

}
