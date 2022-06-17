package com.nta.teabreakorder.model.ui;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nta.teabreakorder.common.CommonUtil;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
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
    private List<String> roles;

    @Column(name = "roles")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String roleString;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true)
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private Menu parentId;

    @OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)
    @JoinColumn(name = "parent_id", referencedColumnName = "id")
    private List<Menu> child;

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

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
        try {
            this.roleString = CommonUtil.getObjectMapper().writeValueAsString(roles);
        } catch (Exception e) {
            this.roleString = null;
        }

    }

    public String getRoleString() {

        return roleString;
    }

    public void setRoleString(String roleString) {
        try {
            this.roles = CommonUtil.getObjectMapper().readValue(roleString, List.class);
        } catch (Exception e) {
            this.roles = new ArrayList<>();
        }
        this.roleString = roleString;
    }

    public Menu getParentId() {
        return parentId;
    }

    public void setParentId(Menu parentId) {
        this.parentId = parentId;
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
}
