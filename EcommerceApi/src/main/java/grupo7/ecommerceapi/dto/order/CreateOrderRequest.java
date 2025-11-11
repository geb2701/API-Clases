package grupo7.ecommerceapi.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @Valid
    private OrderAddressDTO billing;

    @Valid
    private OrderAddressDTO shipping;

    @Valid
    private OrderPaymentDTO payment;

    @Valid
    @NotEmpty(message = "La orden debe contener al menos un producto")
    private List<OrderItemRequestDTO> items;
}


