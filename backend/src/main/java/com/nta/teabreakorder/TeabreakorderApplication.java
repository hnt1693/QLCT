package com.nta.teabreakorder;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;


@SpringBootApplication
public class TeabreakorderApplication extends SpringBootServletInitializer implements CommandLineRunner {


//    @Autowired
//    private RoleRepository roleRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(TeabreakorderApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {

//        try {
//
//            Role adminRole = new Role(ERole.ROLE_ADMIN);
//            Role userRole = new Role(ERole.ROLE_USER);
//            Set<Role> roles = new HashSet<>();
//            roles.add(adminRole);
//            roles.add(userRole);
//            roleRepository.saveAll(roles);
//
//            User user = new User("admin", "admin@gmail.com", passwordEncoder.encode("123123123"));
//            user.setRoles(roles);
//            userRepository.save(user);
//        } catch (Exception e) {
//
//        }


    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(TeabreakorderApplication.class);
    }
}
