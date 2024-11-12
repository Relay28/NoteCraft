package com.jabi.notecraft.util;

import java.util.Date;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;
    		
    // Store revoked tokens (in a production setup, this should be in a database)
    private Set<String> tokenBlacklist = new HashSet<>();

    public String generateJwtToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, Base64.getEncoder().encodeToString(jwtSecret.getBytes()))
                .compact();
    }

    // Extract JWT token from Authorization header
    public String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // Validate the JWT token
    public boolean validateJwtToken(String token) {
        if (tokenBlacklist.contains(token)) {
            return false; // Token is revoked
        }
        try {
            Jwts.parser()
                .setSigningKey(Base64.getEncoder().encodeToString(jwtSecret.getBytes()))
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }

    // Revoke the JWT token by adding it to the blacklist
    public boolean revokeJwtToken(String token) {
        return tokenBlacklist.add(token); // Returns true if added successfully, false if it was already present
    }
}
