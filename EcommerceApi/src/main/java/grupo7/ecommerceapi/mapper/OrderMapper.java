package grupo7.ecommerceapi.mapper;

import grupo7.ecommerceapi.dto.AddressResponseDTO;
import grupo7.ecommerceapi.dto.OrderItemResponseDTO;
import grupo7.ecommerceapi.dto.OrderResponseDTO;
import grupo7.ecommerceapi.entity.BillingAddress;
import grupo7.ecommerceapi.entity.Order;
import grupo7.ecommerceapi.entity.OrderItem;
import grupo7.ecommerceapi.entity.ShippingAddress;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final ProductMapper productMapper;

    public OrderMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }

    public OrderResponseDTO toResponse(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus() != null ? order.getStatus().getValue() : null);
        dto.setTotalAmount(order.getTotalAmount());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setOrderItems(mapOrderItems(order.getOrderItems()));
        dto.setBillingAddresses(mapBillingAddresses(order.getBillingAddresses()));
        dto.setShippingAddresses(mapShippingAddresses(order.getShippingAddresses()));
        return dto;
    }

    public List<OrderResponseDTO> toResponseList(List<Order> orders) {
        return Optional.ofNullable(orders)
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public OrderItemResponseDTO toOrderItem(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        return new OrderItemResponseDTO(
                orderItem.getId(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice(),
                productMapper.toSummary(orderItem.getProduct())
        );
    }

    private List<OrderItemResponseDTO> mapOrderItems(List<OrderItem> orderItems) {
        return Optional.ofNullable(orderItems)
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toOrderItem)
                .collect(Collectors.toList());
    }

    private List<AddressResponseDTO> mapBillingAddresses(List<BillingAddress> addresses) {
        return Optional.ofNullable(addresses)
                .orElse(Collections.emptyList())
                .stream()
                .map(addr -> new AddressResponseDTO(
                        addr.getId(),
                        addr.getFirstName(),
                        addr.getLastName(),
                        addr.getDni(),
                        addr.getAddress(),
                        addr.getCity(),
                        addr.getPostalCode()
                ))
                .collect(Collectors.toList());
    }

    private List<AddressResponseDTO> mapShippingAddresses(List<ShippingAddress> addresses) {
        return Optional.ofNullable(addresses)
                .orElse(Collections.emptyList())
                .stream()
                .map(addr -> new AddressResponseDTO(
                        addr.getId(),
                        addr.getFirstName(),
                        addr.getLastName(),
                        null,
                        addr.getAddress(),
                        addr.getCity(),
                        addr.getPostalCode()
                ))
                .collect(Collectors.toList());
    }
}


