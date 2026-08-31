package cust.mod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
public class CustomerController {
    
    private CustomerStorage customerStorage;  // to access cust storage
    /*cust controller needs to know what cust storage is for it to access
    how will it know?,that is why constructor is used */
    public CustomerController(CustomerStorage customerStorage) {
        this.customerStorage = customerStorage;  // Store the storage object
    }
    //Endpoint 1:
    // Get all customers , this is used to show data 
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() { // list<cust> is the return type
        // Return all customers from storage
        return customerStorage.getAll();
    }
    
    // Endpoint 2: POST /customers - Create a new customer 
    // this is used to add data 
    @PostMapping("/customers")
    public Customer createCustomer(@RequestBody Customer customer) {
        // @requestbody , spring creates customer card
        // Storage will assign an ID and save the customer
        return customerStorage.add(customer);
    }
    
    // Endpoint 3: GET /customers/{id} - Get a single customer by ID
    @GetMapping("/customers/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        // @PathVariable takes the id from the URL path
        // Returns the customer with matching ID
        return customerStorage.getById(id);
    }
    
    // Endpoint 4: PUT /customers/{id} - Update a customer
    @PutMapping("/customers/{id}")
    public Customer updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        customerStorage.update(id, customer);
        return customer;
    }
    
    // Endpoint 5: DELETE /customers/{id} - Delete a customer
    @DeleteMapping("/customers/{id}")
    public void deleteCustomer(@PathVariable Long id) {
        customerStorage.delete(id);
    }
}