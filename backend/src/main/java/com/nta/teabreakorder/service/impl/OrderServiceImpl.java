package com.nta.teabreakorder.service.impl;

import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.model.Order;
import com.nta.teabreakorder.model.OrderDetail;
import com.nta.teabreakorder.repository.OrderDetailRepository;
import com.nta.teabreakorder.repository.OrderRepository;
import com.nta.teabreakorder.repository.dao.OrderDao;
import com.nta.teabreakorder.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderDao orderDao;

    @Override
    public ResponseEntity get(Pageable pageable) throws Exception {
        return CommonUtil.createResponseEntityOK(orderDao.get(pageable));
    }

    @Override
    public ResponseEntity getById(Long id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(() -> new Exception("Order not found"));
        return CommonUtil.createResponseEntityOK(order);
    }

    @Override
    public ResponseEntity create(Order order) throws Exception {
        //order.setId(0L);
        return CommonUtil.createResponseEntityOK(orderRepository.save(order));
    }

    @Override
    public ResponseEntity update(Order order) throws Exception {
        return CommonUtil.createResponseEntityOK(orderRepository.save(order));
    }

    @Override
    public ResponseEntity deletes(List<Long> ids) throws Exception {
        List<Order> orderList = orderRepository.getAllByIds(ids);
        List<OrderDetail> orderDetails = new ArrayList<>();
        orderList.forEach(ob -> {
            orderDetails.addAll(ob.getOrderDetailList());
            ob.getOrderDetailList().clear();
        });

        orderDetailRepository.deleteAll(orderDetails);
        orderRepository.deleteAll(orderList);
        return CommonUtil.createResponseEntityOK(1);
    }

    @Override
    public ResponseEntity getTotalBill(String id) throws Exception {
        return CommonUtil.createResponseEntityOK(orderDao.getTotalBill(id));
    }

}
