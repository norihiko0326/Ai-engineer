package com.taskapp.controller;

import com.taskapp.dto.TaskRequest;
import com.taskapp.dto.TaskResponse;
import com.taskapp.entity.TaskStatus;
import com.taskapp.service.TaskService;
import com.taskapp.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getAllTasks() {
        log.debug("Fetching all tasks");
        List<TaskResponse> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Long id) {
        log.debug("Fetching task by id: {}", id);
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByStatus(@PathVariable String status) {
        log.debug("Fetching tasks by status: {}", status);
        TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
        List<TaskResponse> tasks = taskService.getTasksByStatus(taskStatus);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> searchTasks(@RequestParam String keyword) {
        log.debug("Searching tasks with keyword: {}", keyword);
        List<TaskResponse> tasks = taskService.searchTasks(keyword);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@RequestBody @Valid TaskRequest request) {
        log.info("Creating new task with title: {}", request.getTitle());
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Long id, @RequestBody @Valid TaskRequest request) {
        log.info("Updating task with id: {}", id);
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/bulk/update-status-and-order")
    public ResponseEntity<ApiResponse<Void>> updateTasksStatusAndOrder(
            @RequestBody List<TaskRequest> requests) {
        log.info("Bulk updating {} tasks", requests.size());
        for (TaskRequest request : requests) {
            if (request.getId() != null) {
                taskService.updateTask(request.getId(), request);
            }
        }
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        log.info("Deleting task with id: {}", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
