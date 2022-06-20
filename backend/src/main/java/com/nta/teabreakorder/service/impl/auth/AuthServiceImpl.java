package com.nta.teabreakorder.service.impl.auth;

import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.model.auth.Group;
import com.nta.teabreakorder.model.auth.User;
import com.nta.teabreakorder.payload.request.UserLoginRequest;
import com.nta.teabreakorder.payload.request.UserRegisterRequest;
import com.nta.teabreakorder.repository.auth.GroupRepository;
import com.nta.teabreakorder.repository.auth.UserRepository;
import com.nta.teabreakorder.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public ResponseEntity registerNewUser(UserRegisterRequest userRequest) throws Exception {

        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setUsername(userRequest.getUsername());
        user.setFullName(userRequest.getFullName());
        if (userRequest.getGroups() != null && !userRequest.getGroups().isEmpty()) {
            List<Long> ids = new ArrayList<>();
            userRequest.getGroups().forEach(ob -> {
                ids.add(ob.getId());
            });
            List<Group> groups = groupRepository.findAllById(ids);
            user.setGroups(groups);
        }

        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        userRepository.save(user);
        return CommonUtil.createResponseEntityOK(user);
    }

    @Override
    public ResponseEntity login(UserLoginRequest userRequest) {
        return null;
    }
}
