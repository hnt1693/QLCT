package com.nta.teabreakorder.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.nta.teabreakorder.common.CommonUtil;
import com.nta.teabreakorder.common.Pageable;
import com.nta.teabreakorder.enums.Status;
import com.nta.teabreakorder.model.OrderDetail;
import com.nta.teabreakorder.payload.response.ActionEvent;
import com.nta.teabreakorder.repository.OrderDetailRepository;
import com.nta.teabreakorder.repository.OrderRepository;
import com.nta.teabreakorder.repository.dao.OrderDetailDao;
import com.nta.teabreakorder.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderDetailsServiceImpl implements OrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private OrderDetailDao orderDetailDao;
    @Autowired
    private PusherService pusherService;
    @Autowired
    private OrderRepository orderRepository;

    private ObjectMapper objectMapper = CommonUtil.getObjectMapper();

    @Override
    public ResponseEntity get(Pageable pageable) throws Exception {

        return CommonUtil.createResponseEntityOK(orderDetailDao.get(pageable));
    }

    @Override
    public ResponseEntity getById(Long id) throws Exception {
        OrderDetail orderDetail = orderDetailRepository.findById(id).orElseThrow(() -> new Exception("Order not found"));
        return CommonUtil.createResponseEntityOK(orderDetail);
    }

    @Override
    public ResponseEntity create(OrderDetail orderDetail) throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        OrderDetail oldOrder = orderDetailRepository.getAllByOrderIdAndOrderStatusAndUserNameAndProductId(orderDetail.getOrder().getId(), Status.ACTIVATED, username, orderDetail.getProduct().getId());

        if (oldOrder != null) {
            oldOrder.setQuantity((byte) (oldOrder.getQuantity() + orderDetail.getQuantity()));
            orderDetailRepository.save(oldOrder);
            pusherService.triggerEvent(PusherService.ORDERS + "/" + oldOrder.getOrder().getId(), new ActionEvent(username, PusherService.EDIT_ORDER, objectMapper.writeValueAsString(oldOrder)));
            return CommonUtil.createResponseEntityOK(oldOrder);
        } else {
            OrderDetail order = orderDetailRepository.save(orderDetail);
            pusherService.triggerEvent(PusherService.ORDERS + "/" + order.getOrder().getId(), new ActionEvent(username, PusherService.ADD_ORDER, objectMapper.writeValueAsString(order)));
            return CommonUtil.createResponseEntityOK(order);
        }
    }

    @Override
    public ResponseEntity update(OrderDetail orderDetail) throws Exception {
        OrderDetail od = orderDetailRepository.save(orderDetail);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        pusherService.triggerEvent(PusherService.ORDERS + "/" + od.getOrder().getId(), new ActionEvent(username, PusherService.EDIT_ORDER , objectMapper.writeValueAsString(od)));
        return CommonUtil.createResponseEntityOK(od);
    }

    @Override
    public ResponseEntity deletes(List<Long> ids) throws Exception {
        List<OrderDetail> orderDetails = orderDetailRepository.getByIds(ids);

        //updateList
        orderDetailRepository.saveAll(orderDetails.stream()
                .filter(ob -> !ob.getOrder().getStatus().equals(Status.ACTIVATED))
                .peek(orderDetail -> orderDetail.setDeleted(true))
                .collect(Collectors.toSet()));

        //deleteList
        orderDetailRepository.deleteAll(orderDetails.stream().filter(orderDetail -> orderDetail.getOrder().getStatus().equals(Status.ACTIVATED)).collect(Collectors.toSet()));

        Long orderId = orderDetails.get(0).getOrder().getId();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        pusherService.triggerEvent(PusherService.ORDERS + "/" + orderId, new ActionEvent(username, PusherService.REMOVE_ORDER, objectMapper.writeValueAsString(ids)));

        return CommonUtil.createResponseEntityOK(1);
    }

    @Override
    public ResponseEntity getOrderDetailsHistory() throws Exception {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return CommonUtil.createResponseEntityOK(orderDetailDao.getOrderDetailsHistory(username));
    }

    @Override
    public ResponseEntity createByList(List<OrderDetail> orderDetailList) throws Exception {
        if (orderDetailList.isEmpty()) throw new Exception("List empty");
        ResponseEntity resData = CommonUtil.createResponseEntityOK(orderDetailRepository.saveAll(orderDetailList));
        return resData;
    }

    @Override
    public ResponseEntity updateAll(List<OrderDetail> orderDetailList) throws Exception {
        List<OrderDetail> orderDetails = orderDetailRepository.saveAll(orderDetailList);

        Long orderId = orderDetails.get(0).getOrder().getId();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        pusherService.triggerEvent(PusherService.ORDERS + "/" + orderId, new ActionEvent(username, PusherService.EDIT_ORDERS, objectMapper.writeValueAsString(orderDetails)));

        return CommonUtil.createResponseEntityOK(orderDetailRepository.saveAll(orderDetailList));
    }

    @Override
    public ResponseEntity getCartByOrderId(Long orderId) throws Exception {
        String createdBy = SecurityContextHolder.getContext().getAuthentication().getName();
        return CommonUtil.createResponseEntityOK(orderDetailRepository.getAllByOrderIdAndCreatedByAndStatus(orderId, createdBy, Status.UNACTIVATED));
    }

}

