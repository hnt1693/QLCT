package com.nta.teabreakorder.service;

import com.nta.teabreakorder.model.auth.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService extends CommonService<User>{

    ResponseEntity changePassword(String password) throws Exception;

    ResponseEntity getInfo() throws Exception;

    ResponseEntity deletesUser(List<Long> ids) throws Exception;

    ResponseEntity getAll() throws Exception;

}
