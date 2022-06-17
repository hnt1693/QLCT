package com.nta.teabreakorder.repository.auth;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.nta.teabreakorder.model.auth.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    @Query(value = "SELECT u From User u WHERE  u.username LIKE %:keyword% OR u.email LIKE %:keyword%")
    Page<User> searchUser(@Param("keyword") String keyword, Pageable pageable);


    @Modifying
    @Transactional
    @Query(value = "update User u set u.isDeleted = true where u.id in :ids")
    void deletes(@Param("ids") List<Long> ids);

    @Query(value = "select * from users u inner join user_group ug on u.id = ug.user_id\n" +
            "where ug.group_id = :id", nativeQuery = true)
    List<User> getUsersByGroupId(@Param("id") Long id);
}
