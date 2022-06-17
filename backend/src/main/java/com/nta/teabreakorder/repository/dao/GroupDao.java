package com.nta.teabreakorder.repository.dao;

import com.nta.teabreakorder.common.DaoUtils;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.auth.Group;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class GroupDao implements CommonDao<Group> {

    @Autowired
    private EntityManager entityManager;

    @Override
    public Map<String, Object> get(Pageable pageable) {
        Map<String, Object> resMap = new HashMap<>();

        StringBuilder sql = new StringBuilder();
        Map<String, String> searchMap = null;
        Map<String, String> sortMap = null;
        List<String> filterList = null;
        String id = null;
        String name = null;
        String regex = null;

        if (pageable.getSearchData() != null) {
            searchMap = DaoUtils.getSearchDataFromParam(pageable.getSearchData());
        }

        sql.append("select gr from Group gr ");
        sql.append(" WHERE gr.id is not null ");

        if (searchMap != null) {
            id = searchMap.get("id");
            if (id != null) {
                sql.append(" AND o.id = :id ");
            }
            name = searchMap.get("name");
            if (name != null) {
                sql.append(" AND LOWER(gr.name) like LOWER(CONCAT('%',:name,'%')) ");
            }

            regex = searchMap.get("regex");
            if (regex != null) {
                sql.append(" AND LOWER(gr.regex) like LOWER(CONCAT('%',:regex,'%')) ");
            }

        }

        String sortData = null;
        if (pageable.getSortData() != null) {
            sortData = DaoUtils.covertSortDataToStringByAlias(pageable.getSortData(), "gr");
            sortMap = DaoUtils.getSortMapFormParam(pageable.getSortData());
        }
        sql.append(String.format(" ORDER BY %s", sortData != null ? sortData : "gr.id "));

        TypedQuery<Group> query = entityManager.createQuery(sql.toString(), Group.class);

        if (pageable.getFields() != null) {
            filterList = DaoUtils.getFieldsFilter(pageable.getFields());
            pageable.setFieldList(filterList);
        }


        if (searchMap != null) {
            if (id != null) {
                query.setParameter("id", Long.valueOf(id));
            }
            if (regex != null) {
                query.setParameter("regex", regex);
            }
            if (name != null) {
                query.setParameter("name", name);
            }

        }

        long count = count(pageable);
        pageable.setTotal(count);
        pageable.setSearch(searchMap);
        pageable.setSort(sortMap);
        resMap.put("pagination", pageable);

        query.setFirstResult(pageable.getPage()* pageable.getPageSize()).setMaxResults(pageable.getPageSize());
        List<Group> objects = query.getResultList();

        resMap.put("data", objects);
        return resMap;
    }

    @Override
    public long count(Pageable pageable) {

        StringBuilder sql = new StringBuilder();
        Map<String, String> searchMap = null;
        String id = null;
        String name = null;
        String regex = null;


        if (pageable.getSearchData() != null) {
            searchMap = DaoUtils.getSearchDataFromParam(pageable.getSearchData());
        }

        sql.append("select count(*) from `groups` gr ");
        sql.append(" WHERE gr.id is not null ");


        if (searchMap != null) {
            id = searchMap.get("id");
            if (id != null) {
                sql.append(" AND o.id = :id ");
            }
            name = searchMap.get("name");
            if (name != null) {
                sql.append(" AND LOWER(gr.name) like LOWER(CONCAT('%',:name,'%')) ");
            }

            regex = searchMap.get("regex");
            if (regex != null) {
                sql.append(" AND LOWER(gr.regex) like LOWER(CONCAT('%',:regex,'%')) ");
            }

        }

        Query query = entityManager.createNativeQuery(sql.toString());

        if (searchMap != null) {
            if (id != null) {
                query.setParameter("id", Long.valueOf(id));
            }
            if (regex != null) {
                query.setParameter("regex", regex);
            }
            if (name != null) {
                query.setParameter("name", name);
            }

        }

        return  Long.parseLong(query.getSingleResult().toString());

    }
}
