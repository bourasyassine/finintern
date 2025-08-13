package com.leaveapp.controller;

import com.leaveapp.dto.ApprovalRequest;
import com.leaveapp.dto.LeaveRequestDto;
import com.leaveapp.entity.User;
import com.leaveapp.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<List<LeaveRequestDto>> getMyRequests(@AuthenticationPrincipal User currentUser) {
        List<LeaveRequestDto> requests = leaveRequestService.getRequestsByEmployee(currentUser.getId());
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequestDto>> getPendingRequests() {
        List<LeaveRequestDto> requests = leaveRequestService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping
    public ResponseEntity<LeaveRequestDto> createRequest(@AuthenticationPrincipal User currentUser,
                                                         @RequestBody LeaveRequestDto requestDto) {
        requestDto.setEmployeeId(currentUser.getId());
        LeaveRequestDto createdRequest = leaveRequestService.createRequest(requestDto);
        return ResponseEntity.ok(createdRequest);
    }
    
    @PatchMapping("/{id}/approve")
    public ResponseEntity<LeaveRequestDto> approveRequest(@PathVariable Long id,
                                                          @AuthenticationPrincipal User currentUser,
                                                          @RequestBody(required = false) ApprovalRequest approvalRequest) {
        String comments = approvalRequest != null ? approvalRequest.getComments() : null;
        LeaveRequestDto approvedRequest = leaveRequestService.approveRequest(id, currentUser.getId(), comments);
        return ResponseEntity.ok(approvedRequest);
    }
    
    @PatchMapping("/{id}/reject")
    public ResponseEntity<LeaveRequestDto> rejectRequest(@PathVariable Long id,
                                                         @AuthenticationPrincipal User currentUser,
                                                         @RequestBody(required = false) ApprovalRequest approvalRequest) {
        String comments = approvalRequest != null ? approvalRequest.getComments() : null;
        LeaveRequestDto rejectedRequest = leaveRequestService.rejectRequest(id, currentUser.getId(), comments);
        return ResponseEntity.ok(rejectedRequest);
    }
}
