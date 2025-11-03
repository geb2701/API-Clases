package grupo7.ecommerceapi.converter;

import grupo7.ecommerceapi.entity.Order;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<Order.OrderStatus, String> {

    @Override
    public String convertToDatabaseColumn(Order.OrderStatus status) {
        if (status == null) {
            return null;
        }
        return status.getValue();
    }

    @Override
    public Order.OrderStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        // Buscar el enum por su valor (no por su nombre)
        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            if (status.getValue().equalsIgnoreCase(dbData)) {
                return status;
            }
        }
        
        // Si no se encuentra, intentar por nombre del enum (case-insensitive)
        try {
            return Order.OrderStatus.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor de status inválido: " + dbData);
        }
    }
}

