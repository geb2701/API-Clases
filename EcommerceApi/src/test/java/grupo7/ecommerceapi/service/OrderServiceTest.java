package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.OrderItemResponseDTO;
import grupo7.ecommerceapi.dto.order.CreateOrderRequest;
import grupo7.ecommerceapi.dto.order.OrderAddressDTO;
import grupo7.ecommerceapi.dto.order.OrderItemRequestDTO;
import grupo7.ecommerceapi.dto.order.OrderPaymentDTO;
import grupo7.ecommerceapi.entity.Order;
import grupo7.ecommerceapi.entity.OrderItem;
import grupo7.ecommerceapi.entity.Product;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.InsufficientStockException;
import grupo7.ecommerceapi.exception.ResourceNotFoundException;
import grupo7.ecommerceapi.mapper.OrderMapper;
import grupo7.ecommerceapi.mapper.ProductMapper;
import grupo7.ecommerceapi.repository.BillingAddressRepository;
import grupo7.ecommerceapi.repository.OrderItemRepository;
import grupo7.ecommerceapi.repository.OrderRepository;
import grupo7.ecommerceapi.repository.PaymentInfoRepository;
import grupo7.ecommerceapi.repository.ShippingAddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private BillingAddressRepository billingAddressRepository;
    @Mock
    private ShippingAddressRepository shippingAddressRepository;
    @Mock
    private PaymentInfoRepository paymentInfoRepository;
    @Mock
    private ProductService productService;

    private OrderService orderService;

    private User user;
    private CreateOrderRequest createOrderRequest;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(
                orderRepository,
                orderItemRepository,
                billingAddressRepository,
                shippingAddressRepository,
                paymentInfoRepository,
                productService,
                new OrderMapper(new ProductMapper())
        );

        user = new User();
        user.setId(10L);

        OrderItemRequestDTO itemRequest = new OrderItemRequestDTO();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);

        OrderAddressDTO billing = new OrderAddressDTO();
        billing.setFirstName("John");
        billing.setLastName("Doe");
        billing.setDni("12345678");
        billing.setAddress("Main St");
        billing.setCity("City");
        billing.setPostalCode("1000");

        OrderPaymentDTO payment = new OrderPaymentDTO();
        payment.setCardNumber("4111111111111111");
        payment.setExpiryDate("12/30");
        payment.setCvv("123");
        payment.setCardholderName("John Doe");

        createOrderRequest = new CreateOrderRequest();
        createOrderRequest.setItems(List.of(itemRequest));
        createOrderRequest.setBilling(billing);
        createOrderRequest.setPayment(payment);
    }

    @Test
    void createOrder_shouldThrow_whenProductNotFound() {
        when(productService.getProductById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.createOrder(user, createOrderRequest));
    }

    @Test
    void createOrder_shouldThrow_whenStockInsufficient() {
        Product product = new Product();
        product.setId(1L);
        product.setStock(1);
        product.setPrice(BigDecimal.valueOf(100));
        when(productService.getProductById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class,
                () -> orderService.createOrder(user, createOrderRequest));
    }

    @Test
    void updateOrderStatus_shouldThrow_whenOrderDoesNotExist() {
        when(orderRepository.findById(5L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> orderService.updateOrderStatus(5L, Order.OrderStatus.PENDING));
    }

    @Test
    void updateOrderStatus_shouldReturnUpdatedOrder() {
        Order order = new Order();
        order.setId(5L);
        when(orderRepository.findById(5L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = orderService.updateOrderStatus(5L, Order.OrderStatus.SHIPPED);

        assertEquals("shipped", response.getStatus());
        verify(orderRepository).save(order);
    }

    @Test
    void getOrderItems_shouldThrow_whenOrderDoesNotExist() {
        when(orderRepository.existsById(3L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderItems(3L));
    }

    @Test
    void getOrderItems_shouldReturnMappedItems() {
        when(orderRepository.existsById(3L)).thenReturn(true);
        Product product = new Product();
        product.setId(1L);
        product.setName("Product 1");
        product.setImage("image.png");
        product.setPrice(BigDecimal.valueOf(100));
        product.setDiscount(BigDecimal.valueOf(90));

        OrderItem orderItem = new OrderItem();
        orderItem.setId(7L);
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
        orderItem.setUnitPrice(BigDecimal.valueOf(90));
        orderItem.setTotalPrice(BigDecimal.valueOf(180));

        when(orderItemRepository.findByOrderId(3L)).thenReturn(List.of(orderItem));

        List<OrderItemResponseDTO> response = orderService.getOrderItems(3L);

        assertEquals(1, response.size());
        assertEquals(7L, response.get(0).getId());
        assertEquals(2, response.get(0).getQuantity());
        assertEquals("Product 1", response.get(0).getProduct().getName());
    }
}


