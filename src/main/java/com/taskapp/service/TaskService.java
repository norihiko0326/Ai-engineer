package com.taskapp.service;

import com.taskapp.model.Task;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TaskService {
    private final Map<String, Task> tasks = new HashMap<>();

    public TaskService() {
        // サンプルデータを初期化
        Task task1 = new Task("サンプルタスク1", "todo");
        Task task2 = new Task("サンプルタスク2", "inprogress");
        Task task3 = new Task("サンプルタスク3", "done");

        tasks.put(task1.getId(), task1);
        tasks.put(task2.getId(), task2);
        tasks.put(task3.getId(), task3);
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks.values());
    }

    public Task getTaskById(String id) {
        return tasks.get(id);
    }

    public Task createTask(String title) {
        Task task = new Task(title, "todo");
        tasks.put(task.getId(), task);
        return task;
    }

    public Task updateTask(String id, String status) {
        Task task = tasks.get(id);
        if (task != null) {
            task.setStatus(status);
        }
        return task;
    }

    public boolean deleteTask(String id) {
        return tasks.remove(id) != null;
    }
}
