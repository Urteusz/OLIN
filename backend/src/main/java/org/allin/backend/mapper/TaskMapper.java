package org.allin.backend.mapper;

import org.allin.backend.dto.TaskDto;
import org.allin.backend.model.Task;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Task entities and TaskDto objects.
 */
@Component
public class TaskMapper {

    /**
     * Converts a Task entity to a TaskDto.
     *
     * @param task The Task entity to convert.
     * @return The converted TaskDto.
     */
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
    
    /**
     * Converts a list of Task entities to a list of TaskDto objects.
     *
     * @param tasks The list of Task entities to convert.
     * @return The list of converted TaskDto objects.
     */
    public List<TaskDto> toDtoList(List<Task> tasks) {
        if (tasks == null) {
            return null;
        }
        
        return tasks.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}