package com.nta.teabreakorder.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Configuration
@PropertySource("classpath:error.properties")
public class ConfigHelper {
    @Autowired
    private Environment env;

    public String getValue(String key) {
        return env.getProperty(key);
    }

    public String getValue(String key, String defaultValue) {
        return env.getProperty(key, defaultValue);
    }
}
