/**
 * Componente MesSelector - Versión Final Mejorada SPA-Safe
 * Uso: new MesSelector(containerId, inputId, options)
 */

// Variables globales para gestión SPA
let MesSelectorInstances = [];
let currentlyOpenSelector = null;
let globalListenersAdded = false;

// Handlers globales (una sola instancia)
const globalHandlers = {
    handleDocumentClick: function(e) {
        if (currentlyOpenSelector && currentlyOpenSelector.config.closeOnClickOutside) {
            const clickedHeader = e.target.closest('.mes-selector-header');
            
            // Si se hace click en el header de otro selector
            if (clickedHeader && clickedHeader !== currentlyOpenSelector.header) {
                return; // Dejar que el otro selector maneje su click
            }
            
            // Si el click NO fue dentro del selector abierto
            if (!currentlyOpenSelector.container.contains(e.target)) {
                currentlyOpenSelector.close();
            }
        }
    },
    
    handleKeydown: function(e) {
        if (e.key === 'Escape' && currentlyOpenSelector) {
            currentlyOpenSelector.close();
        }
    },
    
    handleResize: function() {
        if (currentlyOpenSelector) {
            currentlyOpenSelector.isMobile = currentlyOpenSelector.detectMobile();
            if (currentlyOpenSelector.isOpen) {
                currentlyOpenSelector.positionOptions();
            }
        }
    }
};

// Métodos estáticos para gestión SPA
class MesSelectorManager {
    static init() {
        // Inicializar listeners globales (una sola vez)
        if (!globalListenersAdded) {
            document.addEventListener('click', globalHandlers.handleDocumentClick);
            document.addEventListener('keydown', globalHandlers.handleKeydown);
            window.addEventListener('resize', globalHandlers.handleResize);
            globalListenersAdded = true;
        }
    }
    
    static destroyAll() {
        // Destruir todas las instancias
        MesSelectorInstances.forEach(instance => {
            instance.destroy();
        });
        MesSelectorInstances = [];
        currentlyOpenSelector = null;
    }
    
    static closeAllSelectors(excludeSelector = null) {
        MesSelectorInstances.forEach(instance => {
            if (instance !== excludeSelector && instance.isOpen) {
                instance.close();
            }
        });
    }
}

class MesSelector {
    constructor(containerId, inputId, options = {}) {
        // Configuración por defecto
        this.defaults = {
            placeholder: 'Selecciona un mes',
            required: false,
            locale: 'es',
            minDate: null,          // 'YYYY-MM' o Date object
            maxDate: null,          // 'YYYY-MM' o Date object
            minYear: 1900,
            maxYear: 2100,
            disabled: false,
            showIcon: true,         // Mostrar icono de calendario
            showTodayBtn: true,     // Mostrar botón "Mes actual"
            showClearBtn: true,     // Mostrar botón "Limpiar"
            showYearNav: true,      // Mostrar navegación de años
            mobileOverlay: true,    // Usar overlay en móviles
            closeOnClickOutside: true, // Cerrar al hacer click fuera
            autoCloseOtherSelectors: true, // Cerrar otros selectores al abrir uno
            onChange: null,
            onOpen: null,
            onClose: null,
            theme: 'default'        // 'default', 'dark', 'compact'
        };


        // Combinar opciones
        this.config = { ...this.defaults, ...options };
        
        // Validar parámetros
        if (!containerId || !inputId) {
            console.error('MesSelector: Se requieren containerId e inputId');
            return;
        }
        
        // Verificar si ya existe una instancia para estos elementos
        const existingInstance = MesSelectorInstances.find(inst => 
            inst.containerId === containerId && inst.inputId === inputId
        );
        
        if (existingInstance) {
            console.warn('MesSelector: Ya existe una instancia para estos elementos. Destruyendo la anterior.');
            existingInstance.destroy();
        }
        
        // Guardar IDs para referencia
        this.containerId = containerId;
        this.inputId = inputId;
        
        // Elementos del DOM
        this.container = document.getElementById(containerId);
        this.input = document.getElementById(inputId);
        
        if (!this.container || !this.input) {
            console.error('MesSelector: Elementos no encontrados');
            return;
        }
        
        // Detectar si es móvil
        this.isMobile = this.detectMobile();
        
        // Procesar fechas
        this.minDate = this.parseDate(this.config.minDate);
        this.maxDate = this.parseDate(this.config.maxDate);
        
        // Estado
        this.meses = this.getMonths();
        this.currentYear = new Date().getFullYear();
        this.selectedYear = null;
        this.selectedMonth = null;
        this.isOpen = false;
        this.overlay = null;
        
        // Inicializar listeners globales
        MesSelectorManager.init();
        
        // Inicializar componente
        this.init();
        this.attachEvents();
        
        // Establecer valor inicial
        if (this.input.value) {
            this.setValue(this.input.value);
        }
        
        // Aplicar configuración
        if (this.config.theme !== 'default') {
            this.container.classList.add(`theme-${this.config.theme}`);
        }
        
        if (this.config.disabled) {
            this.disable();
        }
        
        // Registrar instancia
        MesSelectorInstances.push(this);
        
        // Registrar para SPA cleanup
        if (typeof window !== 'undefined') {
            window._mesSelectors = window._mesSelectors || [];
            window._mesSelectors.push(this);
        }

        this.isTouchDevice = this.detectTouchDevice();
        this.isIOS = this.detectIOS();
    }
    
    // Métodos para detectar dispositivo:
    detectTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    detectMobile() {
        return window.innerWidth <= 768;
    }
    
    parseDate(dateValue) {
        if (!dateValue) return null;
        
        if (typeof dateValue === 'string') {
            const match = dateValue.match(/^(\d{4})-(\d{2})/);
            if (match) {
                return {
                    year: parseInt(match[1]),
                    month: parseInt(match[2])
                };
            }
        } else if (dateValue instanceof Date) {
            return {
                year: dateValue.getFullYear(),
                month: dateValue.getMonth() + 1
            };
        }
        
        return null;
    }
    
    getMonths() {
        if (this.config.locale === 'es') {
            return [
                'Enero', 'Febrero', 'Marzo', 'Abril',
                'Mayo', 'Junio', 'Julio', 'Agosto',
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
        }
        return [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
    }
    
    init() {
        // Verificar si ya está inicializado
        if (this.container.querySelector('.mes-selector-header')) {
            console.warn('MesSelector: El componente ya estaba inicializado. Limpiando.');
            this.container.innerHTML = '';
        }
        
        this.container.className = 'mes-selector-container';
        
        // Determinar qué botones mostrar
        const yearNavHTML = this.config.showYearNav ? `
            <div class="mes-year-section">
                <button type="button" class="mes-nav-btn mes-prev-year" aria-label="Año anterior">◀</button>
                <span class="mes-current-year">${this.currentYear}</span>
                <button type="button" class="mes-nav-btn mes-next-year" aria-label="Siguiente año">▶</button>
            </div>
        ` : `
            <div class="mes-year-section">
                <span class="mes-current-year">${this.currentYear}</span>
            </div>
        `;
        
        const actionButtons = [];
        if (this.config.showTodayBtn) {
            this.config.locale === 'es'
                ? actionButtons.push('<button type="button" class="mes-action-btn mes-today-btn">Mes actual</button>')
                : actionButtons.push('<button type="button" class="mes-action-btn mes-today-btn">Current month</button>');
        }
        if (this.config.showClearBtn) {
            this.config.locale === 'es'
                ? actionButtons.push('<button type="button" class="mes-action-btn mes-clear-btn">Limpiar</button>')
                : actionButtons.push('<button type="button" class="mes-action-btn mes-clear-btn">Clear</button>');
        }
        
        const buttonsHTML = actionButtons.length > 0 ? `
            <div class="mes-buttons">
                ${actionButtons.join('')}
            </div>
        ` : '';
        
        const iconHTML = this.config.showIcon ? '<span class="icon">📅</span>' : '';
        const headerPadding = this.config.showIcon ? 'padding-left: 45px;' : 'padding-left: 20px;';
        
        // Crear estructura HTML
        this.container.innerHTML = `
            <div class="mes-selector-header" style="${headerPadding}">
                ${iconHTML}
                <span class="mes-placeholder">${this.config.placeholder}</span>
                <span class="mes-selected-value"></span>
                <span class="arrow">▼</span>
            </div>
            <div class="mes-options">
                ${yearNavHTML}
                <div class="mes-grid"></div>
                ${buttonsHTML}
            </div>
        `;
        
        // Referencias a elementos
        this.header = this.container.querySelector('.mes-selector-header');
        this.options = this.container.querySelector('.mes-options');
        this.yearElement = this.container.querySelector('.mes-current-year');
        this.monthsGrid = this.container.querySelector('.mes-grid');
        this.prevYearBtn = this.container.querySelector('.mes-prev-year');
        this.nextYearBtn = this.container.querySelector('.mes-next-year');
        this.todayBtn = this.container.querySelector('.mes-today-btn');
        this.clearBtn = this.container.querySelector('.mes-clear-btn');
        this.selectedValue = this.container.querySelector('.mes-selected-value');
        
        this.renderMonths();
    }
    
    createOverlay() {
        if (this.overlay) {
            // Reutilizar overlay existente
            return;
        }
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'mes-overlay';
        this.overlay.dataset.selectorId = this.containerId; // Identificador único
        document.body.appendChild(this.overlay);
        
        // Event listener con referencia débil
        const closeHandler = (e) => {
            if (e.target === this.overlay && this.isOpen) {
                this.close();
            }
        };
        
        this.overlay._closeHandler = closeHandler;
        this.overlay.addEventListener('click', closeHandler);
    }
    
    removeOverlay() {
        if (this.overlay) {
            if (this.overlay._closeHandler) {
                this.overlay.removeEventListener('click', this.overlay._closeHandler);
            }
            this.overlay.remove();
            this.overlay = null;
        }
    }
    
    attachEvents() {
        // Remover listeners previos si existen
        this.removeEvents();
        
        // Delegación de eventos
        const clickHandler = (e) => {
            const target = e.target;
            
            if (target === this.header || target.closest('.mes-selector-header')) {
                if (!this.config.disabled) {
                    if (this.isOpen) {
                        this.close();
                    } else {
                        if (this.config.autoCloseOtherSelectors) {
                            MesSelectorManager.closeAllSelectors(this);
                        }
                        this.open();
                    }
                    e.stopPropagation();
                }
            }
            else if (this.prevYearBtn && target.closest('.mes-prev-year')) {
                this.prevYear();
            }
            else if (this.nextYearBtn && target.closest('.mes-next-year')) {
                this.nextYear();
            }
            else if (this.todayBtn && target.closest('.mes-today-btn')) {
                this.selectToday();
            }
            else if (this.clearBtn && target.closest('.mes-clear-btn')) {
                this.clear();
            }
            else if (target.closest('.mes-grid-btn')) {
                const btn = target.closest('.mes-grid-btn');
                if (!btn.disabled) {
                    const month = parseInt(btn.dataset.month);
                    this.selectMonth(month);
                }
            }
        };
        
        // Guardar referencia para remover después
        this._clickHandler = clickHandler;
        this.container.addEventListener('click', clickHandler);
        
        // Form reset
        const form = this.input.closest('form');
        if (form) {
            const resetHandler = () => {
                setTimeout(() => this.clear(), 0);
            };
            this._formResetHandler = resetHandler;
            form.addEventListener('reset', resetHandler);
        }
        if (this.isTouchDevice) {
            this.setupTouchEvents();
        }
    }
    
    setupTouchEvents() {
        // Configurar eventos táctiles para botones
        const setupButtonTouch = (button) => {
            if (!button) return;
            
            button.addEventListener('touchstart', (e) => {
                if (this.isTouchDevice) {
                    button.classList.add('active-touch');
                    e.preventDefault();
                }
            });
            
            button.addEventListener('touchend', (e) => {
                if (this.isTouchDevice) {
                    button.classList.remove('active-touch');
                    
                    // Para iOS, resetear estilos
                    if (this.isIOS) {
                        button.classList.add('ios-touch');
                        setTimeout(() => {
                            button.classList.remove('ios-touch');
                        }, 300);
                    }
                }
            });
            
            button.addEventListener('touchcancel', (e) => {
                if (this.isTouchDevice) {
                    button.classList.remove('active-touch', 'ios-touch');
                }
            });
        };
        
        // Aplicar a todos los botones relevantes
        [this.prevYearBtn, this.nextYearBtn, this.todayBtn, this.clearBtn].forEach(setupButtonTouch);
        
        // Para botones de mes (delegación de eventos)
        this.monthsGrid.addEventListener('touchstart', (e) => {
            const btn = e.target.closest('.mes-grid-btn');
            if (btn && this.isTouchDevice) {
                btn.classList.add('active-touch');
                e.preventDefault();
            }
        });
        
        this.monthsGrid.addEventListener('touchend', (e) => {
            const btn = e.target.closest('.mes-grid-btn');
            if (btn && this.isTouchDevice) {
                btn.classList.remove('active-touch');
                
                if (this.isIOS) {
                    btn.classList.add('ios-touch');
                    setTimeout(() => {
                        btn.classList.remove('ios-touch');
                    }, 300);
                }
            }
        });
    }

    removeEvents() {
        // Remover listeners del contenedor
        if (this._clickHandler) {
            this.container.removeEventListener('click', this._clickHandler);
            this._clickHandler = null;
        }
        
        // Remover listeners del formulario
        if (this._formResetHandler) {
            const form = this.input.closest('form');
            if (form) {
                form.removeEventListener('reset', this._formResetHandler);
            }
            this._formResetHandler = null;
        }
        
        // Remover overlay
        this.removeOverlay();
    }
    
    positionOptions() {
        if (!this.isOpen) return;
        
        if (this.isMobile && this.config.mobileOverlay) {
            this.options.style.position = 'fixed';
            //this.options.style.top = '50%';
            //this.options.style.left = '50%';
            this.options.style.animation = 'mesSlideDownMobile 0.2s ease-out forwards';
            this.options.style.transform = 'translate(-50%, -50%)';
            this.options.style.width = '90vw';
            this.options.style.maxWidth = '320px';

            // Para iOS, ajustar la posición para evitar que se abra donde se tocó
            if (this.isIOS()) {
                // Calcular posición segura (no exactamente donde se tocó)
                const viewportHeight = window.innerHeight;
                const selectorHeight = this.options.offsetHeight;
                const safeTop = Math.max(20, (viewportHeight - selectorHeight) / 2);
                
                this.options.style.top = `${safeTop}px`;
                this.options.style.transform = 'translate(-50%, 0)';
            }
        } else {
            this.options.style.position = 'absolute';
            this.options.style.top = 'calc(100% + 8px)';
            this.options.style.left = '0';
            this.options.style.transform = 'none';
            this.options.style.width = '320px';
        }
    }
    
    isMonthDisabled(year, month) {
        if (this.minDate && (year < this.minDate.year || 
            (year === this.minDate.year && month < this.minDate.month))) {
            return true;
        }
        
        if (this.maxDate && (year > this.maxDate.year || 
            (year === this.maxDate.year && month > this.maxDate.month))) {
            return true;
        }
        
        return false;
    }
    
    renderMonths() {
        this.yearElement.textContent = this.currentYear;
        this.monthsGrid.innerHTML = '';
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        
        if (this.prevYearBtn) {
            this.prevYearBtn.disabled = this.currentYear <= this.config.minYear;
        }
        if (this.nextYearBtn) {
            this.nextYearBtn.disabled = this.currentYear >= this.config.maxYear;
        }
        
        this.meses.forEach((monthName, index) => {
            const monthNum = index + 1;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'mes-grid-btn';
            button.textContent = monthName;
            button.dataset.month = monthNum;
            
            if (this.currentYear === currentYear && monthNum === currentMonth) {
                button.classList.add('today');
            }
            
            if (this.selectedYear === this.currentYear && this.selectedMonth === monthNum) {
                button.classList.add('selected');
            }
            
            if (this.isMonthDisabled(this.currentYear, monthNum)) {
                button.disabled = true;
                button.classList.add('disabled');
            }
            
            this.monthsGrid.appendChild(button);
        });
    }
    
    prevYear() {
        if (this.currentYear > this.config.minYear) {
            this.currentYear--;
            this.renderMonths();
        }
    }
    
    nextYear() {
        if (this.currentYear < this.config.maxYear) {
            this.currentYear++;
            this.renderMonths();
        }
    }
    
    selectMonth(month) {
        if (this.isMonthDisabled(this.currentYear, month)) {
            return;
        }
        
        this.selectedYear = this.currentYear;
        this.selectedMonth = month;
        
        const displayText = `${this.meses[month - 1]} ${this.config.locale === 'es' ? 'de' : ' '} ${this.selectedYear}`;
        this.selectedValue.textContent = displayText;
        this.container.classList.add('has-value');
        
        const monthStr = month.toString().padStart(2, '0');
        const value = `${this.selectedYear}-${monthStr}`;
        this.input.value = value;
        
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        
        if (typeof this.config.onChange === 'function') {
            this.config.onChange(value, this.getDate());
        }
        
        this.close();
        this.renderMonths();
    }
    
    selectToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        
        if (this.isMonthDisabled(year, month)) {
            return;
        }
        
        this.currentYear = year;
        this.selectMonth(month);
    }
    
    open() {
        if (this.isOpen || this.config.disabled) return;
        
        if (this.config.autoCloseOtherSelectors) {
            MesSelectorManager.closeAllSelectors(this);
        }
        
        this.isOpen = true;
        this.header.classList.add('active');
        this.options.classList.add('show');
        
        currentlyOpenSelector = this;
        
        if (this.selectedYear) {
            this.currentYear = this.selectedYear;
        } else {
            this.currentYear = new Date().getFullYear();
        }
        
        this.renderMonths();
        
        if (this.isMobile && this.config.mobileOverlay) {
            this.createOverlay();
            this.overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            // Para iOS, agregar clase al body
            if (this.isIOS) {
                document.body.classList.add('mes-selector-open');
            }
        }
        
        this.positionOptions();
        
        // Forzar reflow en iOS para prevenir problemas visuales
        if (this.isIOS()) {
            void this.options.offsetWidth;
            
            // Pequeño delay para asegurar que iOS procese los estilos
            setTimeout(() => {
                this.positionOptions();
            }, 10);
        }

        if (typeof this.config.onOpen === 'function') {
            this.config.onOpen();
        }
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.header.classList.remove('active');
        this.options.classList.remove('show');
        
        if (currentlyOpenSelector === this) {
            currentlyOpenSelector = null;
        }
        
        this.removeOverlay();
        document.body.style.overflow = '';
        if (this.isIOS) {
            document.body.classList.remove('mes-selector-open');
        }
        
        if (typeof this.config.onClose === 'function') {
            this.config.onClose();
        }
    }
    
    clear() {
        this.selectedYear = null;
        this.selectedMonth = null;
        this.input.value = '';
        this.container.classList.remove('has-value');
        this.container.classList.remove('error');
        
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
        this.input.dispatchEvent(new Event('input', { bubbles: true }));
        
        if (typeof this.config.onChange === 'function') {
            this.config.onChange('', null);
        }
        
        this.renderMonths();
    }
    
    // API PÚBLICA
    
    setValue(value) {
        if (!value) {
            this.clear();
            return this;
        }
        
        const match = value.match(/^(\d{4})-(\d{2})/);
        if (!match) {
            console.error('MesSelector: Formato inválido. Use YYYY-MM');
            return this;
        }
        
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        
        if (month < 1 || month > 12) {
            console.error('MesSelector: Mes inválido');
            return this;
        }
        
        if (this.isMonthDisabled(year, month)) {
            console.error('MesSelector: El mes seleccionado está fuera del rango permitido');
            return this;
        }
        
        this.selectedYear = year;
        this.selectedMonth = month;
        this.currentYear = year;
        
        const displayText = `${this.meses[month - 1]} ${this.config.locale === 'es' ? 'de' : ' '} ${year}`;
        this.selectedValue.textContent = displayText;
        this.container.classList.add('has-value');
        
        const monthStr = month.toString().padStart(2, '0');
        this.input.value = `${year}-${monthStr}`;
        
        this.renderMonths();
        
        if (typeof this.config.onChange === 'function') {
            this.config.onChange(this.input.value, this.getDate());
        }
        
        return this;
    }
    
    getValue() {
        return this.input.value;
    }
    
    getDisplayValue() {
        if (!this.selectedYear || !this.selectedMonth) return '';
        return `${this.meses[this.selectedMonth - 1]} de ${this.selectedYear}`;
    }
    
    getDate() {
        if (!this.selectedYear || !this.selectedMonth) return null;
        return new Date(this.selectedYear, this.selectedMonth - 1, 1);
    }
    
    getYearMonth() {
        if (!this.selectedYear || !this.selectedMonth) return null;
        return { year: this.selectedYear, month: this.selectedMonth };
    }
    
    disable() {
        this.config.disabled = true;
        this.header.style.opacity = '0.6';
        this.header.style.cursor = 'not-allowed';
        this.input.disabled = true;
        this.close();
    }
    
    enable() {
        this.config.disabled = false;
        this.header.style.opacity = '1';
        this.header.style.cursor = 'pointer';
        this.input.disabled = false;
    }
    
    isValid() {
        return !!this.input.value && this.input.validity.valid;
    }
    
    showError(message) {
        this.container.classList.add('error');
        
        let validationMsg = this.container.nextElementSibling;
        if (!validationMsg || !validationMsg.classList.contains('mes-validation-message')) {
            validationMsg = document.createElement('div');
            validationMsg.className = 'mes-validation-message';
            this.container.parentNode.insertBefore(validationMsg, this.container.nextSibling);
        }
        
        validationMsg.textContent = message;
        validationMsg.style.display = 'block';
    }
    
    hideError() {
        this.container.classList.remove('error');
        
        const validationMsg = this.container.nextElementSibling;
        if (validationMsg && validationMsg.classList.contains('mes-validation-message')) {
            validationMsg.style.display = 'none';
        }
    }
    
    destroy() {
        this.close();
        this.removeEvents();
        
        // Remover de arrays globales
        const instanceIndex = MesSelectorInstances.indexOf(this);
        if (instanceIndex > -1) {
            MesSelectorInstances.splice(instanceIndex, 1);
        }
        
        if (window._mesSelectors) {
            const windowIndex = window._mesSelectors.indexOf(this);
            if (windowIndex > -1) {
                window._mesSelectors.splice(windowIndex, 1);
            }
        }
        
        if (currentlyOpenSelector === this) {
            currentlyOpenSelector = null;
        }
        
        // Limpiar referencias DOM
        this.container.innerHTML = '';
        this.container.className = '';
        
        this.header = null;
        this.options = null;
        this.yearElement = null;
        this.monthsGrid = null;
        this.prevYearBtn = null;
        this.nextYearBtn = null;
        this.todayBtn = null;
        this.clearBtn = null;
        this.selectedValue = null;
        this.input = null;
        this.container = null;
    }
    
    // Método para SPA cleanup
    refresh() {
        // Verificar si los elementos DOM aún existen
        const container = document.getElementById(this.containerId);
        const input = document.getElementById(this.inputId);
        
        if (!container || !input) {
            console.warn('MesSelector: Elementos DOM no encontrados, destruyendo instancia');
            this.destroy();
            return false;
        }
        
        // Si los elementos existen pero son diferentes
        if (container !== this.container || input !== this.input) {
            console.warn('MesSelector: Elementos DOM cambiaron, reinicializando');
            this.container = container;
            this.input = input;
            this.removeEvents();
            this.init();
            this.attachEvents();
            return true;
        }
        
        return true;
    }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.MesSelector = MesSelector;
    window.MesSelectorManager = MesSelectorManager;
    
    // Función de cleanup para SPA
    window.cleanupMesSelectors = function() {
        MesSelectorManager.destroyAll();
    };
    
    // Auto-cleanup si la página se descarga (útil para SPA)
    window.addEventListener('beforeunload', function() {
        cleanupMesSelectors();
    });
}
