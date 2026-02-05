# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-01-15

### Agregado
- Gestión SPA completa con cleanup automático
- Manager global (`MesSelectorManager`)
- Método `destroy()` para cleanup
- Método `refresh()` para SPA
- Overlay móvil que bloquea scroll
- Temas: dark y compact
- Validación de fechas límite
- Callbacks: onOpen, onClose
- Opción `autoCloseOtherSelectors`
- Opción `closeOnClickOutside`
- Documentación web completa
- Demo interactiva con todos los ejemplos

### Cambiado
- Arquitectura mejorada para prevenir memory leaks
- Event listeners optimizados
- CSS reorganizado para mejor mantenibilidad
- API más consistente

### Corregido
- Memory leaks en SPA
- Event listeners duplicados
- Cierre al hacer click fuera en desktop
- Color del mes actual en tema claro
- Visualización en tema dark
- Problemas de z-index en móvil

## [1.0.0] - 2024-01-01

### Agregado
- Funcionalidad básica de selección de meses
- Compatibilidad con MySQL (formato YYYY-MM)
- Diseño responsive
- Cuadrícula 3x4 de meses
- Navegación por años
- Botones: Mes actual y Limpiar
- Icono de calendario opcional
- Validación básica (required)
- Métodos básicos de API
- Ejemplos iniciales

---

## Notas de Versión

### v2.0.0 (Actual)
Esta versión es completamente SPA-safe y está lista para producción. Incluye todas las características solicitadas y soluciona todos los bugs reportados.

### Migración desde v1.0
Si vienes de la versión 1.0, los cambios principales son:

1. **Nuevo**: Siempre llamar `destroy()` al cambiar de página en SPA
2. **Nuevo**: Usar `MesSelectorManager` para gestión global
3. **Mejorado**: API más completa y consistente
4. **Corregido**: Todos los bugs conocidos

No hay breaking changes en la API básica.