package com.testgen.websocket;

import com.testgen.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WsAuthInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        var accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) return message;

        if (!StompCommand.CONNECT.equals(accessor.getCommand())) return message;

        List<String> authHeaders = accessor.getNativeHeader("Authorization");
        if (authHeaders == null || authHeaders.isEmpty())
            throw new IllegalArgumentException("WebSocket CONNECT requires Authorization header");

        String token = authHeaders.get(0).replace("Bearer ", "").trim();
        if (!jwtUtil.isValid(token))
            throw new IllegalArgumentException("Invalid JWT in WebSocket CONNECT");

        var auth = new UsernamePasswordAuthenticationToken(
            jwtUtil.getUserId(token), null, List.of()
        );
        accessor.setUser(auth);
        return message;
    }
}