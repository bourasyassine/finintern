package com.leaveapp.controller;

import com.leaveapp.dto.LeaveRequestDto;
import com.leaveapp.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LeaveRequestController {
    
    private final LeaveRequestService leaveRequestService;
    
    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAllRequests() {
        List<LeaveRequestDto> requests = leaveRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<List<LeaveRequestDto>> getMyRequests(@RequestParam Long employeeId) {
        List<LeaveRequestDto> requests = leaveRequestService.getRequestsByEmployee(employeeId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequestDto>> getPendingRequests() {
        List<LeaveRequestDto> requests = leaveRequestService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping
    public ResponseEntity<LeaveRequestDto> createRequest(@RequestBody LeaveRequestDto requestDto) {
        LeaveRequestDto createdRequest = leaveRequestService.createRequest(requestDto);
        return ResponseEntity.ok(createdRequest);
    }
    
    @PatchMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approveRequest(@PathVariable Long id, @RequestParam Long approverId) {
        LeaveRequestDto approvedRequest = leaveRequestService.approveRequest(id, approverId);
        return ResponseEntity.ok(approvedRequest);
    }
    
    @PatchMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> rejectRequest(@PathVariable Long id, @RequestParam Long approverId) {
        LeaveRequestDto rejectedRequest = leaveRequestService.rejectRequest(id, approverId);
        return ResponseEntity.ok(rejectedRequest);
    }
}
