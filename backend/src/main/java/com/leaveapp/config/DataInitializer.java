package com.leaveapp.config;

import com.leaveapp.entity.LeaveRequest;
import com.leaveapp.entity.User;
import com.leaveapp.repository.LeaveRequestRepository;
import com.leaveapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create HR user
            User hrUser = new User();
            hrUser.setEmail("hr@company.com");
            hrUser.setPassword(passwordEncoder.encode("password123"));
            hrUser.setFirstName("Marie");
            hrUser.setLastName("Dubois");
            hrUser.setDepartment("Ressources Humaines");
            hrUser.setRole(User.Role.HR);
            userRepository.save(hrUser);

            // Create Manager user
            User managerUser = new User();
            managerUser.setEmail("manager@company.com");
            managerUser.setPassword(passwordEncoder.encode("password123"));
            managerUser.setFirstName("Pierre");
            managerUser.setLastName("Martin");
            managerUser.setDepartment("IT");
            managerUser.setRole(User.Role.MANAGER);
            userRepository.save(managerUser);

            // Create Employee users
            User employee1 = new User();
            employee1.setEmail("employee@company.com");
            employee1.setPassword(passwordEncoder.encode("password123"));
            employee1.setFirstName("Jean");
            employee1.setLastName("Dupont");
            employee1.setDepartment("IT");
            employee1.setRole(User.Role.EMPLOYEE);
            userRepository.save(employee1);

            User employee2 = new User();
            employee2.setEmail("jane.smith@company.com");
            employee2.setPassword(passwordEncoder.encode("password123"));
            employee2.setFirstName("Sophie");
            employee2.setLastName("Moreau");
            employee2.setDepartment("Marketing");
            employee2.setRole(User.Role.EMPLOYEE);
            userRepository.save(employee2);

            // Create some sample leave requests
            LeaveRequest request1 = new LeaveRequest();
            request1.setEmployee(employee1);
            request1.setStartDate(LocalDate.now().plusDays(10));
            request1.setEndDate(LocalDate.now().plusDays(15));
            request1.setType(LeaveRequest.LeaveType.ANNUAL);
            request1.setReason("Vacances d'été");
            request1.setStatus(LeaveRequest.Status.PENDING);
            leaveRequestRepository.save(request1);

            LeaveRequest request2 = new LeaveRequest();
            request2.setEmployee(employee2);
            request2.setStartDate(LocalDate.now().plusDays(5));
            request2.setEndDate(LocalDate.now().plusDays(7));
            request2.setType(LeaveRequest.LeaveType.SICK);
            request2.setReason("Consultation médicale");
            request2.setStatus(LeaveRequest.Status.APPROVED);
            request2.setApprovedBy(hrUser);
            leaveRequestRepository.save(request2);

            System.out.println("Données d'exemple créées avec succès!");
        }
    }
}
