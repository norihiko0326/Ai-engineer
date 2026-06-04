package com.taskapp.repository;

import com.taskapp.entity.Task;
import com.taskapp.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(Integer priority);
    List<Task> findByStatusAndPriority(TaskStatus status, Integer priority);

    @Query("SELECT t FROM Task t ORDER BY t.createdAt DESC")
    List<Task> findAllOrderByCreatedAtDesc();

    @Query("SELECT t FROM Task t WHERE t.status = ?1 ORDER BY t.priority ASC")
    List<Task> findByStatusOrderByPriority(TaskStatus status);

    @Query("SELECT t FROM Task t WHERE t.status = ?1 ORDER BY t.order ASC")
    List<Task> findByStatusOrderByOrder(TaskStatus status);

    List<Task> findByTitleContainingIgnoreCase(String keyword);
}
