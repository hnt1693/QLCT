package com.nta.teabreakorder.service;

import com.nta.teabreakorder.payload.request.UserRegisterRequest;
import com.nta.teabreakorder.payload.request.UserLoginRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity registerNewUser(UserRegisterRequest userRequest) throws Exception;

    ResponseEntity login(UserLoginRequest userRequest);
}
