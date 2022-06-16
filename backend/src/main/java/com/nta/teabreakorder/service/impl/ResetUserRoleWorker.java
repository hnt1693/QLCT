//package com.nta.teabreakorder.service.impl;
//
//import com.nta.teabreakorder.model.ERole;
//import com.nta.teabreakorder.model.User;
//import com.nta.teabreakorder.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
//import java.util.Date;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class ResetUserRoleWorker {
//    @Autowired
//    private UserRepository userRepository;
//
//    private final String ADMIN_USERNAME = "admin";
//
//
//    @Scheduled(cron = "15 * * * * ?")
//    public void scheduleTaskWithCronExpression() {
//        List<User> applyList = userRepository.getUserByExpiredTimeRoleAndIsNotAdminName(new Date(),ADMIN_USERNAME);
//        applyList.forEach(user -> {
//            user.setRoles(user.getRoles().stream().filter(role -> !role.getName().equals(ERole.ROLE_ADMIN)).collect(Collectors.toSet()));
//            user.setExpiredTimeAdminRole(null);
//        });
//        userRepository.saveAll(applyList);
//        System.out.println("==================RESET ROLE FINISH====================");
//
//    }
//
//
//}
