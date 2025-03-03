package com.unimart.backend.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String testEndpoint() {
        return "API is working!";
    }
}
