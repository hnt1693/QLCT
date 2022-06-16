package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.service.impl.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file/avatar")
public class FileController {

    @Autowired
    private FilesStorageServiceImpl filesStorageService;

    @PostMapping("")
    public ResponseEntity uploadAvatar(@RequestParam MultipartFile file) throws Exception {
        String url = filesStorageService.save(file);
        return ResponseEntity.ok(url);
    }

}
