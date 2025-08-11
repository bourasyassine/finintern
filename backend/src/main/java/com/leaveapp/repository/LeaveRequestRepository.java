package com.leaveapp.repository;

import com.leaveapp.entity.LeaveRequest;
import com.leaveapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByEmployeeId(Long employeeId);
    
    List<LeaveRequest> findByStatus(LeaveRequest.Status status);
    
    List<LeaveRequest> findByEmployee(User employee);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.status = 'PENDING' ORDER BY lr.createdAt ASC")
    List<LeaveRequest> findPendingRequestsOrderByPriorityAndDate();
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.id = :employeeId AND lr.status = 'APPROVED' AND " +
           "((lr.startDate <= :endDate AND lr.endDate >= :startDate))")
    List<LeaveRequest> findOverlappingApprovedRequests(@Param("employeeId") Long employeeId, 
                                                      @Param("startDate") LocalDate startDate, 
                                                      @Param("endDate") LocalDate endDate);
    
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.employee.department = :department ORDER BY lr.createdAt DESC")
    List<LeaveRequest> findByDepartment(@Param("department") String department);
    
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = :status")
    long countByStatus(@Param("status") LeaveRequest.Status status);
}
