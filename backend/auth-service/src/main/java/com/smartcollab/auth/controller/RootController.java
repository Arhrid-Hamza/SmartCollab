package com.smartcollab.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "EMSICollab Auth Service",
                "port", 8081,
                "version", "1.0.0",
                "message", "EMSICollab Backend is running successfully!",
                "frontendUrl", "http://localhost:5173",
                "skillsEndpoint", "/api/v1/skills",
                "authEndpoint", "/api/v1/auth/login"
        ));
    }
}
