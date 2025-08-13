package com.leaveapp.controller;

import com.leaveapp.dto.LoginRequest;
import com.leaveapp.dto.LoginResponse;
import com.leaveapp.dto.UserDto;
import com.leaveapp.entity.User;
import com.leaveapp.repository.UserRepository;
import com.leaveapp.security.JwtTokenProvider;
import com.leaveapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/verify")
    public ResponseEntity<LoginResponse> verify(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setDepartment(user.getDepartment());
        userDto.setRole(user.getRole().name());
        userDto.setAnnualLeaveBalance(user.getAnnualLeaveBalance());
        userDto.setSickLeaveBalance(user.getSickLeaveBalance());
        // Return token as empty since we're only verifying
        return ResponseEntity.ok(new LoginResponse("", userDto));
    }
}
