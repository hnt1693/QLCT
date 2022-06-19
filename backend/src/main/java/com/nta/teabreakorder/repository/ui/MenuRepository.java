package com.nta.teabreakorder.repository.ui;

import com.nta.teabreakorder.model.ui.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findAllByParentMenuIsNullOrderBySort();
}
