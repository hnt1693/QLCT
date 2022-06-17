package com.nta.teabreakorder.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

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
import org.springframework.data.domain.Pageable;
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
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Map<String, Object>> getAllEmployees(@RequestParam(required = false) String username, @RequestParam(value = "page", defaultValue = "0", required = false) int page, @RequestParam(value = "size", defaultValue = "5", required = false) int size) {
        try {
            List<User> users = new ArrayList<User>();
            Pageable paging = PageRequest.of(page, size);

            Page<User> pageUsers;
            if (username == null) {
                pageUsers = userRepository.findAll(paging);
            } else {
                pageUsers = userRepository.searchUser(username, paging);
            }
            users = pageUsers.getContent().stream().filter(user -> !user.isDeleted()).collect(Collectors.toList());;
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("currentPage", pageUsers.getNumber());
            response.put("totalItems", pageUsers.getTotalElements());
            response.put("totalPages", pageUsers.getTotalPages());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/all")
    public ResponseEntity getAll()
            throws Exception {
        return userService.getAll();
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(HttpServletRequest request)
            throws ResourceNotFoundException {
        String token = null;
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            token = headerAuth.substring(7, headerAuth.length());
        }
        String username = jwtUtils.getUserNameFromJwtToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok().body(user);
    }

    @PutMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> updateUser(@Valid @RequestBody UserLoginRequest userDetails) throws Exception {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this id :: " + userDetails.getId()));
        String oldImg = user.getImg();
        user.setEmail(userDetails.getEmail());
        user.setFullName(userDetails.getFullName());
        user.setImg(userDetails.getImg());

        userRepository.save(user);
        if (oldImg != null && !oldImg.equals(userDetails.getImg())) {
            filesStorageService.delete(oldImg);
        }
        return userService.getInfo();
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
