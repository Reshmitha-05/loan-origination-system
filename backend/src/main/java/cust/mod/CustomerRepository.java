package cust.mod;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // imports repository

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
