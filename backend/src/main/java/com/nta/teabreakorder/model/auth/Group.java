package com.nta.teabreakorder.model.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SortComparator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "`groups`" )
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(value="key")
    private Long id;

    @Column(name = "name" )
    private String groupName;

    @Column(name = "regex", unique = true)
    private String regex;

    @Transient
    private List<User> users = new ArrayList<>();

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Transient
    private List<Long> userIds = new ArrayList<>();


    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinTable(name = "user_group",
            joinColumns = @JoinColumn(name = "group_id" ),
            inverseJoinColumns = @JoinColumn(name = "user_id" ))
    private List<User> userList = new ArrayList<>();


}
