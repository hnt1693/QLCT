package com.nta.teabreakorder.service;

import com.nta.teabreakorder.model.auth.Group;
import org.springframework.http.ResponseEntity;

public interface GroupService extends CommonService <Group>{
    ResponseEntity getAll();
}
