package com.touhuwai.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * API Key 认证过滤器
 * 支持通过 X-API-Key Header 进行认证，用于 Dify 等外部工具调用
 */
@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    @Value("${api.key:}")
    private String apiKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        // 如果已经通过 JWT 认证，跳过
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 从请求头获取 API Key
        String requestApiKey = request.getHeader("X-API-Key");
        
        if (requestApiKey != null && !requestApiKey.isEmpty()) {
            if (validateApiKey(requestApiKey)) {
                // 创建认证令牌
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        "api-user",
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // API Key 无效
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":401,\"message\":\"Invalid API Key\",\"data\":null}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 验证 API Key
     */
    private boolean validateApiKey(String requestApiKey) {
        if (apiKey == null || apiKey.isEmpty()) {
            return false;
        }
        return apiKey.equals(requestApiKey);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // 登录和认证相关接口不需要 API Key 认证
        return path.startsWith("/api/auth/");
    }
}
