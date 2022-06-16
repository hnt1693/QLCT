package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.Order;
import com.nta.teabreakorder.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity getAll(@RequestParam(required = false) Integer page,
                                 @RequestParam(required = false) Integer pageSize,
                                 @RequestParam(required = false) String searchData,
                                 @RequestParam(required = false) String sortData) throws Exception {
        Pageable pageable = Pageable.ofValue(page, pageSize, searchData, sortData, null);
        return orderService.get(pageable);
    }
    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity getById(@PathVariable Long id) throws Exception {
        return orderService.getById(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("")
    public ResponseEntity create(@RequestBody Order order) throws Exception {
        return orderService.create(order);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("")
    public ResponseEntity put(@RequestBody Order order) throws Exception {
        return orderService.update(order);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("")
    public ResponseEntity deletes(@RequestBody List<Long> ids) throws Exception {
        return orderService.deletes(ids);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/totalBill")
    public ResponseEntity getTotalBill(@RequestParam String id ) throws Exception {
        return orderService.getTotalBill(id);
    }


}
