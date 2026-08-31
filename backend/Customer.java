package cust.mod;
import java.util.List;
public class Customer {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber; /* string is used for no as it is not used
for calc , string can accomodate + , and many digits*/

    public Customer() { /* blank constructor to accept empty customers , 
    else the customer must always be entered with entire info no blank */
    } 
    public Customer(Long id, String name, String email, String phoneNumber) {
        this.id = id; // filled cust constructor 
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id; // void is used as it has nothing to return back 
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}