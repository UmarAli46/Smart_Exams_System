package com.examsystem.admin;

import com.examsystem.admin.dto.UpsertUserRequest;
import com.examsystem.subject.Subject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;



    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getStudents(search, status));
    }

    @PostMapping("/students")
    public ResponseEntity<?> upsertStudent(@RequestBody UpsertUserRequest request) {
        return ResponseEntity.ok(adminService.upsertStudent(request));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/teachers")
    public ResponseEntity<?> getTeachers(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getTeachers(search));
    }

    @PostMapping("/teachers")
    public ResponseEntity<?> upsertTeacher(@RequestBody UpsertUserRequest request) {
        return ResponseEntity.ok(adminService.upsertTeacher(request));
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        adminService.deleteTeacher(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects() {
        return ResponseEntity.ok(adminService.getSubjects());
    }

    @PostMapping("/subjects")
    public ResponseEntity<?> upsertSubject(@RequestBody Subject request) {
        return ResponseEntity.ok(adminService.upsertSubject(request));
    }

    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        adminService.deleteSubject(id);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
