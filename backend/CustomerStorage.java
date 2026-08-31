package cust.mod;
import java.util.ArrayList;
import java.util.List;

public class CustomerStorage {// customer contains many cust 
    private List<Customer> customers = new ArrayList<>(); 
    private Long nextId = 1L; // next id 1, then 2 , then 3 

    public List<Customer> getAll() {
        return customers; // returns all customers in cupboard
    }

    public Customer getById(Long id) { //getby used to get one 
        for (Customer customer : customers) { //one card take , check it in customers
            if (customer.getId().equals(id)) { 
                return customer;
            }
        }
        return null;
    }
    public Customer add(Customer customer) { //Customer type data customer 
        customer.setId(nextId);
        nextId++;
        customers.add(customer);
        return customer;
    }

    public void update(Long id, Customer customer) {
        for (int i = 0; i < customers.size(); i++) {
            if (customers.get(i).getId().equals(id)) { //i=position,id=id of it 
                customer.setId(id);                   // if i's id = id
                customers.set(i, customer);
                break;
            }
        }
    }

    public void delete(Long id) {
        customers.removeIf(c -> c.getId().equals(id));
    }
}