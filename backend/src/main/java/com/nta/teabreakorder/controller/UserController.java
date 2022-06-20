package com.nta.teabreakorder.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.payload.request.UserLoginRequest;
import com.nta.teabreakorder.security.jwt.JwtUtils;
import com.nta.teabreakorder.service.UserService;
import com.nta.teabreakorder.service.impl.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import com.nta.teabreakorder.exception.ResourceNotFoundException;
import com.nta.teabreakorder.model.auth.User;
import com.nta.teabreakorder.repository.auth.UserRepository;

import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import java.util.stream.Collectors;

import com.nta.teabreakorder.payload.request.UpdateUserRequest;

import org.springframework.security.crypto.password.PasswordEncoder;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FilesStorageServiceImpl filesStorageService;

    @Autowired
    PasswordEncoder encoder;


    @GetMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity getAllEmployees(@RequestParam(required = false) Integer page,
                                                               @RequestParam(required = false) Integer pageSize,
                                                               @RequestParam(required = false) String searchData,
                                                               @RequestParam(required = false) String sortData) throws Exception  {

        com.nta.teabreakorder.common.Pageable pageable = Pageable.ofValue(page, pageSize, searchData, sortData, null);
        return userService.get(pageable);
    }


    @GetMapping("/all")
    public ResponseEntity getAll()
            throws Exception {
        return userService.getAll();
    }



    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity getUserById(@PathVariable Long id)
            throws Exception {
       return userService.getById(id);
    }

    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUser(@Valid @RequestBody User user) throws Exception {
        return userService.update(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable(value = "id") Long userId,
                                           @Valid @RequestBody User userDetails) throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userId));
        user.setEmail(userDetails.getEmail());
        final User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, Boolean> deleteUser(@PathVariable(value = "id") Long userId)
            throws ResourceNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userId));

        userRepository.delete(user);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }

    @PatchMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity changePassword(@RequestBody UpdateUserRequest updateUserRequest) throws Exception {
        return userService.changePassword(updateUserRequest.getPassword());
    }


    @GetMapping("/info")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getInfo()
            throws Exception {
        return userService.getInfo();
    }




    @DeleteMapping("")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deletes(@RequestBody List<Long> ids) throws Exception {
        return userService.deletesUser(ids);
    }
}
