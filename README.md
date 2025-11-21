# Smart Parking IoT

Sistema de gestión de estacionamiento en tiempo real utilizando Arduino, NestJS (Backend) y React/Vite (Frontend).

## 🚀 Setup & Run

### Backend (NestJS)

El cerebro del sistema. Gestiona la conexión serial con el Arduino y emite eventos vía WebSocket.

1. Entrar al directorio:

    ```bash
    cd backend
    ```

2. Instalar dependencias:
    ```bash
    npm install
    ```
3. Iniciar servidor de desarrollo:
    ```bash
    npm run start:dev
    ```
    > El servidor iniciará en `http://localhost:3000` e intentará detectar el Arduino automáticamente.

### Frontend (React + Vite)

Interfaz de usuario para visualizar el estado del estacionamiento.

1.  Entrar al directorio:
    ```bash
    cd frontend
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Iniciar servidor de desarrollo:
    ```bash
    npm run dev
    ```
    > Accede a la aplicación en la URL que indique la consola (usualmente `http://localhost:5173`).

---

## ⚙️ Configuración (Backend)

Toda la configuración física y lógica se centraliza en un solo archivo. No requiere `.env` para el puerto serie.

**Ubicación:** `backend/src/sensor/config/sensors.config.ts`

### 1\. Puerto Serie (`SERIAL_CONFIG`)

Controla la conexión con el Arduino.

```typescript
export const SERIAL_CONFIG = {
    port: "AUTO", // 'AUTO' para detección inteligente o 'COMX' para fijo
    baudRate: 9600,
};
```

### 2\. Mapeo de Sensores (`SENSOR_MAPPING`)

Vincula los sensores físicos (ID enviado por Arduino) con las plazas visuales (UI).

```typescript
export const SENSOR_MAPPING = {
    // ID Sensor (Arduino) : { Configuración }
    2: {
        targetPlaza: 1, // ID de la plaza en el Frontend
        activo: true, // true = Procesar | false = Ignorar
    },
    3: { targetPlaza: 2, activo: false },
    // ... hasta el 11
};
```

---

## 🔌 Hardware (Arduino)

-   **Pines:** Se utilizan los pines digitales del **2 al 11**.
-   **Protocolo:** Envía JSON por Serial a 9600 baudios.
-   **Formato:** `{"sensor": X, "libre": true/false}`

<!-- end list -->
