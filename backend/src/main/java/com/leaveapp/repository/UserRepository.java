package com.leaveapp.repository;

import com.leaveapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByDepartment(String department);
    
    @Query("SELECT u FROM User u WHERE u.role = 'EMPLOYEE' ORDER BY u.firstName")
    List<User> findAllEmployees();
    
    @Query("SELECT u FROM User u WHERE u.role IN ('MANAGER', 'HR') ORDER BY u.firstName")
    List<User> findAllManagers();
}
