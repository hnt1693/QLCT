package com.nta.teabreakorder.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.nta.teabreakorder.service.AuthService;
import com.nta.teabreakorder.service.impl.GmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.nta.teabreakorder.payload.request.LoginRequest;
import com.nta.teabreakorder.payload.request.UserRegisterRequest;
import com.nta.teabreakorder.payload.response.JwtResponse;
import com.nta.teabreakorder.repository.auth.UserRepository;
import com.nta.teabreakorder.security.jwt.JwtUtils;
import com.nta.teabreakorder.security.service.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth" )
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private GmailService gmailService;

    @PostMapping("/signin" )
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles, userDetails.getFullName(), userDetails.getImg()));
    }

    @PostMapping("/signup" )
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterRequest signUpRequest) throws Exception {
        return authService.registerNewUser(signUpRequest);
    }

    @GetMapping("/forgot-password" )
    public ResponseEntity forgotPassword(@RequestParam String username) throws Exception {
        return ResponseEntity.ok(gmailService.resetEmail(username));
    }
}
