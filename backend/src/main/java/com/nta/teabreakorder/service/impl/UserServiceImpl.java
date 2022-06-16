package com.nta.teabreakorder.service.impl;

import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.model.auth.User;
import com.nta.teabreakorder.payload.response.JwtResponse;
import com.nta.teabreakorder.repository.auth.UserRepository;
import com.nta.teabreakorder.security.jwt.JwtUtils;
import com.nta.teabreakorder.security.service.UserDetailsImpl;
import com.nta.teabreakorder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public ResponseEntity changePassword(String password) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new Exception("User not found"));
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return CommonUtil.createResponseEntityOK(1);
    }

    @Override
    public ResponseEntity getInfo() throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByUsername(authentication.getName()).orElseThrow(() -> new Exception("User not found"));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                roles, user.getFullName(), user.getImg()));
    }

    @Override
    public ResponseEntity deletesUser(List<Long> ids) throws Exception {
        userRepository.deletes(ids);
        return CommonUtil.createResponseEntityOK(1);
    }
}
