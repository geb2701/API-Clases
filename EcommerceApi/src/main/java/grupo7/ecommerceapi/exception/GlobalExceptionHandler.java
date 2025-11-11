package grupo7.ecommerceapi.exception;

import grupo7.ecommerceapi.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  /**
   * Maneja excepciones de recurso no encontrado
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
      ResourceNotFoundException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
  }

  /**
   * Maneja excepciones de recurso que ya existe
   */
  @ExceptionHandler(ResourceAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleResourceAlreadyExistsException(
      ResourceAlreadyExistsException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.CONFLICT.value(),
        "Conflict",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  /**
   * Maneja excepciones de email duplicado
   */
  @ExceptionHandler(EmailAlreadyExistsException.class)
  public ResponseEntity<ErrorResponse> handleEmailAlreadyExistsException(
      EmailAlreadyExistsException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.CONFLICT.value(),
        "Conflict",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
  }

  /**
   * Maneja credenciales inválidas
   */
  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(
      InvalidCredentialsException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.UNAUTHORIZED.value(),
        "Unauthorized",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
  }

  /**
   * Maneja excepciones de stock insuficiente
   */
  @ExceptionHandler(InsufficientStockException.class)
  public ResponseEntity<ErrorResponse> handleInsufficientStockException(
      InsufficientStockException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja excepciones de validación
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidationExceptions(
      MethodArgumentNotValidException ex,
      WebRequest request) {

    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });

    String message = "Error de validación: " + errors.toString();

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        message,
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja excepciones de argumento ilegal
   */
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }

  /**
   * Maneja excepciones genéricas
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGlobalException(
      Exception ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "Ocurrió un error inesperado: " + ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  /**
   * Maneja excepciones de runtime genéricas
   */
  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ErrorResponse> handleRuntimeException(
      RuntimeException ex,
      WebRequest request) {

    ErrorResponse errorResponse = new ErrorResponse(
        LocalDateTime.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        ex.getMessage(),
        request.getDescription(false).replace("uri=", ""));

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }
}






