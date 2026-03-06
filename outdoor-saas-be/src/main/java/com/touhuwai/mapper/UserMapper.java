package com.touhuwai.mapper;

import com.touhuwai.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用户数据访问层
 */
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE id = #{id}")
    User selectById(Long id);

    @Select("SELECT * FROM users WHERE username = #{username}")
    User selectByUsername(String username);

    @Select("SELECT * FROM users WHERE status = 1")
    List<User> selectAll();

    @Insert("INSERT INTO users (username, password, real_name, email, phone, avatar, role, status) " +
            "VALUES (#{username}, #{password}, #{realName}, #{email}, #{phone}, #{avatar}, #{role}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(User user);

    @Update("UPDATE users SET real_name = #{realName}, email = #{email}, phone = #{phone}, " +
            "avatar = #{avatar}, role = #{role}, status = #{status} WHERE id = #{id}")
    int update(User user);

    @Update("UPDATE users SET password = #{password} WHERE id = #{id}")
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    @Update("UPDATE users SET last_login_at = NOW() WHERE id = #{id}")
    int updateLastLoginTime(Long id);

    @Delete("DELETE FROM users WHERE id = #{id}")
    int deleteById(Long id);
}
