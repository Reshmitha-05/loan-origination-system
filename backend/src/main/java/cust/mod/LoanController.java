package cust.mod;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoanController {

    private final LoanRepository loanRepository;

    public LoanController(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    @GetMapping("/loans")
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @PostMapping("/loans")
    public Loan createLoan(@RequestBody Loan loan) {
        return loanRepository.save(loan);
    }

    @GetMapping("/loans/{id}")
    public Loan getLoanById(@PathVariable Long id) {
        return loanRepository.findById(id).orElse(null);
    }

    @PutMapping("/loans/{id}")
    public Loan updateLoan(@PathVariable Long id, @RequestBody Loan loan) {
        if (loanRepository.existsById(id)) {
            loan.setId(id);
            return loanRepository.save(loan);
        }
        return null;
    }

    @DeleteMapping("/loans/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanRepository.deleteById(id);
    }
}