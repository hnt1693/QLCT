package com.nta.teabreakorder.service.impl.auth;

import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.auth.Group;
import com.nta.teabreakorder.model.auth.User;
import com.nta.teabreakorder.repository.auth.GroupRepository;
import com.nta.teabreakorder.repository.auth.UserRepository;
import com.nta.teabreakorder.repository.dao.GroupDao;
import com.nta.teabreakorder.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupDao groupDao;

    @Override
    public ResponseEntity get(Pageable pageable) throws Exception {
        return CommonUtil.createResponseEntityOK(groupDao.get(pageable));
    }

    @Override
    public ResponseEntity getById(Long id) throws Exception {
        Group group = groupRepository.findById(id).orElse(null);
        List<User> users = userRepository.getUsersByGroupId(id);
        users.forEach(user -> user.setGroups(null));
        group.setUsers(users);
        return CommonUtil.createResponseEntityOK(group);
    }

    @Override
    public ResponseEntity create(Group group) throws Exception {
        List<User> users = userRepository.findAllById(group.getUserIds());
        group.setUserList(users);
        return CommonUtil.createResponseEntityOK(groupRepository.save(group));
    }

    @Override
    public ResponseEntity update(Group group) throws Exception {
        List<User> users = userRepository.findAllById(group.getUserIds());
        group.setUserList(users);
        return CommonUtil.createResponseEntityOK(groupRepository.save(group));
    }

    @Override
    public ResponseEntity deletes(List<Long> ids) throws Exception {
        groupRepository.deleteAllById(ids);
        return CommonUtil.createResponseEntityOK(true);
    }

    @Override
    public ResponseEntity getAll() {
        return CommonUtil.createResponseEntityOK(groupRepository.findAll());
    }
}
