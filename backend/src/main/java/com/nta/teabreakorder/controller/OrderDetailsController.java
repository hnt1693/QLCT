package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.OrderDetail;
import com.nta.teabreakorder.model.User;
import com.nta.teabreakorder.repository.UserRepository;
import com.nta.teabreakorder.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nta.teabreakorder.security.jwt.JwtUtils;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpStatus;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/order-detail")
public class OrderDetailsController {
    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity getAll(@RequestParam(required = false) Integer page,
                                 @RequestParam(required = false) Integer pageSize,
                                 @RequestParam(required = false) String searchData,
                                 @RequestParam(required = false) String sortData) throws Exception {
        Pageable pageable = Pageable.ofValue(page, pageSize, searchData, sortData, null);
        return orderDetailService.get(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Long id) throws Exception {
        return orderDetailService.getById(id);
    }

    @GetMapping("/cart/{orderID}")
    public ResponseEntity getCart(@PathVariable Long orderID) throws Exception {
        return orderDetailService.getCartByOrderId(orderID);
    }

//    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
//    @PostMapping("")
//    public ResponseEntity<?> create(@RequestBody List<OrderDetail> orderDetail, HttpServletRequest request) throws Exception {
//        String token = null;
//        String headerAuth = request.getHeader("Authorization");
//
//        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
//            token = headerAuth.substring(7, headerAuth.length());
//        }
//        String username = jwtUtils.getUserNameFromJwtToken(token);
//        Optional<User> user = userRepository.findByUsername(username);
//        orderDetail.forEach((element) -> {
//            try {
//                element.getUser().setId(user.get().getId());
//                orderDetailService.create(element);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        });
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
    @PreAuthorize("isAuthenticated()")
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody OrderDetail orderDetail) throws Exception {
        return orderDetailService.create(orderDetail);
    }


    @PostMapping("/create-by-list")
    public ResponseEntity create(@RequestBody List<OrderDetail> orderDetailList) throws Exception {
        return orderDetailService.createByList(orderDetailList);
    }

    @PutMapping("")
    public ResponseEntity put(@RequestBody OrderDetail orderDetail) throws Exception {
        return orderDetailService.update(orderDetail);
    }

    @PutMapping("/list")
    public ResponseEntity put(@RequestBody List<OrderDetail> orderDetail) throws Exception {
        return orderDetailService.updateAll(orderDetail);
    }

    @DeleteMapping("")
    public ResponseEntity deletes(@RequestBody List<Long> ids) throws Exception {
        return orderDetailService.deletes(ids);
    }

    @GetMapping("/count-history")
    public ResponseEntity countHistory() throws Exception {
        return orderDetailService.getOrderDetailsHistory();
    }


}
