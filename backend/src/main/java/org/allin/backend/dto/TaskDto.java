package org.allin.backend.dto;

import java.util.UUID;

public record TaskDto(
        UUID taskId,
        String title,
        String description,
        int estimatedTime,
        boolean isCompleted
) {
}
