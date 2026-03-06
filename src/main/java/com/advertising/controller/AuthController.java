package com.advertising.controller;

import com.advertising.common.Result;
import com.advertising.dto.LoginRequest;
import com.advertising.dto.LoginResponse;
import com.advertising.dto.RegisterRequest;
import com.advertising.entity.User;
import com.advertising.mapper.UserMapper;
import com.advertising.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userMapper.selectByUsername(loginRequest.getUsername());
            if (user == null) {
                return Result.error("用户不存在");
            }

            // 更新最后登录时间
            userMapper.updateLastLoginTime(user.getId());

            // 生成 JWT Token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

            // 构建响应
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                    user.getId(),
                    user.getUsername(),
                    user.getRealName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getAvatar(),
                    user.getRole()
            );

            LoginResponse response = new LoginResponse(
                    token,
                    jwtUtil.getExpiration(),
                    userInfo
            );

            return Result.success(response);

        } catch (BadCredentialsException e) {
            return Result.error(401, "用户名或密码错误");
        } catch (Exception e) {
            return Result.error("登录失败: " + e.getMessage());
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // 检查用户名是否已存在
        User existingUser = userMapper.selectByUsername(registerRequest.getUsername());
        if (existingUser != null) {
            return Result.error("用户名已存在");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRealName(registerRequest.getRealName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setRole(User.ROLE_USER);
        user.setStatus(User.STATUS_ENABLED);

        userMapper.insert(user);

        return Result.success("注册成功");
    }

    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/me")
    public Result<LoginResponse.UserInfo> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Result.error(401, "未登录");
        }

        String username = authentication.getName();
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRealName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatar(),
                user.getRole()
        );

        return Result.success(userInfo);
    }

    /**
     * 刷新 Token
     */
    @PostMapping("/refresh")
    public Result<LoginResponse> refreshToken(@RequestHeader("Authorization") String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return Result.error(401, "无效的Token");
        }

        String token = bearerToken.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return Result.error(401, "Token已过期或无效");
        }

        String username = jwtUtil.extractUsername(token);
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            return Result.error("用户不存在");
        }

        // 生成新的 Token
        String newToken = jwtUtil.generateToken(user.getUsername(), user.getRole());

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getRealName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatar(),
                user.getRole()
        );

        LoginResponse response = new LoginResponse(
                newToken,
                jwtUtil.getExpiration(),
                userInfo
        );

        return Result.success(response);
    }
}
