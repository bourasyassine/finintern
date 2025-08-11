package com.leaveapp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String department;
    private String role;
    private Integer annualLeaveBalance;
    private Integer sickLeaveBalance;
}
