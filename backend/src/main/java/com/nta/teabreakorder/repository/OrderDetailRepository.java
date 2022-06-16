package com.nta.teabreakorder.repository;

import com.nta.teabreakorder.enums.Status;
import com.nta.teabreakorder.model.Order;
import com.nta.teabreakorder.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Modifying
    @Transactional
    @Query("delete from OrderDetail where id in :ids")
    void deletes(@Param("ids") List<Long> ids);

    List<OrderDetail> getAllByOrderIdAndCreatedByAndStatus(Long orderId, String username, Status status);

    @Query(value = "select o from OrderDetail o where o.order.id =?1 AND o.order.status=?2 AND o.createdBy=?3 AND o.product.id=?4 AND o.status ='UNACTIVATED'")
    OrderDetail getAllByOrderIdAndOrderStatusAndUserNameAndProductId(Long orderId, Status status, String username, Long productId);

    @Query("select od from OrderDetail od  where od.id in :ids")
    List<OrderDetail> getByIds(@Param("ids") List<Long> ids);


}
