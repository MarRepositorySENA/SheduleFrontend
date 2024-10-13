package com.persona.Backend.Controller.Security;

import java.util.Optional;
import java.util.List;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import com.persona.Backend.Controller.BaseController;
import com.persona.Backend.Dto.IDatosUsuarioDto;
import com.persona.Backend.Dto.Security.PermisosDto;
import com.persona.Backend.Entity.Security.Usuario;
import com.persona.Backend.Service.Security.UsuarioService;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;



@CrossOrigin("*")//permite que cualquier dominio tenga acceso a el
@RestController
@RequestMapping("/api/v1/base/security/usuario")
public class UsuarioController extends BaseController<Usuario> {

	@Autowired
	private UsuarioService service;

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private SpringTemplateEngine templateEngine;

	@GetMapping("/datos/usuario/{id}")
	Optional<IDatosUsuarioDto> ObtenerDatosUsuario(@PathVariable Long id){
		return service.ObtenerDatosUsuario(id);
	}

	
	@GetMapping("/validar/datos")
	public Boolean getLogin(@RequestParam String user, String password) throws Exception{
		return service.getLogin(user, password);
	}
	  
	@GetMapping("/validar/permisos")
	public List<PermisosDto> validarPermisos(@RequestParam String User){
		return service.validarPermisos(User);
	}

	@PostMapping("/GuardarUsuarioJwt")
	public Usuario saveUsuarioJwt(@RequestBody Usuario usuario) throws Exception{
		return service.saveUsuarioJwt(usuario);
	}

	@PostMapping("/send-password-reset/{email}")
	public ResponseEntity<String> enviarEmail(@PathVariable String email) {
		try {
			sendPasswordResetEmail(email);
			return ResponseEntity.ok("Correo de recuperación enviado.");
		} catch (MessagingException e) {
			return ResponseEntity.status(500).body("Error al enviar el correo.");
		}
	}

	@PutMapping("/actualizar-contrasenia/{email}")
	public String actualizarContrasenia(@PathVariable String email, @RequestParam String contrasenia) throws Exception {
		System.out.println("Email: " + email + ", Contraseña: " + contrasenia);
		return service.actualizarContrasenia(email, contrasenia);
	}

	public void sendPasswordResetEmail(String userEmail) throws MessagingException {
		String userName = "string";
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(userEmail);
		helper.setSubject("Restablecimiento de contraseña");

		Context context = new Context();
		context.setVariable("userName", userName);
		context.setVariable("email", userEmail); // Agregar el email al contexto

		String htmlContent = templateEngine.process("RecuperarContrasenia.html", context);
		helper.setText(htmlContent, true);

		mailSender.send(message);
	}


}
