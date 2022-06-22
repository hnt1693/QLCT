package com.nta.teabreakorder.repository.common;

import com.nta.teabreakorder.model.common.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface FileRepository extends JpaRepository<File,Long> {

    @Transactional
    @Modifying
    void deleteAllByUrl(String url);
}
