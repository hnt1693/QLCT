package com.nta.teabreakorder.controller;

import com.nta.teabreakorder.model.common.File;
import com.nta.teabreakorder.service.impl.FilesStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
public class FileController {

    public static String AVATAR = "avatars";


    @Autowired
    private FilesStorageServiceImpl filesStorageService;

    @PostMapping("/avatar")
    public ResponseEntity uploadAvatar(@RequestParam MultipartFile file) throws Exception {
        File resFile = filesStorageService.save(file, AVATAR);
        return ResponseEntity.ok(resFile);
    }

    @DeleteMapping("")
    public ResponseEntity deleteFile(@RequestParam String url) throws Exception {
        filesStorageService.delete(url);
        return ResponseEntity.ok(url);
    }

}
