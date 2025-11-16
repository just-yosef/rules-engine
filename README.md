# Rules Engine Project

A **secure, modular, and production-ready backend** built with **NestJS**, MongoDB, and Redis.  
This project implements authentication, authorization, caching, rate limiting, event-driven actions, and request validation, following best practices for clean architecture and scalability.

---

## Features

### 🔐 Authentication & Security
- JWT-based authentication with **refresh tokens**
- Signup and Signin with **password hashing**
- Single-session enforcement (user can stay logged in from only one device)
- IP-based login protection (suspend account if login from a new IP until re-verification)
- OTP email verification on signup
- Route guards & interceptors to protect sensitive routes
- Password fields excluded from API responses
- Protection against brute-force attacks (block after multiple failed logins)

### ⚡ Performance & Caching
- Redis caching for important routes
- Middleware for caching and data retrieval
- Global and route-specific rate limiting to prevent spam or abuse
- Protection for event-related routes

### 📨 Event-driven Actions & Notifications
- Trigger actions after user signup/signin
- Email notifications for verification, alerts, or password resets
- Enhanced auth controller with event-driven behavior

### 🧭 Validation & DTOs
- Custom decorators to validate eventName matches the service
- DTO-based request validation for incoming data
- Improved request validation pipeline for all operations

### 🛠️ Architecture & Code Quality
- Modular architecture with reusable services and controllers
- Auth module separated for maintainability
- Refactored middleware and rate limiter for cleaner code
- Fully integrated MongoDB with Mongoose
- Rules Engine module with controller and service

---

## Tech Stack

- **Backend Framework:** NestJS  
- **Database:** MongoDB (Mongoose)  
- **Caching:** Redis  
- **Authentication:** JWT, Cookies  
- **Email Service:** Nodemailer (OTP & notifications)  

