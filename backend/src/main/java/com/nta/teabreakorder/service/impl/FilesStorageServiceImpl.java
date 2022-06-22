package com.nta.teabreakorder.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside;
import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.repository.common.FileRepository;
import com.nta.teabreakorder.service.CommonService;
import com.nta.teabreakorder.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FilesStorageServiceImpl implements FileService {

    public static final String PATH = "uploads/";

    @Autowired
    private FileRepository fileRepository;

    public void init(String fileType) {
        try {
            final Path root = Paths.get(fileType);
            if (!Files.isDirectory(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public com.nta.teabreakorder.model.common.File save(MultipartFile file, String fileType) {
        try {
            init(PATH + fileType);
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            long date = new Date().getTime();
            String fileName = String.format("%s/%s_%s_%s", PATH + fileType, username, date, Objects.requireNonNull(file.getOriginalFilename()).replaceAll(" ", ""));
            Files.copy(file.getInputStream(), Path.of(fileName));
            com.nta.teabreakorder.model.common.File resFile = new com.nta.teabreakorder.model.common.File(0L, file.getName(), file.getSize(), file.getContentType(), fileName);
            fileRepository.save(resFile);
            return resFile;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }


//    public Resource load(String filename) {
//        try {
//            Path file = root.resolve(filename);
//            Resource resource = new UrlResource(file.toUri());
//            if (resource.exists() || resource.isReadable()) {
//                return resource;
//            } else {
//                throw new RuntimeException("Could not read the file!");
//            }
//        } catch (MalformedURLException e) {
//            throw new RuntimeException("Error: " + e.getMessage());
//        }
//    }
//
//    public void deleteAll() {
//        FileSystemUtils.deleteRecursively(root.toFile());
//    }
//
//    public Stream<Path> loadAll() {
//        try {
//            return Files.walk(this.root, 1).filter(path -> !path.equals(this.root)).map(this.root::relativize);
//        } catch (IOException e) {
//            throw new RuntimeException("Could not load the files!");
//        }
//    }

    public void delete(String oldImg) {
        try {
            File file = new File(oldImg);
            file.delete();
            fileRepository.deleteAllByUrl(oldImg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public ResponseEntity get(Pageable pageable) throws Exception {
        return null;
    }

    @Override
    public ResponseEntity getById(Long id) throws Exception {
        return CommonUtil.createResponseEntityOK(fileRepository.findById(id));
    }

    @Override
    public ResponseEntity create(com.nta.teabreakorder.model.common.File file) throws Exception {
        return null;
    }

    @Override
    public ResponseEntity update(com.nta.teabreakorder.model.common.File file) throws Exception {
        return CommonUtil.createResponseEntityOK(fileRepository.save(file));
    }

    @Override
    public ResponseEntity deletes(List<Long> ids) throws Exception {
        return null;
    }
}