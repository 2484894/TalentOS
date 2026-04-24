package com.arpan.placementBackend.service;

import com.arpan.placementBackend.dto.request.ConfirmSlotRequest;
import com.arpan.placementBackend.dto.request.InterviewSlotRequest;
import com.arpan.placementBackend.dto.response.InterviewSlotResponse;
import com.arpan.placementBackend.enums.ApplicationStatus;
import com.arpan.placementBackend.exception.BadRequestException;
import com.arpan.placementBackend.exception.ResourceNotFoundException;
import com.arpan.placementBackend.exception.UnauthorizedException;
import com.arpan.placementBackend.model.InterviewSlot;
import com.arpan.placementBackend.model.JobApplication;
import com.arpan.placementBackend.repository.InterviewSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InterviewSlotService {

    private final InterviewSlotRepository slotRepository;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;

    public InterviewSlotResponse proposeSlots(Long recruiterId,
                                              Long applicationId,
                                              InterviewSlotRequest request) {
        JobApplication application = applicationService.getApplicationOrThrow(applicationId);

        if (!application.getJob().getRecruiter().getId().equals(recruiterId)) {
            throw new UnauthorizedException("You do not own this application.");
        }

        InterviewSlot slot = slotRepository.findByApplicationId(applicationId)
                .orElse(InterviewSlot.builder().application(application).build());

        slot.setProposedTimes(request.getProposedTimes());
        slot.setConfirmed(false);
        slot.setCancelled(false);
        slot.setConfirmedTime(null);

        slotRepository.save(slot);

        // Update application status
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationService.getApplicationOrThrow(applicationId); // reload check
        notificationService.createNotification(
                application.getStudent().getId(),
                "Interview slots have been proposed for your application at \""
                        + application.getJob().getRecruiter().getName() + "\". Please confirm a slot."
        );

        return mapToResponse(slot);
    }

    public InterviewSlotResponse confirmSlot(Long studentId,
                                             Long applicationId,
                                             ConfirmSlotRequest request) {
        JobApplication application = applicationService.getApplicationOrThrow(applicationId);

        if (!application.getStudent().getId().equals(studentId)) {
            throw new UnauthorizedException("This is not your application.");
        }

        InterviewSlot slot = slotRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No interview slot found for this application."));

        if (!slot.getProposedTimes().contains(request.getConfirmedTime())) {
            throw new BadRequestException("Selected time is not in the proposed slots.");
        }

        slot.setConfirmedTime(LocalDateTime.parse(request.getConfirmedTime()));
        slot.setConfirmed(true);
        slotRepository.save(slot);

        notificationService.createNotification(
                application.getJob().getRecruiter().getId(),
                application.getStudent().getName() + " confirmed the interview slot: "
                        + request.getConfirmedTime()
        );

        return mapToResponse(slot);
    }

    public InterviewSlotResponse cancelSlot(Long recruiterId, Long applicationId) {
        JobApplication application = applicationService.getApplicationOrThrow(applicationId);

        if (!application.getJob().getRecruiter().getId().equals(recruiterId)) {
            throw new UnauthorizedException("You do not own this application.");
        }

        InterviewSlot slot = slotRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No interview slot found."));

        slot.setCancelled(true);
        slot.setConfirmed(false);
        slotRepository.save(slot);

        notificationService.createNotification(
                application.getStudent().getId(),
                "Your interview for \"" + application.getJob().getTitle() + "\" has been cancelled."
        );

        return mapToResponse(slot);
    }

    public InterviewSlotResponse getSlotByApplication(Long applicationId) {
        InterviewSlot slot = slotRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No interview slot found for application: " + applicationId));
        return mapToResponse(slot);
    }

    private InterviewSlotResponse mapToResponse(InterviewSlot slot) {
        return InterviewSlotResponse.builder()
                .id(slot.getId())
                .applicationId(slot.getApplication().getId())
                .proposedTimes(slot.getProposedTimes())
                .confirmedTime(slot.getConfirmedTime())
                .confirmed(slot.isConfirmed())
                .cancelled(slot.isCancelled())
                .build();
    }
}