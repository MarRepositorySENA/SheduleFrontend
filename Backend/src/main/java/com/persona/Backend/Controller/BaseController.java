package com.persona.Backend.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.persona.Backend.Entity.BaseEntity;
import com.persona.Backend.Service.BaseService;
import com.persona.Backend.Utils.ApiResponseDto;

public abstract class BaseController<T extends BaseEntity> {

    @Autowired
    private BaseService<T> serviceT;

    @GetMapping
    public List<T> all() throws Exception {
        return serviceT.all();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<T>> findById(@PathVariable Long id) throws Exception {
        Optional<T> entity = serviceT.findById(id);
        if (entity.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(entity);
        }
        return ResponseEntity.ok(entity);
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<T>> save(@RequestBody T instanceEntity) throws Exception {
        try {
            T savedEntity = serviceT.save(instanceEntity);
            return ResponseEntity.ok(new ApiResponseDto<>("Datos guardados", savedEntity, true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<T>> update(@PathVariable Long id, @RequestBody T instanceEntity) {
        try {
            serviceT.update(id, instanceEntity);
            return ResponseEntity.ok(new ApiResponseDto<>("Datos actualizados", null, true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponseDto<>(e.getMessage(), null, false));
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception {
        serviceT.delete(id);
    }

    @GetMapping("/consultarRegistrosSinEliminarActivos")
    public List<T> findByDeletedAtIsNullAndStateTrue() {
        return serviceT.findByDeletedAtIsNullAndStateTrue();
    }

    @GetMapping("/consultarRegistrosSinEliminar")
    public List<T> findByDeletedAtIsNull() {
        return serviceT.findByDeletedAtIsNull();
    }
}
