package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.auth.Group;
import com.nta.teabreakorder.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;


    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity getAll(@RequestParam(required = false) Integer page,
                                 @RequestParam(required = false) Integer pageSize,
                                 @RequestParam(required = false) String searchData,
                                 @RequestParam(required = false) String sortData) throws Exception {
        Pageable pageable = Pageable.ofValue(page, pageSize, searchData, sortData, null);
        return groupService.get(pageable);
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/all")
    public ResponseEntity getAllNoPagination() throws Exception {
        return groupService.getAll();
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity findById(@PathVariable Long id) throws Exception {
        return groupService.getById(id);
    }

    @PreAuthorize("permitAll()")
    @PostMapping("")
    public ResponseEntity create(@RequestBody Group group) throws Exception {
        return groupService.create(group);
    }

    @PreAuthorize("permitAll()")
    @PutMapping("")
    public ResponseEntity update(@RequestBody Group group) throws Exception {
        return groupService.update(group);
    }

    @PreAuthorize("permitAll()")
    @DeleteMapping("")
    public ResponseEntity deletes(@RequestBody List<Long> ids) throws Exception {
        return groupService.deletes(ids);
    }
}
