package com.leaveapp.controller;

import com.leaveapp.dto.LoginRequest;
import com.leaveapp.dto.LoginResponse;
import com.leaveapp.dto.UserDto;
import com.leaveapp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
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
    public ResponseEntity<?> verify(@RequestHeader(value = "Authorization", required = false) String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing token");
            }
            String token = authorization.substring(7);
            UserDto user = authService.verifyTokenAndGetUser(token);
            return ResponseEntity.ok().body(new java.util.HashMap<String, Object>() {{
                put("user", user);
            }});
        } catch (Exception ex) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}
