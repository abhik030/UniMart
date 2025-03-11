@echo off
cd backend
call mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=test" 