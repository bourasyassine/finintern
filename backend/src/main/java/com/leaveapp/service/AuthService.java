package com.leaveapp.service;

import com.leaveapp.dto.LoginRequest;
import com.leaveapp.dto.LoginResponse;
import com.leaveapp.dto.UserDto;
import com.leaveapp.entity.User;
import com.leaveapp.repository.UserRepository;
import com.leaveapp.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtTokenProvider.generateToken(user);

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setDepartment(user.getDepartment());
        userDto.setRole(user.getRole().name());
        userDto.setAnnualLeaveBalance(user.getAnnualLeaveBalance());
        userDto.setSickLeaveBalance(user.getSickLeaveBalance());

        return new LoginResponse(token, userDto);
    }

    public UserDto register(UserDto userDto, String password) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setDepartment(userDto.getDepartment());
        user.setRole(User.Role.valueOf(userDto.getRole()));

        User savedUser = userRepository.save(user);

        UserDto result = new UserDto();
        result.setId(savedUser.getId());
        result.setEmail(savedUser.getEmail());
        result.setFirstName(savedUser.getFirstName());
        result.setLastName(savedUser.getLastName());
        result.setDepartment(savedUser.getDepartment());
        result.setRole(savedUser.getRole().name());
        result.setAnnualLeaveBalance(savedUser.getAnnualLeaveBalance());
        result.setSickLeaveBalance(savedUser.getSickLeaveBalance());

        return result;
    }
}
