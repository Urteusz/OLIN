package org.allin.backend.mapper;

import org.allin.backend.dto.TaskDto;
import org.allin.backend.model.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        if (task == null) {
            return null;
        }
        
        TaskDto dto = new TaskDto();
        dto.setTaskId(task.getTaskId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setEstimatedTime(task.getEstimatedTime());
        dto.setCompleted(task.isCompleted());
        dto.setDate(task.getDate());
        
        return dto;
    }

    public List<TaskDto> toDtoList(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }
        
        return tasks.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}