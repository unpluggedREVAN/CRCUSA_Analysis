# Pruebas de Integración - CRCUSA

Este documento explica cómo ejecutar las pruebas de integración del sistema CRCUSA.

## Requisitos Previos

- Node.js instalado (versión 16 o superior)
- Acceso a la base de datos Firebase configurada

## Instalación de Dependencias

Antes de ejecutar las pruebas, asegúrate de tener las dependencias de Firebase instaladas:

```bash
npm install
```

## Ejecución de las Pruebas

### Método 1: Ejecución Directa

```bash
node integrationTests.js
```

### Método 2: Script de NPM

Puedes agregar el siguiente script en tu `package.json`:

```json
"scripts": {
  "test:integration": "node integrationTests.js"
}
```

Y luego ejecutar:

```bash
npm run test:integration
```

## Casos de Prueba (23 Total)

### Contactos (4 casos)
1. ✓ Crear contacto
2. ✓ Listar contactos
3. ✓ Obtener contacto por ID
4. ✓ Actualizar contacto

### Empresas (4 casos)
5. ✓ Crear empresa
6. ✓ Listar empresas
7. ✓ Obtener empresa por ID
8. ✓ Actualizar empresa

### Campañas (4 casos)
9. ✓ Crear campaña
10. ✓ Listar campañas
11. ✓ Obtener campaña por ID
12. ✓ Actualizar estado de destinatario

### Notas (4 casos)
13. ✓ Crear nota
14. ✓ Crear segunda nota
15. ✓ Listar notas
16. ✓ Actualizar posición de nota

### Conexiones (3 casos)
17. ✓ Crear conexión entre notas
18. ✓ Listar conexiones
19. ✓ Buscar conexiones por nota origen

### Afiliados (3 casos)
20. ✓ Crear afiliado
21. ✓ Listar afiliados
22. ✓ Actualizar métricas de afiliado

### Patrocinadores (1 caso)
23. ✓ Crear patrocinador

## Interpretación de Resultados

El script mostrará resultados en tiempo real con colores:

- **Verde (✓)**: Prueba exitosa (OK)
- **Rojo (✗)**: Prueba fallida (ERROR)
- **Amarillo**: Información general

### Ejemplo de Salida Exitosa

```
============================================================
PRUEBAS DE INTEGRACIÓN FIRESTORE - CRCUSA
============================================================

📋 PRUEBAS DE CONTACTOS

✓ Caso 1: Crear contacto
✓ Caso 2: Listar contactos
✓ Caso 3: Obtener contacto por ID
✓ Caso 4: Actualizar contacto

...

============================================================
RESUMEN DE PRUEBAS
============================================================

Total de pruebas: 23
Exitosas: 23
Fallidas: 0
Tasa de éxito: 100.00%

¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! ✓
```

## Limpieza Automática

El script incluye limpieza automática que:
- Elimina todos los datos de prueba creados
- Se ejecuta después de completar todas las pruebas
- Muestra confirmación de cada elemento eliminado

## Características del Script

- **Independiente**: No requiere frontend, se ejecuta completamente en backend
- **Autónomo**: Crea, prueba y limpia sus propios datos
- **Detallado**: Muestra cada paso con colores y símbolos claros
- **Robusto**: Maneja errores y continúa con las demás pruebas
- **Resumen completo**: Al final muestra estadísticas y detalles

## Solución de Problemas

### Error: Cannot find module 'firebase/app'

Ejecuta:
```bash
npm install firebase
```

### Error de conexión a Firebase

Verifica que las credenciales en `integrationTests.js` sean correctas y que tengas acceso a internet.

### Pruebas fallan aleatoriamente

Esto puede deberse a:
- Problemas de red
- Límites de tasa de Firebase
- Permisos de seguridad en Firestore

Intenta ejecutar las pruebas nuevamente después de unos minutos.

## Notas Importantes

1. Las pruebas se conectan a la base de datos de producción
2. Todos los datos de prueba son limpiados automáticamente
3. Los documentos de prueba tienen nombres que comienzan con "Test" o "Integration"
4. El script termina con código de salida 0 si todas las pruebas pasan, 1 si hay fallos

## Contacto

Para problemas o preguntas sobre las pruebas, contacta al equipo de desarrollo.
