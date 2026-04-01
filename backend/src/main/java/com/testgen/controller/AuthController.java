package com.testgen.controller;

import com.testgen.config.JwtUtil;
import com.testgen.entity.User;
import com.testgen.repository.UserRepository;
import com.testgen.service.EmailService;
import com.testgen.dto.req.RegisterRequest;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailService emailService
    ) 
    {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) 
    {
        String email = req.getEmail();
        String password = req.getPassword();
    
        String name = (req.getName() != null && !req.getName().isBlank())
                ? req.getName()
                : email.split("@")[0];

        if (userRepository.findByEmail(email).isPresent()) 
            {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists"));
        }

        if (password.length() < 6) 
            {
            return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPlan("free");
        user.setEmailVerified(false);

        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);

        userRepository.save(user);

        try {
            emailService.sendVerificationEmail(email, name, verificationToken);
        } catch (Exception e) 
        {
            System.err.println("Failed to send verification email to " + email + ": " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of(
                "message", "Account created. Please check your email to verify your account.",
                "email", email
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) 
    {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) 
            {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<User> found = userRepository.findByEmail(email);
        if (found.isEmpty()) 
            {
            return ResponseEntity.status(401).body(Map.of("message", "No account found with that email"));
        }

        User user = found.get();

        if (!passwordEncoder.matches(password, user.getPasswordHash())) 
            {
            return ResponseEntity.status(401).body(Map.of("message", "Incorrect password"));
        }

        if (!Boolean.TRUE.equals(user.getEmailVerified())) 
            {
            return ResponseEntity.status(403).body(Map.of(
                    "message", "Please verify your email before logging in.",
                    "needsVerification", true
            ));
        }

        String token = jwtUtil.generate(user.getId(), email);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "name", user.getName() != null ? user.getName() : email.split("@")[0],
                        "email", user.getEmail(),
                        "plan", user.getPlan() != null ? user.getPlan() : "free"
                )
        ));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) 
    {
        Optional<User> found = userRepository.findByVerificationToken(token);

        if (found.isEmpty()) 
            {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired verification link"));
        }

        User user = found.get();
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Email verified. You can now log in."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) 
    {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) 
            {
            return ResponseEntity.status(401).body(Map.of("message", "Missing token"));
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isValid(token)) 
            {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
        }

        String userId = jwtUtil.getUserId(token);
        try {
            Optional<User> found = userRepository.findById(UUID.fromString(userId));
            if (found.isEmpty()) 
                {
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }
            User user = found.get();
            return ResponseEntity.ok(Map.of(
                    "name", user.getName() != null ? user.getName() : user.getEmail().split("@")[0],
                    "email", user.getEmail(),
                    "plan", user.getPlan() != null ? user.getPlan() : "free"
            ));
        } catch (IllegalArgumentException e) 
        {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }
    }
}