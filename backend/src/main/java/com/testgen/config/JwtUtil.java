package com.testgen.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;
import java.util.function.BooleanSupplier;

@SuppressWarnings("unused")
@Component
public class JwtUtil 
{

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private Key key() 
    {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(UUID userId, String email) 
    {
        return Jwts.builder()
            .setSubject(userId.toString())
            .claim("email", email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(key())
            .compact();
    }

    public String getUserId(String token) 
    {
        return claims(token).getSubject();
    }

    public boolean isValid(String token) 
    {
        try { claims(token); return true; }
        catch (Exception e) { return false; }
    }

    private Claims claims(String token) 
    {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .setAllowedClockSkewSeconds(2)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) 
    {
    return claims(token).get("email", String.class);
    }

    public boolean validateToken(String token, String email) {
    try {
        Claims claims = claims(token);
        String tokenEmail = claims.get("email", String.class);
        return tokenEmail.equals(email) && !isExpired(claims);
        }
         catch (Exception e) 
         {
        return false;
        }
    }

    private boolean isExpired(Claims claims) 
    {
        return claims
                .getExpiration()
                .before(new Date());
    }

}

        