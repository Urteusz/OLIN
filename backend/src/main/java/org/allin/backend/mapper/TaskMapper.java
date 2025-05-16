package org.allin.backend.mapper;

import org.allin.backend.dto.TaskDto;
import org.allin.backend.model.Task;

public class TaskMapper {
    public static Task toEntity(TaskDto dto) {
        if (dto == null) {
            return null;
        }

        Task task = new Task();

        task.setTaskId(dto.taskId());
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setEstimatedTime(dto.estimatedTime());
        task.setCompleted(dto.isCompleted());

        return task;
    }
}
