package com.touhuwai.mapper;

import com.touhuwai.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 用户数据访问层
 * SQL映射配置在 UserMapper.xml 中
 */
@Mapper
public interface UserMapper {

    /**
     * 根据ID查询用户
     */
    User selectById(Long id);

    /**
     * 根据用户名查询用户
     */
    User selectByUsername(String username);

    /**
     * 查询所有有效用户
     */
    List<User> selectAll();

    /**
     * 新增用户
     */
    int insert(User user);

    /**
     * 更新用户信息
     */
    int update(User user);

    /**
     * 更新密码
     */
    int updatePassword(@Param("id") Long id, @Param("password") String password);

    /**
     * 更新最后登录时间
     */
    int updateLastLoginTime(Long id);

    /**
     * 删除用户
     */
    int deleteById(Long id);

    /**
     * 根据条件查询用户列表
     */
    List<User> selectByParam(Map<String, Object> param);

    /**
     * 根据条件统计用户数量
     */
    Long countByParam(Map<String, Object> param);
}
