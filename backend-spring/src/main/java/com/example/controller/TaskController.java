package com.example.controller;

import com.example.entity.Task;
import com.example.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable String status) {
        List<Task> tasks = taskRepository.findByStatusOrderByOrder(status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword) {
        List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase(keyword);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<Task>> getTasksByPriority(@PathVariable String priority) {
        List<Task> tasks = taskRepository.findByPriority(priority);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            if (taskDetails.getTitle() != null) {
                task.setTitle(taskDetails.getTitle());
            }
            if (taskDetails.getDescription() != null) {
                task.setDescription(taskDetails.getDescription());
            }
            if (taskDetails.getStatus() != null) {
                task.setStatus(taskDetails.getStatus());
            }
            if (taskDetails.getPriority() != null) {
                task.setPriority(taskDetails.getPriority());
            }
            Task updatedTask = taskRepository.save(task);
            return ResponseEntity.ok(updatedTask);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/bulk/update-status-and-order")
    public ResponseEntity<Void> updateTasksStatusAndOrder(@RequestBody List<Task> tasks) {
        for (Task taskDetails : tasks) {
            Optional<Task> optionalTask = taskRepository.findById(taskDetails.getId());
            if (optionalTask.isPresent()) {
                Task task = optionalTask.get();
                if (taskDetails.getStatus() != null) {
                    task.setStatus(taskDetails.getStatus());
                }
                if (taskDetails.getOrder() != null) {
                    task.setOrder(taskDetails.getOrder());
                }
                taskRepository.save(task);
            }
        }
        return ResponseEntity.ok().build();
    }
}
