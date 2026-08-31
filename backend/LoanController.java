package cust.mod;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController  
    public class LoanController{
    private LoanStorage loanStorage;  
    public LoanController(LoanStorage loanStorage) {
        this.loanStorage = loanStorage;  // Store the storage object
    }
    
    @GetMapping("/loans")
    public List<Loan> getAllLoans() {
        return loanStorage.getAll();
    }
    

    @PostMapping("/loans")
    public Loan createLoan(@RequestBody Loan loan) {
        return loanStorage.add(loan);
    }


    @GetMapping("/loans/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanStorage.getById(id);
    }
    
   
    @PutMapping("/loans/{id}")
    public Loan updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        loanStorage.update(id, loan);
        return loan;
    }
    

    @DeleteMapping("/loans/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanStorage.delete(id);
    }
}
