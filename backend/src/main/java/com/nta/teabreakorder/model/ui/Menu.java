package com.nta.teabreakorder.model.ui;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mysql.cj.xdevapi.Collection;
import com.nta.teabreakorder.common.CommonUtil;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "menu")
@AllArgsConstructor
@NoArgsConstructor
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(value = "key")
    private Long id;

    private String path;

    private String icon;

    private String title;

    @Transient
    private List<String> roles = new ArrayList<>();

    @JsonIgnore
    @Column(name = "roles")
    private String roleString;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private Menu parentMenu;

    @JsonProperty(value = "children")
    @OneToMany(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private List<Menu> child;

    private boolean activated;

    private int sort;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getRoleString() {
        try {
            this.roles = CommonUtil.getObjectMapper().readValue(roleString, List.class);
        } catch (Exception e) {
            this.roles = new ArrayList<>();
        }
        return roleString;
    }

    public void setRoleString(String roleString) {
        this.roleString = roleString;
    }

    public Menu getParentMenu() {
        return parentMenu;
    }

    public void setParentMenu(Menu parentMenu) {
        this.parentMenu = parentMenu;
    }

    public List<Menu> getChild() {
        return child;
    }

    public void setChild(List<Menu> child) {
        this.child = child;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<String> getRoles() {
        try {
            return CommonUtil.getObjectMapper().readValue(roleString, List.class);
        } catch (Exception e) {
            this.roles = new ArrayList<>();
        }
        return  Collections.emptyList();
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
        try {
            this.roleString = CommonUtil.getObjectMapper().writeValueAsString(roles);
        } catch (Exception e) {
            this.roleString = null;
        }

    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }
}
