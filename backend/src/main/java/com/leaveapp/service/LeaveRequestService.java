package com.leaveapp.service;

import com.leaveapp.dto.LeaveRequestDto;
import com.leaveapp.entity.LeaveRequest;
import com.leaveapp.entity.User;
import com.leaveapp.repository.LeaveRequestRepository;
import com.leaveapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;

    public List<LeaveRequestDto> getAllRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDto> getRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestDto> getPendingRequests() {
        return leaveRequestRepository.findByStatus(LeaveRequest.Status.PENDING).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public LeaveRequestDto createRequest(LeaveRequestDto requestDto) {
        User employee = userRepository.findById(requestDto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setStartDate(requestDto.getStartDate());
        request.setEndDate(requestDto.getEndDate());
        request.setType(normalizeLeaveType(requestDto.getType()));
        request.setReason(requestDto.getReason());
        request.setStatus(LeaveRequest.Status.PENDING);

        LeaveRequest savedRequest = leaveRequestRepository.save(request);
        return convertToDto(savedRequest);
    }

    public LeaveRequestDto approveRequest(Long requestId, Long approverId, String comments) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        request.setStatus(LeaveRequest.Status.APPROVED);
        request.setApprovedBy(approver);
        request.setApprovedAt(LocalDateTime.now());
        request.setApproverComments(comments);

        LeaveRequest savedRequest = leaveRequestRepository.save(request);
        return convertToDto(savedRequest);
    }

    public LeaveRequestDto rejectRequest(Long requestId, Long approverId, String comments) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        request.setStatus(LeaveRequest.Status.REJECTED);
        request.setApprovedBy(approver);
        request.setApprovedAt(LocalDateTime.now());
        request.setApproverComments(comments);

        LeaveRequest savedRequest = leaveRequestRepository.save(request);
        return convertToDto(savedRequest);
    }

    private LeaveRequestDto convertToDto(LeaveRequest request) {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setId(request.getId());
        dto.setEmployeeId(request.getEmployee().getId());
        dto.setEmployeeName(request.getEmployee().getFirstName() + " " + request.getEmployee().getLastName());
        dto.setEmployeeDepartment(request.getEmployee().getDepartment());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setType(request.getType().name());
        dto.setReason(request.getReason());
        dto.setStatus(request.getStatus().name());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setDurationInDays((int) request.getDurationInDays());
        if (request.getApprovedBy() != null) {
            dto.setApprovedBy(request.getApprovedBy().getFirstName() + " " + request.getApprovedBy().getLastName());
            dto.setApprovedAt(request.getApprovedAt());
            dto.setApproverComments(request.getApproverComments());
        }
        return dto;
    }

    private LeaveRequest.LeaveType normalizeLeaveType(String clientType) {
        if (clientType == null) {
            throw new IllegalArgumentException("Leave type is required");
        }
        String normalized = clientType.trim().toUpperCase();
        // Map values like "ANNUAL_LEAVE" -> "ANNUAL", "SICK_LEAVE" -> "SICK", etc.
        if (normalized.endsWith("_LEAVE")) {
            normalized = normalized.replace("_LEAVE", "");
        }
        return LeaveRequest.LeaveType.valueOf(normalized);
    }
}
