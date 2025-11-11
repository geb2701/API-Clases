package grupo7.ecommerceapi.dto.order;

import grupo7.ecommerceapi.entity.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {

    @NotNull(message = "El estado es requerido")
    private Order.OrderStatus status;
}


