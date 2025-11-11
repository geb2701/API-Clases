package grupo7.ecommerceapi.service;

import grupo7.ecommerceapi.dto.MessageResponseDTO;
import grupo7.ecommerceapi.dto.auth.AuthResponseDTO;
import grupo7.ecommerceapi.dto.auth.AuthUserDTO;
import grupo7.ecommerceapi.dto.auth.EmailCheckResponseDTO;
import grupo7.ecommerceapi.dto.auth.LoginRequestDTO;
import grupo7.ecommerceapi.dto.auth.RegisterRequestDTO;
import grupo7.ecommerceapi.entity.User;
import grupo7.ecommerceapi.exception.EmailAlreadyExistsException;
import grupo7.ecommerceapi.exception.InvalidCredentialsException;
import grupo7.ecommerceapi.mapper.AuthMapper;
import grupo7.ecommerceapi.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthMapper authMapper;

    @InjectMocks
    private AuthService authService;

    private User user;
    private AuthUserDTO authUserDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Jane");
        user.setSurname("Doe");
        user.setEmail("jane@example.com");

        authUserDTO = AuthUserDTO.builder()
                .id(1L)
                .name("Jane")
                .surname("Doe")
                .email("jane@example.com")
                .build();
    }

    @Test
    void register_shouldReturnAuthResponse() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setName("Jane");
        request.setSurname("Doe");
        request.setEmail("Jane@example.com");
        request.setPassword("password");

        when(userService.createUser(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(1L, "jane@example.com")).thenReturn("token");
        when(authMapper.toAuthUser(user)).thenReturn(authUserDTO);

        AuthResponseDTO response = authService.register(request);

        assertEquals("token", response.getToken());
        assertEquals("Usuario registrado exitosamente", response.getMessage());
        assertEquals(authUserDTO, response.getUser());
        verify(userService).createUser(any(User.class));
    }

    @Test
    void register_shouldPropagateEmailAlreadyExists() {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setName("Jane");
        request.setSurname("Doe");
        request.setEmail("jane@example.com");
        request.setPassword("password");

        when(userService.createUser(any(User.class)))
                .thenThrow(new EmailAlreadyExistsException("Email ya registrado"));

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnAuthResponse() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("jane@example.com");
        request.setPassword("password");

        when(userService.login("jane@example.com", "password")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(1L, "jane@example.com")).thenReturn("token");
        when(authMapper.toAuthUser(user)).thenReturn(authUserDTO);

        AuthResponseDTO response = authService.login(request);

        assertEquals("token", response.getToken());
        assertEquals("Login exitoso", response.getMessage());
        assertEquals(authUserDTO, response.getUser());
    }

    @Test
    void login_shouldThrowWhenCredentialsInvalid() {
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("jane@example.com");
        request.setPassword("wrong");

        when(userService.login("jane@example.com", "wrong")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void checkEmail_shouldReturnExistingUser() {
        when(userService.existsByEmail("jane@example.com")).thenReturn(true);
        when(userService.getUserByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(authMapper.toAuthUser(user)).thenReturn(authUserDTO);

        EmailCheckResponseDTO response = authService.checkEmail("Jane@example.com");

        assertEquals(true, response.isExists());
        assertEquals(authUserDTO, response.getUser());
        verify(userService).existsByEmail("jane@example.com");
        verify(userService).getUserByEmail("jane@example.com");
    }

    @Test
    void checkEmail_shouldReturnNotExistsWhenEmailEmpty() {
        EmailCheckResponseDTO response = authService.checkEmail("   ");

        assertEquals(false, response.isExists());
        assertEquals(null, response.getUser());
    }

    @Test
    void logout_shouldReturnMessage() {
        MessageResponseDTO response = authService.logout();
        assertEquals("Logout exitoso", response.getMessage());
    }
}

