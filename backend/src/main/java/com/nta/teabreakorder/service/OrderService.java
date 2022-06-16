package com.nta.teabreakorder.service;

import com.nta.teabreakorder.model.Order;
import org.springframework.http.ResponseEntity;

public interface OrderService extends CommonService<Order>{

    public ResponseEntity getTotalBill(String id) throws  Exception;

}
