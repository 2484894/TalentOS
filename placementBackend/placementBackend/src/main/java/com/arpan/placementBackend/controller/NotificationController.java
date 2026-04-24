package com.arpan.placementBackend.controller;
import com.arpan.placementBackend.dto.response.ApiResponse;
import com.arpan.placementBackend.dto.response.NotificationResponse;
import com.arpan.placementBackend.model.User;
import com.arpan.placementBackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/v1/notifications  — all notifications for current user
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal User currentUser) {
        List<NotificationResponse> notifications =
                notificationService.getMyNotifications(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched.", notifications));
    }

    // GET /api/v1/notifications/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal User currentUser) {
        long count = notificationService.getUnreadCount(currentUser.getId());
        return ResponseEntity.ok(
                ApiResponse.success("Unread count fetched.", Map.of("unreadCount", count)));
    }

    // PATCH /api/v1/notifications/{notificationId}/read  — mark one as read
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read."));
    }

    // PATCH /api/v1/notifications/read-all  — mark all as read
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read."));
    }
}