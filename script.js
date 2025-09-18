// Sticky score display logic
window.addEventListener('DOMContentLoaded', function() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if (!scoreDisplay) return;
    const stickyOffset = scoreDisplay.offsetTop;
    function handleStickyScore() {
        if (window.scrollY > stickyOffset) {
            scoreDisplay.classList.add('sticky');
        } else {
            scoreDisplay.classList.remove('sticky');
        }
    }
    window.addEventListener('scroll', handleStickyScore);

    // Ensure sticky bar always shows up-to-date info
    const currentScoreSpan = document.getElementById('currentScore');
    const observer = new MutationObserver(() => {
        // No-op: the sticky bar is the same element, so it always shows the info
    });
    if (currentScoreSpan) {
        observer.observe(currentScoreSpan, { childList: true });
    }
});
class ProjectEvaluator {
    constructor() {
        this.maxScore = 5.0;
        this.currentScore = 5.0;
        this.criteria = {
            tildes: { penalty: 0.1, current: 0 },
            englishWords: { penalty: 0.1, current: 0 },
                nonFunctional: { penalty: 0.1, current: 0 },
                hasLogo: { penalty: 0.1, current: true },
            hasCustomTitle: { penalty: 0.1, current: true },
            hasFavicon: { penalty: 0.1, current: true },
                hasCustomBackground: { penalty: 0.3, current: true },
            loginWorks: { penalty: 0.5, current: true },
            registerWorks: { penalty: 0.5, current: true },
            wrongFieldTypes: { penalty: 0.1, current: 0 },
            // Funcionalidades usuario
            listarUsuario: { penalty: 0.35, current: true },
            crearUsuario: { penalty: 0.35, current: true },
            actualizarUsuario: { penalty: 0.35, current: true },
            eliminarUsuario: { penalty: 0.35, current: true },
            buscarUsuario: { penalty: 0.35, current: true },
            // Módulo 2
            listarModulo2: { penalty: 0.35, current: true },
            crearModulo2: { penalty: 0.35, current: true },
            actualizarModulo2: { penalty: 0.35, current: true },
            eliminarModulo2: { penalty: 0.35, current: true },
            buscarModulo2: { penalty: 0.35, current: true }
        };
        
        this.initializeEventListeners();
        this.updateScore();
    }

    initializeEventListeners() {
        // Eventos para inputs numéricos
        const numberInputs = ['tildes', 'englishWords', 'nonFunctional', 'wrongFieldTypes'];
        numberInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.criteria[id].current = parseInt(input.value) || 0;
                    this.updateScore();
                });
            }
        });

        // Eventos para checkboxes (incluyendo funcionalidades usuario y módulo 2)
        const checkboxes = [
            'hasLogo', 'hasCustomTitle', 'hasFavicon', 'hasCustomBackground',
            'loginWorks', 'registerWorks',
            'listarUsuario', 'crearUsuario', 'actualizarUsuario', 'eliminarUsuario', 'buscarUsuario',
            'listarModulo2', 'crearModulo2', 'actualizarModulo2', 'eliminarModulo2', 'buscarModulo2'
        ];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.criteria[id].current = checkbox.checked;
                    this.updateScore();
                });
            }
        });

        // Eventos para botones
        document.getElementById('resetBtn').addEventListener('click', () => this.resetEvaluation());
        document.getElementById('configBtn').addEventListener('click', () => this.openConfigModal());
        document.getElementById('generateReportBtn').addEventListener('click', () => this.generateReport());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveEvaluation());
        document.getElementById('copyReportBtn').addEventListener('click', () => this.copyReport());
        document.getElementById('downloadReportBtn').addEventListener('click', () => this.downloadReport());

        // Eventos para modales
        const reportModal = document.getElementById('reportModal');
        const configModal = document.getElementById('configModal');
        const closeBtn = document.querySelector('.close');
        const closeConfigBtn = document.querySelector('.close-config');
        
        closeBtn.addEventListener('click', () => {
            reportModal.style.display = 'none';
        });

        closeConfigBtn.addEventListener('click', () => {
            configModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === reportModal) {
                reportModal.style.display = 'none';
            }
            if (event.target === configModal) {
                configModal.style.display = 'none';
            }
        });

        // Eventos para configuración
        document.getElementById('saveConfigBtn').addEventListener('click', () => this.saveConfiguration());
        document.getElementById('downloadTodayLogBtn').addEventListener('click', () => this.downloadTodayLog());
        document.getElementById('clearTodayLogBtn').addEventListener('click', () => this.clearTodayLog());
    }

    updateScore() {
        let totalDeduction = 0;

        // Calcular deducciones

        const deductions = {
            tildes: this.criteria.tildes.current * this.criteria.tildes.penalty,
            english: this.criteria.englishWords.current * this.criteria.englishWords.penalty,
                nonFunctional: this.criteria.nonFunctional.current * 0.1,
            logo: this.criteria.hasLogo.current ? 0 : this.criteria.hasLogo.penalty,
            title: this.criteria.hasCustomTitle.current ? 0 : this.criteria.hasCustomTitle.penalty,
            favicon: this.criteria.hasFavicon.current ? 0 : this.criteria.hasFavicon.penalty,
            background: this.criteria.hasCustomBackground.current ? 0 : this.criteria.hasCustomBackground.penalty,
            login: this.criteria.loginWorks.current ? 0 : this.criteria.loginWorks.penalty,
            register: this.criteria.registerWorks.current ? 0 : this.criteria.registerWorks.penalty,
            fieldTypes: this.criteria.wrongFieldTypes.current * this.criteria.wrongFieldTypes.penalty,
            listarUsuario: this.criteria.listarUsuario.current ? 0 : this.criteria.listarUsuario.penalty,
            crearUsuario: this.criteria.crearUsuario.current ? 0 : this.criteria.crearUsuario.penalty,
            actualizarUsuario: this.criteria.actualizarUsuario.current ? 0 : this.criteria.actualizarUsuario.penalty,
            eliminarUsuario: this.criteria.eliminarUsuario.current ? 0 : this.criteria.eliminarUsuario.penalty,
            buscarUsuario: this.criteria.buscarUsuario.current ? 0 : this.criteria.buscarUsuario.penalty,
            listarModulo2: this.criteria.listarModulo2.current ? 0 : this.criteria.listarModulo2.penalty,
            crearModulo2: this.criteria.crearModulo2.current ? 0 : this.criteria.crearModulo2.penalty,
            actualizarModulo2: this.criteria.actualizarModulo2.current ? 0 : this.criteria.actualizarModulo2.penalty,
            eliminarModulo2: this.criteria.eliminarModulo2.current ? 0 : this.criteria.eliminarModulo2.penalty,
            buscarModulo2: this.criteria.buscarModulo2.current ? 0 : this.criteria.buscarModulo2.penalty
        };

        // Actualizar displays de deducciones
        document.getElementById('tildesDeduction').textContent = deductions.tildes.toFixed(2);
        document.getElementById('englishDeduction').textContent = deductions.english.toFixed(2);
        document.getElementById('nonFunctionalDeduction').textContent = deductions.nonFunctional.toFixed(2);
        document.getElementById('logoDeduction').textContent = deductions.logo.toFixed(2);
        document.getElementById('titleDeduction').textContent = deductions.title.toFixed(2);
        document.getElementById('faviconDeduction').textContent = deductions.favicon.toFixed(2);
        document.getElementById('backgroundDeduction').textContent = deductions.background.toFixed(2);
        document.getElementById('loginDeduction').textContent = deductions.login.toFixed(2);
        document.getElementById('registerDeduction').textContent = deductions.register.toFixed(2);
        document.getElementById('fieldTypeDeduction').textContent = deductions.fieldTypes.toFixed(2);
        document.getElementById('listarUsuarioDeduction').textContent = deductions.listarUsuario.toFixed(2);
        document.getElementById('crearUsuarioDeduction').textContent = deductions.crearUsuario.toFixed(2);
        document.getElementById('actualizarUsuarioDeduction').textContent = deductions.actualizarUsuario.toFixed(2);
        document.getElementById('eliminarUsuarioDeduction').textContent = deductions.eliminarUsuario.toFixed(2);
        document.getElementById('buscarUsuarioDeduction').textContent = deductions.buscarUsuario.toFixed(2);
        document.getElementById('listarModulo2Deduction').textContent = deductions.listarModulo2.toFixed(2);
        document.getElementById('crearModulo2Deduction').textContent = deductions.crearModulo2.toFixed(2);
        document.getElementById('actualizarModulo2Deduction').textContent = deductions.actualizarModulo2.toFixed(2);
        document.getElementById('eliminarModulo2Deduction').textContent = deductions.eliminarModulo2.toFixed(2);
        document.getElementById('buscarModulo2Deduction').textContent = deductions.buscarModulo2.toFixed(2);

        // Calcular puntuación total
        totalDeduction = Object.values(deductions).reduce((sum, deduction) => sum + deduction, 0);
        this.currentScore = Math.max(0, this.maxScore - totalDeduction);

        // Actualizar display de puntuación
        const scoreElement = document.getElementById('currentScore');
    scoreElement.textContent = this.currentScore.toFixed(2);
        
        // Animación de cambio de puntuación
        scoreElement.parentElement.classList.add('score-change');
        setTimeout(() => {
            scoreElement.parentElement.classList.remove('score-change');
        }, 600);

        // Cambiar color basado en la puntuación
        if (this.currentScore >= 4.5) {
            scoreElement.style.color = '#28a745'; // Verde
        } else if (this.currentScore >= 3.5) {
            scoreElement.style.color = '#ffc107'; // Amarillo
        } else {
            scoreElement.style.color = '#dc3545'; // Rojo
        }

        // Actualizar estado visual de criterios
        this.updateCriteriaVisualState();
    }

    updateCriteriaVisualState() {
        const criteriaElements = document.querySelectorAll('.criterion');
        criteriaElements.forEach(element => {
            element.classList.remove('success', 'error');
            
            const deductionElement = element.querySelector('.deduction span');
            const deduction = parseFloat(deductionElement.textContent);
            
            if (deduction > 0) {
                element.classList.add('error');
            } else {
                element.classList.add('success');
            }
        });
    }

    resetEvaluation() {
        if (confirm('¿Está seguro de que desea reiniciar la evaluación? Se perderán todos los datos ingresados.')) {
            // Reiniciar inputs numéricos
            ['tildes', 'englishWords', 'nonFunctional', 'wrongFieldTypes'].forEach(id => {
                document.getElementById(id).value = 0;
                this.criteria[id].current = 0;
            });

            // Reiniciar checkboxes
            ['hasLogo', 'hasCustomTitle', 'hasFavicon', 'hasCustomBackground', 'loginWorks', 'registerWorks'].forEach(id => {
                document.getElementById(id).checked = true;
                this.criteria[id].current = true;
            });

            // Limpiar campos de información
            document.getElementById('studentName').value = '';
            document.getElementById('projectUrl').value = '';
            document.getElementById('comments').value = '';

            this.updateScore();
            
            // Mostrar mensaje de confirmación
            this.showNotification('Evaluación reiniciada correctamente', 'success');
        }
    }

    generateReport() {
        const studentName = document.getElementById('studentName').value || 'No especificado';
        const projectUrl = document.getElementById('projectUrl').value || 'No especificado';
        const comments = document.getElementById('comments').value || 'Sin comentarios adicionales';
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let report = `
═══════════════════════════════════════════════════════════════
                    REPORTE DE EVALUACIÓN
                 Primera Entrega - Login y Register
═══════════════════════════════════════════════════════════════

INFORMACIÓN DEL PROYECTO:
▶ Estudiante: ${studentName}
▶ URL del Proyecto: ${projectUrl}
▶ Fecha de Evaluación: ${currentDate}

PUNTUACIÓN FINAL: ${this.currentScore.toFixed(1)} / ${this.maxScore} puntos

═══════════════════════════════════════════════════════════════
                      DESGLOSE DETALLADO
═══════════════════════════════════════════════════════════════

1. ASPECTOS DE CONTENIDO Y FORMATO:
   • Tildes faltantes: ${this.criteria.tildes.current} (-${(this.criteria.tildes.current * this.criteria.tildes.penalty).toFixed(1)} puntos)
   • Palabras en inglés: ${this.criteria.englishWords.current} (-${(this.criteria.englishWords.current * this.criteria.englishWords.penalty).toFixed(1)} puntos)
   • Campos con formato incorrecto: ${this.criteria.wrongFieldTypes.current} (-${(this.criteria.wrongFieldTypes.current * this.criteria.wrongFieldTypes.penalty).toFixed(1)} puntos)

2. ELEMENTOS DE DISEÑO:
   • Logo del proyecto: ${this.criteria.hasLogo.current ? '✓ Presente' : '✗ Ausente'} ${!this.criteria.hasLogo.current ? `(-${this.criteria.hasLogo.penalty} puntos)` : ''}
   • Título personalizado: ${this.criteria.hasCustomTitle.current ? '✓ Presente' : '✗ Ausente'} ${!this.criteria.hasCustomTitle.current ? `(-${this.criteria.hasCustomTitle.penalty} puntos)` : ''}
   • Favicon personalizado: ${this.criteria.hasFavicon.current ? '✓ Presente' : '✗ Ausente'} ${!this.criteria.hasFavicon.current ? `(-${this.criteria.hasFavicon.penalty} puntos)` : ''}
   • Diseño personalizado: ${this.criteria.hasCustomBackground.current ? '✓ Presente' : '✗ Fondo de plantilla'} ${!this.criteria.hasCustomBackground.current ? `(-${this.criteria.hasCustomBackground.penalty} puntos)` : ''}

3. FUNCIONALIDAD (CRÍTICO):
   • Funcionalidad de Login: ${this.criteria.loginWorks.current ? '✓ Funciona' : '✗ No funciona'} ${!this.criteria.loginWorks.current ? `(-${this.criteria.loginWorks.penalty} puntos)` : ''}
   • Funcionalidad de Registro: ${this.criteria.registerWorks.current ? '✓ Funciona' : '✗ No funciona'} ${!this.criteria.registerWorks.current ? `(-${this.criteria.registerWorks.penalty} puntos)` : ''}

4. EXPERIENCIA DE USUARIO:
   • Elementos sin funcionalidad: ${this.criteria.nonFunctional.current} (-${(this.criteria.nonFunctional.current * this.criteria.nonFunctional.penalty).toFixed(1)} puntos)

═══════════════════════════════════════════════════════════════
                         RESUMEN
═══════════════════════════════════════════════════════════════

Puntuación base: ${this.maxScore} puntos
Total de deducciones: -${(this.maxScore - this.currentScore).toFixed(1)} puntos
PUNTUACIÓN FINAL: ${this.currentScore.toFixed(1)} puntos

ESTADO: ${this.getGradeStatus()}

COMENTARIOS ADICIONALES:
${comments}

═══════════════════════════════════════════════════════════════
Reporte generado automáticamente por el Sistema de Evaluación
Web 2 - Universidad [Nombre de la Institución]
═══════════════════════════════════════════════════════════════
        `;

        document.getElementById('reportContent').textContent = report;
        document.getElementById('reportModal').style.display = 'block';
    }

    getGradeStatus() {
        if (this.currentScore >= 4.5) {
            return 'EXCELENTE - Proyecto cumple con todos los criterios principales';
        } else if (this.currentScore >= 4.0) {
            return 'BUENO - Proyecto cumple con la mayoría de criterios';
        } else if (this.currentScore >= 3.5) {
            return 'SATISFACTORIO - Proyecto necesita mejoras menores';
        } else if (this.currentScore >= 3.0) {
            return 'REGULAR - Proyecto necesita mejoras significativas';
        } else {
            return 'INSUFICIENTE - Proyecto requiere revisión completa';
        }
    }

    copyReport() {
        const reportContent = document.getElementById('reportContent').textContent;
        navigator.clipboard.writeText(reportContent).then(() => {
            this.showNotification('Reporte copiado al portapapeles', 'success');
        }).catch(() => {
            this.showNotification('Error al copiar el reporte', 'error');
        });
    }

    downloadReport() {
        const studentName = document.getElementById('studentName').value || 'Estudiante';
        const reportContent = document.getElementById('reportContent').textContent;
        const currentDate = new Date().toISOString().split('T')[0];
        
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Evaluacion_${studentName.replace(/\s+/g, '_')}_${currentDate}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Reporte descargado correctamente', 'success');
    }

    saveEvaluation() {
        const evaluationData = {
            studentName: document.getElementById('studentName').value,
            projectUrl: document.getElementById('projectUrl').value,
            score: this.currentScore,
            criteria: this.criteria,
            comments: document.getElementById('comments').value,
            timestamp: new Date().toISOString()
        };

        // Guardar en localStorage
        const savedEvaluations = JSON.parse(localStorage.getItem('projectEvaluations') || '[]');
        savedEvaluations.push(evaluationData);
        localStorage.setItem('projectEvaluations', JSON.stringify(savedEvaluations));

        // Opción: Auto-descargar log de evaluaciones
        this.autoDownloadLog(evaluationData);

        this.showNotification('Evaluación guardada correctamente', 'success');
    }

    autoDownloadLog(evaluationData) {
        // Verificar si el usuario quiere auto-descarga (configuración)
        const autoDownload = localStorage.getItem('autoDownloadEnabled') === 'true';
        
        if (autoDownload) {
            const logEntry = this.generateLogEntry(evaluationData);
            const fileName = `evaluaciones_log_${new Date().toISOString().split('T')[0]}.txt`;
            
            // Obtener log existente del día o crear nuevo
            const existingLog = localStorage.getItem('dailyLog') || '';
            const updatedLog = existingLog + logEntry + '\n';
            
            // Guardar log actualizado
            localStorage.setItem('dailyLog', updatedLog);
            
            // Auto-descargar archivo actualizado
            const blob = new Blob([updatedLog], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    generateLogEntry(evaluationData) {
        const timestamp = new Date().toLocaleString('es-ES');
        return `
[${timestamp}] EVALUACIÓN GUARDADA
Estudiante: ${evaluationData.studentName || 'N/A'}
URL: ${evaluationData.projectUrl || 'N/A'}
Puntuación: ${evaluationData.score.toFixed(1)}/5.0
Estado: ${this.getGradeStatus()}
Comentarios: ${evaluationData.comments || 'Sin comentarios'}
${'='.repeat(60)}`;
    }

    loadSavedEvaluations() {
        const savedEvaluations = JSON.parse(localStorage.getItem('projectEvaluations') || '[]');
        return savedEvaluations;
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Método para exportar datos a CSV
    exportToCSV() {
        const evaluations = this.loadSavedEvaluations();
        if (evaluations.length === 0) {
            this.showNotification('No hay evaluaciones guardadas para exportar', 'error');
            return;
        }

        const csvHeader = 'Estudiante,URL,Puntuación,Tildes,Palabras en Inglés,Sin Funcionalidad,Logo,Título,Favicon,Diseño,Login,Registro,Campos,Comentarios,Fecha\n';
        const csvData = evaluations.map(evaluation => {
            return [
                evaluation.studentName || '',
                evaluation.projectUrl || '',
                evaluation.score,
                evaluation.criteria.tildes.current,
                evaluation.criteria.englishWords.current,
                evaluation.criteria.nonFunctional.current,
                evaluation.criteria.hasLogo.current ? 'Sí' : 'No',
                evaluation.criteria.hasCustomTitle.current ? 'Sí' : 'No',
                evaluation.criteria.hasFavicon.current ? 'Sí' : 'No',
                evaluation.criteria.hasCustomBackground.current ? 'Sí' : 'No',
                evaluation.criteria.loginWorks.current ? 'Sí' : 'No',
                evaluation.criteria.registerWorks.current ? 'Sí' : 'No',
                evaluation.criteria.wrongFieldTypes.current,
                `"${(evaluation.comments || '').replace(/"/g, '""')}"`,
                new Date(evaluation.timestamp).toLocaleDateString('es-ES')
            ].join(',');
        }).join('\n');

        const csvContent = csvHeader + csvData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Evaluaciones_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Datos exportados a CSV correctamente', 'success');
    }

    // Métodos para configuración
    openConfigModal() {
        this.updateConfigModal();
        document.getElementById('configModal').style.display = 'block';
    }

    updateConfigModal() {
        // Cargar configuración actual
        const autoDownloadEnabled = localStorage.getItem('autoDownloadEnabled') === 'true';
        document.getElementById('autoDownloadEnabled').checked = autoDownloadEnabled;

        // Actualizar información
        const evaluations = this.loadSavedEvaluations();
        document.getElementById('totalSavedEvaluations').textContent = evaluations.length;

        // Calcular espacio usado
        const storageUsed = this.calculateStorageUsed();
        document.getElementById('storageUsed').textContent = storageUsed;

        // Última evaluación
        const lastEvaluation = evaluations.length > 0 ? 
            new Date(evaluations[evaluations.length - 1].timestamp).toLocaleDateString('es-ES') : 
            'Nunca';
        document.getElementById('lastEvaluationDate').textContent = lastEvaluation;
    }

    calculateStorageUsed() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length;
            }
        }
        return `${(total / 1024).toFixed(1)} KB`;
    }

    saveConfiguration() {
        const autoDownloadEnabled = document.getElementById('autoDownloadEnabled').checked;
        localStorage.setItem('autoDownloadEnabled', autoDownloadEnabled.toString());
        
        document.getElementById('configModal').style.display = 'none';
        this.showNotification('Configuración guardada correctamente', 'success');
    }

    downloadTodayLog() {
        const todayLog = localStorage.getItem('dailyLog') || '';
        if (!todayLog.trim()) {
            this.showNotification('No hay registros del día actual', 'error');
            return;
        }

        const fileName = `log_evaluaciones_${new Date().toISOString().split('T')[0]}.txt`;
        const blob = new Blob([todayLog], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Log del día descargado correctamente', 'success');
    }

    clearTodayLog() {
        if (confirm('¿Está seguro de que desea limpiar el log del día actual?')) {
            localStorage.removeItem('dailyLog');
            this.showNotification('Log del día eliminado correctamente', 'success');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const evaluator = new ProjectEvaluator();
    
    // Hacer el evaluator disponible globalmente para debugging
    window.projectEvaluator = evaluator;
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        evaluator.showNotification('Sistema de evaluación cargado correctamente', 'success');
    }, 1000);
});

// Funciones adicionales para mejorar la experiencia del usuario

// Autoguardado cada 30 segundos
setInterval(() => {
    const studentName = document.getElementById('studentName')?.value;
    if (studentName && studentName.trim() !== '') {
        const autosaveData = {
            studentName: document.getElementById('studentName').value,
            projectUrl: document.getElementById('projectUrl').value,
            tildes: document.getElementById('tildes').value,
            englishWords: document.getElementById('englishWords').value,
            nonFunctional: document.getElementById('nonFunctional').value,
            wrongFieldTypes: document.getElementById('wrongFieldTypes').value,
            hasLogo: document.getElementById('hasLogo').checked,
            hasCustomTitle: document.getElementById('hasCustomTitle').checked,
            hasFavicon: document.getElementById('hasFavicon').checked,
            hasCustomBackground: document.getElementById('hasCustomBackground').checked,
            loginWorks: document.getElementById('loginWorks').checked,
            registerWorks: document.getElementById('registerWorks').checked,
            comments: document.getElementById('comments').value,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('currentEvaluation', JSON.stringify(autosaveData));
    }
}, 30000);

// Recuperar datos guardados al cargar la página
window.addEventListener('load', () => {
    const autosaveData = localStorage.getItem('currentEvaluation');
    if (autosaveData) {
        const data = JSON.parse(autosaveData);
        const timeDiff = new Date() - new Date(data.timestamp);
        
        // Solo recuperar si los datos son de las últimas 2 horas
        if (timeDiff < 2 * 60 * 60 * 1000) {
            if (confirm('Se encontraron datos de una evaluación anterior. ¿Desea recuperarlos?')) {
                Object.keys(data).forEach(key => {
                    if (key !== 'timestamp') {
                        const element = document.getElementById(key);
                        if (element) {
                            if (element.type === 'checkbox') {
                                element.checked = data[key];
                            } else {
                                element.value = data[key];
                            }
                            
                            // Disparar evento para actualizar la puntuación
                            element.dispatchEvent(new Event('input'));
                            element.dispatchEvent(new Event('change'));
                        }
                    }
                });
                
                window.projectEvaluator?.showNotification('Datos recuperados correctamente', 'success');
            }
        }
    }
});

// Advertencia antes de cerrar si hay datos sin guardar
window.addEventListener('beforeunload', (e) => {
    const studentName = document.getElementById('studentName')?.value;
    if (studentName && studentName.trim() !== '') {
        e.preventDefault();
        e.returnValue = '';
    }
});
