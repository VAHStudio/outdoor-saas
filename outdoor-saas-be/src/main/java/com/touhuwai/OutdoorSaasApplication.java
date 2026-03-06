package com.touhuwai;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 广告投放管理系统启动类
 */
@SpringBootApplication
@MapperScan({"com.touhuwai.mapper"})
public class OutdoorSaasApplication {

    public static void main(String[] args) {
        SpringApplication.run(OutdoorSaasApplication.class, args);
    }
}
