package com.unimart.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SimpleTestController {
    
    @GetMapping("/simple-test")
    public String test() {
        return "Simple test controller is working!";
    }
} 