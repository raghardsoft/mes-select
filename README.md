# MesSelector 📅

Componente de selección de meses personalizable, compatible con MySQL y optimizado para SPA.

![Badges](https://img.shields.io/badge/MySQL-Compatible-success) ![Badges](https://img.shields.io/badge/SPA-Optimized-blue) ![Badges](https://img.shields.io/badge/Responsive-Design-green) ![Badges](https://img.shields.io/badge/Type-Free%20to%20Use-brightgreen)

## 🌟 Características Principales

- ✅ **100% Compatible con MySQL** - Formato YYYY-MM
- ✅ **SPA Optimizado** - Sin memory leaks, cleanup automático
- ✅ **Responsive Design** - Funciona en móvil y desktop
- ✅ **API Completa** - Métodos para control programático
- ✅ **Temas Personalizables** - Default, Dark, Compact
- ✅ **Validación Integrada** - Fechas límite, required, disabled
- ✅ **Overlay Móvil** - Mejor UX en dispositivos pequeños
- ✅ **Sin Dependencias** - Vanilla JavaScript puro

## 📦 Instalación

### Archivos Requeridos

```html
<!-- Incluir en el <head> -->
<link rel="stylesheet" href="mes-selector.css">

<!-- Incluir antes de cerrar <body> -->
<script src="mes-selector.js"></script>````


## HTML Básico
```html
<!-- Por cada selector que necesites -->
<input type="hidden" id="miMes" name="mes">
<div class="mes-selector-container" id="miSelector"></div>
```

## 🚀 Uso Rápido

### Inicialización Básica

```js
// Cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const selector = new MesSelector('miSelector', 'miMes', {
        placeholder: 'Selecciona un mes',
        required: true,
        onChange: function(value, date) {
            console.log('Mes seleccionado:', value, date);
        }
    });
});
```

### Con Formulario

```js
// Manejar envío de formulario
document.getElementById('miFormulario').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (selector.isValid()) {
        const valor = selector.getValue(); // "2024-05"
        // Enviar a servidor...
    } else {
        selector.showError('Por favor, selecciona un mes');
    }
});
```

## ⚙️ Configuración Completa

```js
const options = {
    // ========== APARIENCIA ==========
    placeholder: 'Selecciona un mes',
    showIcon: true,                    // Mostrar icono de calendario
    theme: 'default',                  // 'default', 'dark', 'compact'
    
    // ========== CONTROLES VISIBLES ==========
    showTodayBtn: true,                // Botón "Mes actual"
    showClearBtn: true,                // Botón "Limpiar"
    showYearNav: true,                 // Flechas de navegación de año
    
    // ========== COMPORTAMIENTO ==========
    mobileOverlay: true,               // Overlay en móviles (bloquea scroll)
    closeOnClickOutside: true,         // Cerrar al hacer click fuera
    autoCloseOtherSelectors: true,     // Cerrar otros selectores al abrir uno
    
    // ========== VALIDACIÓN ==========
    required: false,                   // Validación HTML5 required
    disabled: false,                   // Deshabilitar selector
    minDate: '2020-01',               // Fecha mínima (YYYY-MM)
    maxDate: '2030-12',               // Fecha máxima (YYYY-MM)
    minYear: 1900,                     // Año mínimo absoluto
    maxYear: 2100,                     // Año máximo absoluto
    
    // ========== INTERNACIONALIZACIÓN ==========
    locale: 'es',                      // 'es' o 'en'
    
    // ========== CALLBACKS ==========
    onChange: function(value, date) {
        // value: 'YYYY-MM' (formato MySQL)
        // date: Objeto Date (primer día del mes)
    },
    onOpen: function() {
        // Se ejecuta cuando se abre el selector
    },
    onClose: function() {
        // Se ejecuta cuando se cierra el selector
    }
};
```

## 📋 API de Métodos

| Método               | Descripción                                 | Ejemplo                                    |
|----------------------|---------------------------------------------|--------------------------------------------|
| `.setValue(value)`   | Establece el valor del selector             | `selector.setValue('2024-05')`             |
| `.getValue()`        | Obtiene el valor en formato MySQL (YYYY-MM) | `const valor = selector.getValue()`        |
| `.getDate()`         | Obtiene el objeto Date correspondiente      | `const fecha = selector.getDate()`         |
| `.getDisplayValue()` | Obtiene el texto mostrado al usuario        | `const texto = selector.getDisplayValue()` |
| `.getYearMonth()`    | Obtiene objeto {año, mes}                   | `const ym = selector.getYearMonth()`       |
| `.clear()`           | Limpia la selección actual                  | `selector.clear()`                         |
| `.open()`            | Abre el selector programáticamente          | `selector.open()`                          |
| `.close()`           | Cierra el selector programáticamente        | `selector.close()`                         |
| `.destroy()`         | Destruye el componente (SPA cleanup)        | `selector.destroy()`                       |
| `.isValid()`         | Verifica si tiene un valor válido           | `if (selector.isValid())`                  |
| `.showError(msg)`    | Muestra un mensaje de error                 | `selector.showError('Error')`              |
| `.hideError()`       | Oculta el mensaje de error                  | `selector.hideError()`                     |
| `.disable()`         | Deshabilita el selector                     | `selector.disable()`                       |
| `.enable()`          | Habilita el selector                        | `selector.enable()`                        |
| `.refresh()`         | Refresca si elementos DOM cambiaron (SPA)   | `selector.refresh()`                       |

## Ejemplos de Uso de API

```js
// Cargar desde base de datos
selector.setValue(datosDesdeMySQL.periodo);  // "2024-08"

// Guardar en base de datos
const valorParaMySQL = selector.getValue();  // "2024-08"

// En MySQL usarías:
// INSERT INTO tabla (periodo) VALUES ('2024-08-01')

// Obtener diferentes representaciones
const mysqlFormat = selector.getValue();      // "2024-08"
const displayText = selector.getDisplayValue(); // "Agosto de 2024"
const dateObject = selector.getDate();       // Date object
const yearMonth = selector.getYearMonth();   // {year: 2024, month: 8}
```

## 🔧 Uso en SPA (Single Page Application)
### Patrón Recomendado

```js
// En tu componente/página SPA
class MiPaginaSPA {
    constructor() {
        this.selectors = []; // Array para rastrear instancias
    }
    
    init() {
        // Inicializar selectores
        this.selectors.push(new MesSelector('selector1', 'mes1', options));
        this.selectors.push(new MesSelector('selector2', 'mes2', options));
        
        // Opcional: Inicializar manager global
        MesSelectorManager.init();
    }
    
    destroy() {
        // Opción 1: Destruir selectores individualmente
        this.selectors.forEach(selector => selector.destroy());
        this.selectors = [];
        
        // Opción 2: Usar el manager global (destruye TODOS)
        // MesSelectorManager.destroyAll();
    }
}
```

## Con Frameworks JavaScript
### React

```js
import { useEffect, useRef } from 'react';

function MiComponente() {
    const selectorRef = useRef(null);
    
    useEffect(() => {
        // Inicializar en componentDidMount
        selectorRef.current = new MesSelector('selector1', 'mes1', {
            placeholder: 'Selecciona mes',
            onChange: (value) => {
                // Actualizar estado React
            }
        });
        
        // Cleanup en componentWillUnmount
        return () => {
            if (selectorRef.current) {
                selectorRef.current.destroy();
                selectorRef.current = null;
            }
        };
    }, []);
    
    return (
        <div>
            <input type="hidden" id="mes1" />
            <div className="mes-selector-container" id="selector1"></div>
        </div>
    );
}
```

### Vue.js

```js
export default {
    data() {
        return {
            selector: null
        };
    },
    mounted() {
        // Inicializar en mounted
        this.selector = new MesSelector('selector1', 'mes1', {
            placeholder: 'Selecciona mes',
            onChange: (value) => {
                this.$emit('month-changed', value);
            }
        });
    },
    beforeDestroy() {
        // Cleanup en beforeDestroy
        if (this.selector) {
            this.selector.destroy();
            this.selector = null;
        }
    }
};
```

### Angular

```ts
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-mi-componente',
    template: `
        <input type="hidden" id="mes1">
        <div class="mes-selector-container" id="selector1"></div>
    `
})
export class MiComponente implements OnInit, OnDestroy {
    private selector: any;
    
    ngOnInit() {
        // Inicializar en ngOnInit
        this.selector = new (window as any).MesSelector('selector1', 'mes1', {
            placeholder: 'Selecciona mes',
            onChange: (value: string) => {
                // Manejar cambio
            }
        });
    }
    
    ngOnDestroy() {
        // Cleanup en ngOnDestroy
        if (this.selector) {
            this.selector.destroy();
            this.selector = null;
        }
    }
}
```

## Manager Global para SPA

```js
// Inicializar manager (se hace automáticamente)
MesSelectorManager.init();

// Destruir TODOS los selectores (al cambiar de página)
MesSelectorManager.destroyAll();

// Cerrar TODOS los selectores abiertos
MesSelectorManager.closeAllSelectors();

// Función global de cleanup
window.cleanupMesSelectors(); // Alias para destroyAll()
```

## 💾 Integración con MySQL

### Desde MySQL a Componente

```php
// PHP: Obtener valor de base de datos
$stmt = $pdo->prepare("SELECT DATE_FORMAT(fecha, '%Y-%m') as mes FROM tabla");
$result = $stmt->fetch();
$valorDesdeMySQL = $result['mes']; // "2024-08"

// En tu template/JS
echo "<script>selector.setValue('$valorDesdeMySQL');</script>";
// O con AJAX
fetch('/api/get-month').then(r => r.json()).then(data => {
    selector.setValue(data.mes);
});
```

### Desde Componente a MySQL

```js
// JavaScript: Obtener valor para guardar
const valorParaMySQL = selector.getValue(); // "2024-08"

// Enviar via formulario o AJAX
const formData = new FormData();
formData.append('mes', valorParaMySQL);

// O con fetch
fetch('/api/save-month', {
    method: 'POST',
    body: JSON.stringify({ mes: valorParaMySQL }),
    headers: {'Content-Type': 'application/json'}
});
```

```php
// PHP: Guardar en MySQL
$mes = $_POST['mes']; // "2024-08"

// Opción 1: Como DATE (primer día del mes)
$stmt = $pdo->prepare("INSERT INTO tabla (fecha) VALUES (CONCAT(?, '-01'))");
$stmt->execute([$mes]);

// Opción 2: Como VARCHAR (YYYY-MM)
$stmt = $pdo->prepare("INSERT INTO tabla (periodo) VALUES (?)");
$stmt->execute([$mes]);

// Opción 3: Como YEAR_MONTH
$stmt = $pdo->prepare("INSERT INTO tabla (periodo) VALUES (STR_TO_DATE(CONCAT(?, '-01'), '%Y-%m-%d'))");
$stmt->execute([$mes]);
```

## 📱 Comportamiento en Móvil

### Overlay Móvil
Por defecto, en dispositivos móviles (≤ 768px) se activa un overlay que:

* Oscurece el fondo al 50%
* Bloquea el scroll de la página
* Centra el selector en pantalla
* Se cierra al tocar fuera
  
### Desactivar Overlay

```js
const selector = new MesSelector('id', 'input', {
    mobileOverlay: false  // Comportamiento desktop también en móvil
});
```

## 🎨 Temas Disponibles
### Default

```js
theme: 'default'  // Tema claro estándar
```

### Dark

```js
theme: 'dark'  // Tema oscuro con buen contraste
```

### Compact

```js
theme: 'compact'  // Versión más compacta para espacios reducidos
```

## 🔍 Ejemplos de Configuraciones Comunes

### Selector Mínimo

```js
const selector = new MesSelector('id', 'input', {
    placeholder: 'Selecciona',
    showIcon: false,
    showTodayBtn: false,
    showClearBtn: false,
    showYearNav: false,
    mobileOverlay: false
});
```

### Selector de Solo Lectura

```js
const selector = new MesSelector('id', 'input', {
    placeholder: 'Mes (solo lectura)',
    disabled: true,
    showIcon: false,
    showTodayBtn: false,
    showClearBtn: false
});
```

### Selector para Formularios

```js
const selector = new MesSelector('id', 'input', {
    placeholder: 'Selecciona un mes*',
    required: true,
    showClearBtn: false,  // No permitir limpiar en formularios
    showTodayBtn: true    // Permitir seleccionar mes actual
});
```

### Selector con Rango Específico

```js
const selector = new MesSelector('id', 'input', {
    placeholder: 'Mes 2024',
    minDate: '2024-01',
    maxDate: '2024-12',
    showIcon: true,
    theme: 'dark'
});
```

## 🚨 Manejo de Errores
### Validación Personalizada

```js
// Validar antes de enviar formulario
function validarFormulario() {
    if (!selector.isValid()) {
        selector.showError('Por favor, selecciona un mes válido');
        selector.open(); // Abrir selector para corregir
        return false;
    }
    return true;
}

// Escuchar cambios para limpiar errores
selector.config.onChange = function(value) {
    selector.hideError();
    // ... tu lógica adicional
};
```

### Manejo de Fechas Inválidas

```js
try {
    selector.setValue('2024-13'); // Mes inválido
} catch (error) {
    console.error('Error al establecer valor:', error.message);
    selector.showError('Fecha inválida proporcionada');
}

try {
    selector.setValue('2023-12'); // Fuera de rango si minDate es 2024-01
} catch (error) {
    console.error('Error:', error.message);
}
```

## 🔗 Enlaces y Recursos

### Demo Completa
* 📖 [Ver Demo Interactiva](main-demo.html "demo")
* 📚 [Documentación Web](documentacion.html "Documentacion")

### Archivos Principales

* 📄 [mes-selector.js](mes-selector.js) - Lógica del componente
* 🎨 [mes-selector.css](mes-selector.css) - Estilos del componente
* 🏠 [index.html](index.html) - Página principal de ejemplo

### Secciones de la Demo

1. [Selector Simple](main-demo.html/#simple)
2. [Con Validación](main-demo.html/#validation)
3. [Múltiples Selectores](main-demo.html/#multiple)
4. [Formulario Completo](main-demo.html/#form)
5. [Gestión SPA](main-demo.html/#spa)

## 📝 Notas de Versión

### v2.0 (Actual)

* SPA-safe: Sin memory leaks, cleanup automático
* Overlay móvil: Mejor UX en dispositivos pequeños
* API completa: Métodos para control programático
* Temas: Default, Dark, Compact
* Validación: Fechas límite, required, disabled
* Internacionalización: Español/Inglés

### v1.0 (Inicial)

* Funcionalidad básica de selección
* Compatibilidad MySQL
* Diseño responsive

## 🐛 Solución de Problemas

### Problemas Comunes
1. Selector no se muestra
```js
// Verificar:
// 1. Los archivos CSS/JS están cargados
// 2. Los IDs existen en el DOM
// 3. El DOM está listo (DOMContentLoaded)
console.log('Container:', document.getElementById('miSelector'));
console.log('Input:', document.getElementById('miMes'));
```

2. Event listeners duplicados (SPA)
```js
// Siempre llamar destroy() al cambiar de página
selector.destroy();

// O usar el manager global
MesSelectorManager.destroyAll();
```

3. Valor no se guarda en formulario
```js
// Verificar que el input hidden tenga name attribute
<input type="hidden" id="miMes" name="mes">

// Y que el selector esté inicializado antes del submit
```

4. Problemas en móvil
```js
// Probar con overlay desactivado
mobileOverlay: false

// Verificar media queries en CSS
```

## Debugging

```js
// Exponer instancias para debugging
window.debugSelectors = function() {
    console.group('🔍 MesSelector Debug');
    console.log('Instancias:', MesSelectorInstances.length);
    console.log('Selector abierto:', currentlyOpenSelector);
    console.log('Listeners globales:', globalListenersAdded);
    console.groupEnd();
};

// Llamar desde consola del navegador
debugSelectors();
```

## 🤝 Contribuir

### Reportar Issues

1. Verifica que el problema no esté ya reportado
2. Proporciona:
   - Versión del componente
   - Navegador y versión
   - Código que reproduce el problema
   - Capturas de pantalla si es posible

### Mejoras Sugeridas

* Soporte para más idiomas
* Temas personalizados via CSS variables
* Integración con más frameworks
* Testing automatizado
  
## 📄 Licencia

Este componente es de uso libre. Puedes:
- Usarlo en proyectos personales y comerciales
- Modificarlo según tus necesidades
- Distribuirlo con tus proyectos

Atribución apreciada pero no requerida.

## 🔗 Enlaces Rápidos

- [🚀 **Demo Interactiva**](main-demo.html) - Prueba todas las funciones
- [📚 **Documentación Web**](documentacion.html) - Guía completa
- [💻 **Componente JS**](mes-selector.js) - Código fuente
- [🎨 **Estilos CSS**](mes-selector.css) - Archivo de estilos

## 📖 Demo Online

Si estás viendo esto en GitHub Pages, prueba:
- [Demo Principal](main-demo.html)
- [Documentación](documentacion.html)

## 👨‍💻 Autor

Desarrollado con ❤️ para simplificar la selección de meses en aplicaciones web.

<div align="center"> <p> <strong>¿Encontraste útil este componente?</strong><br> ⭐ Dale una estrella en GitHub si te gustó </p>

<p>
    <a href="main-demo.html">🔗 Ver Demo Completa</a> | 
    <a href="#uso-rápido">🚀 Comenzar</a> | 
    <a href="#api-de-métodos">📚 Ver API</a>
</p>

</div>

