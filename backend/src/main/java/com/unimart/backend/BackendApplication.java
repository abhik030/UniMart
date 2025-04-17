package com.unimart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.unimart"})
@EntityScan(basePackages = {"com.unimart.Authentication.models", "com.unimart.backend.models"})
@EnableJpaRepositories(basePackages = {"com.unimart.Authentication.repositories", "com.unimart.backend.repositories"})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}