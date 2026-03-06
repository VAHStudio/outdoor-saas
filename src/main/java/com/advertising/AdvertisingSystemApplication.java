package com.advertising;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 广告投放管理系统启动类
 */
@SpringBootApplication
@MapperScan({"com.advertising.mapper", "com.advertising.agent.mapper"})
public class AdvertisingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdvertisingSystemApplication.class, args);
    }
}
