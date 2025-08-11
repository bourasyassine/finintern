package com.leaveapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequestDto {
    
    private Long id;
    
    @NotNull(message = "Employee ID is required")
    private Long employeeId;
    
    private String employeeName;
    private String employeeDepartment;
    
    @NotBlank(message = "Leave type is required")
    private String type;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private String reason;
    
    private String status;
    
    private String priority;
    
    private Integer durationInDays;
    
    private String approvedBy;
    
    private LocalDateTime approvedAt;
    
    private String approverComments;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public void setDurationInDays(int days) {
        this.durationInDays = days;
    }
}
