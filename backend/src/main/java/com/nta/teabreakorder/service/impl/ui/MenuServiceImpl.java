package com.nta.teabreakorder.service.impl.ui;

import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.ui.Menu;
import com.nta.teabreakorder.repository.ui.MenuRepository;
import com.nta.teabreakorder.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuServiceImpl implements MenuService {
    @Autowired
    private MenuRepository menuRepository;

    @Override
    public ResponseEntity get(Pageable pageable) throws Exception {
        return CommonUtil.createResponseEntityOK(menuRepository.findAllByParentIdIsNull());
    }

    @Override
    public ResponseEntity getById(Long id) throws Exception {
        return CommonUtil.createResponseEntityOK(menuRepository.findById(id));
    }

    @Override
    public ResponseEntity create(Menu menu) throws Exception {
        return CommonUtil.createResponseEntityOK(menuRepository.save(menu));
    }

    @Override
    public ResponseEntity update(Menu menu) throws Exception {
        return CommonUtil.createResponseEntityOK(menuRepository.save(menu));
    }

    @Override
    public ResponseEntity deletes(List<Long> ids) throws Exception {
        menuRepository.deleteAllById(ids);
        return CommonUtil.createResponseEntityOK(1);
    }
}
