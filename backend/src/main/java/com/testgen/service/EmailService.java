package com.testgen.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String name, String token) {
        String link = baseUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your TestGen AI account");
        message.setText(
            "Hi " + name + ",\n\n" +
            "Thanks for signing up for TestGen AI.\n\n" +
            "Click the link below to verify your email:\n\n" +
            link + "\n\n" +
            "This link expires in 24 hours.\n\n" +
            "If you did not create this account, ignore this email.\n\n" +
            "— TestGen AI"
        );

        mailSender.send(message);
    }
}