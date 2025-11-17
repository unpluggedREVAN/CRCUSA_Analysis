#!/bin/bash

# Script de ejecucion de pruebas de integracion CRCUSA
# Uso: ./run-tests.sh o bash run-tests.sh

echo ""
echo "=========================================="
echo "  PRUEBAS DE INTEGRACION CRCUSA"
echo "=========================================="
echo ""
echo "Verificando dependencias..."

# Verificar si Node.js esta instalado
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no esta instalado"
    echo "Por favor instala Node.js desde https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js instalado: $(node --version)"

# Verificar si npm esta instalado
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm no esta instalado"
    exit 1
fi

echo "[OK] npm instalado: $(npm --version)"

# Verificar si las dependencias estan instaladas
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Error al instalar dependencias"
        exit 1
    fi
fi

echo ""
echo "Ejecutando pruebas de integracion..."
echo ""

# Ejecutar las pruebas
node integrationTests.js

# Capturar el codigo de salida
EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "[OK] Pruebas completadas exitosamente"
else
    echo "[ATENCION] Algunas pruebas fallaron (codigo de salida: $EXIT_CODE)"
fi

exit $EXIT_CODE
