package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.ui.Menu;
import com.nta.teabreakorder.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("ui/menus")
@RestController
public class MenuController {
    @Autowired
    private MenuService menuService;


    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity getAll(@RequestParam(required = false) Integer page,
                                 @RequestParam(required = false) Integer pageSize,
                                 @RequestParam(required = false) String searchData,
                                 @RequestParam(required = false) String sortData) throws Exception {
        Pageable pageable = Pageable.ofValue(page, pageSize, searchData, sortData, null);
        return menuService.get(pageable);
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{id}")
    public ResponseEntity findById(@PathVariable Long id) throws Exception {
        return menuService.getById(id);
    }

    @PreAuthorize("permitAll()")
    @PostMapping("")
    public ResponseEntity create(@RequestBody Menu menu) throws Exception {
        return menuService.create(menu);
    }

    @PreAuthorize("permitAll()")
    @PutMapping("")
    public ResponseEntity update(@RequestBody Menu menu) throws Exception {
        return menuService.update(menu);
    }

    @PreAuthorize("permitAll()")
    @DeleteMapping("")
    public ResponseEntity deletes(@RequestBody List<Long> ids) throws Exception {
        return menuService.deletes(ids);
    }
}
