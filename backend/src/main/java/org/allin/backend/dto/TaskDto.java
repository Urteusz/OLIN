package org.allin.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private UUID taskId;
    private String title;
    private String description;
    private int estimatedTime;
    private boolean isCompleted;
    private LocalDate date;
}