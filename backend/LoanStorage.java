package cust.mod;

import java.util.ArrayList;
import java.util.List;

public class LoanStorage {
    private List<Loan> loans = new ArrayList<>();
    private Long nextId = 1L;

    public List<Loan> getAll() {
        return loans;
    }

    public Loan getById(Long id) {
        for (Loan loan : loans) {
            if (loan.getId().equals(id)) {
                return loan;
            }
        }
        return null;
    }

    public Loan add(Loan loan) {
        loan.setId(nextId);
        nextId++;
        loans.add(loan);
        return loan;
    }

    public void update(Long id, Loan loan) {
        for (int i = 0; i < loans.size(); i++) {
            if (loans.get(i).getId().equals(id)) {
                loan.setId(id);
                loans.set(i, loan);
                break;
            }
        }
    }

    public void delete(Long id) {
        loans.removeIf(l -> l.getId().equals(id));
    }
}