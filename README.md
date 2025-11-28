# 💎 Coin-X Exchange - Plataforma de Trading Ficticia

Una plataforma interactiva de trading de criptomonedas construida con **Next.js**, **React**, **Tailwind CSS** y **Prisma**. Permite a los usuarios registrarse, crear cuentas de trading y simular la compra/venta de **Coin-X** con dinero ficticio.

## 🎯 Características Principales

- **👤 Autenticación Multi-usuario**: Registro e inicio de sesión con persistencia en base de datos
- **💰 Dashboard de Trading**: Panel principal con balance en USD y Coin-X
- **📊 Gráfico de Precios**: Visualización en tiempo real de cambios de precio
- **🔄 Trading Ejecutable**: Compra y venta de Coin-X con cálculos automáticos
- **📜 Historial de Transacciones**: Registro completo de todas las operaciones
- **🎨 Diseño Minimalista**: Interfaz dark mode con glassmorphism usando Tailwind CSS
- **🔐 Seguridad**: Cookies httpOnly y sesiones protegidas

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Next.js** | 16.0.0 | Framework React con App Router |
| **React** | 19.2.0 | Librería UI y gestión de estado |
| **TypeScript** | 5.9.3 | Type safety en JavaScript |
| **Tailwind CSS** | 4.0 | Estilos utilitarios y componentes |
| **Prisma** | 6.18.0 | ORM para PostgreSQL |
| **PostgreSQL** | - | Base de datos (Supabase) |
| **Lucide React** | 0.555.0 | Iconografía |

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18.0 o superior) - [Descargar](https://nodejs.org/)
- **npm** o **yarn** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)
- **Una cuenta de Supabase** (para la base de datos) - [Crear cuenta](https://supabase.com/)

### Verificar Instalación

```bash
node --version    # Debe ser v18.0+
npm --version     # Debe ser v9.0+
```

## 🚀 Instalación y Configuración

### 1️⃣ Clonar o Descargar el Repositorio

```bash
# Si tienes Git
git clone <URL-DEL-REPOSITORIO>
cd nextjs-prisma

# O simplemente abre la carpeta en tu editor
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json` incluyendo Next.js, React, Prisma y Tailwind CSS.

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# En Windows (PowerShell)
New-Item .env -Force

# En macOS/Linux
touch .env
```

Agrega las variables de base de datos. **IMPORTANTE**: Reemplaza las credenciales con las tuyas de Supabase:

```env
# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres"
DIRECT_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"
```

#### ¿Dónde obtener estas credenciales?

1. Ve a [Supabase Dashboard](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a **Settings → Database → Connection String**
4. Copia la URL en formato `postgresql://...`
5. Para `DATABASE_URL`: Usa el **Connection Pooler** (puerto 6543)
6. Para `DIRECT_URL`: Usa la **Direct Connection** (puerto 5432)

### 4️⃣ Configurar la Base de Datos

```bash
# Generar Cliente de Prisma
npm install

# Ejecutar migraciones (crear tablas)
npm run prisma:migrate

# (Opcional) Llenar base de datos con datos de prueba
npm run prisma:seed
```

#### ¿Qué hace cada comando?

| Comando | Descripción |
|---------|------------|
| `npm install` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Crea las tablas en la base de datos |
| `npm run prisma:seed` | Carga datos iniciales de prueba |

### 5️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

El servidor estará disponible en:

- **Local**: [http://localhost:3000](http://localhost:3000)
- **Red**: [http://192.168.1.XXX:3000](http://192.168.1.XXX:3000) (desde otros dispositivos)

Deberías ver:

```
✓ Next.js 16.0.0 (Turbopack)
✓ Ready in X.Xs
✓ http://localhost:3000
```

## 📱 Uso de la Aplicación

### Primera Vez: Registrarse

1. Ve a [http://localhost:3000](http://localhost:3000)
2. Haz clic en **"Crear Cuenta"**
3. Ingresa:
   - **Email**: Tu dirección de correo
   - **Nombre**: Tu nombre completo
4. Haz clic en **"Registrarse"**
5. Serás redirigido automáticamente al dashboard

### Dashboard de Trading

Una vez dentro, verás:

- **Header**: Tu nombre y botón de logout
- **Wallet**: Saldo en USD y Coin-X con valor estimado del portafolio
- **Gráfico**: Precio en tiempo real de Coin-X (actualizado cada 2 segundos)
- **Formulario de Trading**: Compra/Venta de Coin-X
- **Historial**: Tabla con todas tus transacciones

### Hacer una Compra

1. Ingresa el **monto en USD** que deseas gastar
2. Verás automáticamente cuánto **Coin-X recibirás** (Monto ÷ Precio)
3. Haz clic en **"Comprar"**
4. Tu balance se actualizará inmediatamente

### Hacer una Venta

1. Cambia a la pestaña **"Vender"**
2. Ingresa la **cantidad de Coin-X** que deseas vender
3. Verás cuánto **USD recibirás** (Cantidad × Precio)
4. Haz clic en **"Vender"**

### Cerrar Sesión

Haz clic en el botón **"Logout"** en la esquina superior derecha.

## 🗂️ Estructura del Proyecto

```
nextjs-prisma/
├── app/
│   ├── layout.tsx              # Layout global
│   ├── globals.css             # Estilos globales y componentes Tailwind
│   ├── page.tsx                # Página de login/registro
│   ├── trading/
│   │   └── page.tsx            # Dashboard de trading
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts  # Endpoint de login
│       │   ├── register/route.ts # Endpoint de registro
│       │   ├── logout/route.ts # Endpoint de logout
│       │   └── me/route.ts     # Obtener usuario actual
│       ├── trade/
│       │   └── route.ts        # Ejecutar compra/venta
│       └── init/
│           └── route.ts        # Inicializar demo
├── lib/
│   ├── prisma.ts              # (DEPRECATED) Cliente Prisma
│   └── price.ts               # Funciones de precio
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Script de datos iniciales
│   └── migrations/            # Historial de migraciones
├── public/                    # Archivos estáticos
├── package.json              # Dependencias del proyecto
├── tsconfig.json             # Configuración TypeScript
├── tailwind.config.ts        # Configuración Tailwind
├── postcss.config.js         # Configuración PostCSS
├── next.config.ts            # Configuración Next.js
├── .env                      # Variables de entorno (no versionar)
└── README.md                 # Este archivo
```

## 🗄️ Esquema de Base de Datos

### Modelo: `User`
```
- id (Integer, PK, Auto-increment)
- email (String, Unique)
- name (String)
- account (Relation 1:1)
```

### Modelo: `Account`
```
- id (Integer, PK, Auto-increment)
- balanceUSD (Decimal 10,2) - Default: 10000.0
- balanceCoinX (Decimal 10,4) - Default: 0.0
- userId (Integer, FK, Unique)
- transactions (Relation 1:N)
```

### Modelo: `Transaction`
```
- id (Integer, PK, Auto-increment)
- type (Enum: BUY | SELL)
- coinPrice (Decimal 10,2)
- amountUSD (Decimal 10,2)
- amountCoinX (Decimal 10,4)
- createdAt (DateTime) - Default: now()
- accountId (Integer, FK)
```

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Crear nueva cuenta de usuario.

**Body:**
```json
{
  "email": "usuario@example.com",
  "name": "Juan Pérez"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "name": "Juan Pérez"
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión y crear cookie de sesión.

**Body:**
```json
{
  "email": "usuario@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": { ... },
  "account": {
    "id": 1,
    "balanceUSD": 10000,
    "balanceCoinX": 0
  }
}
```

#### GET `/api/auth/me`
Obtener datos del usuario actual (requiere cookie de sesión).

**Response (200):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "account": { ... }
}
```

#### POST `/api/auth/logout`
Cerrar sesión (elimina cookie).

**Response (200):**
```json
{ "success": true }
```

### Trading

#### POST `/api/trade`
Ejecutar operación de compra/venta.

**Body:**
```json
{
  "type": "BUY",           // o "SELL"
  "amount": 500,           // USD para compra, Coin-X para venta
  "currentPrice": 125.50,  // Precio actual de Coin-X
  "userId": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "account": {
    "balanceUSD": 9500,
    "balanceCoinX": 3.98
  },
  "transaction": {
    "id": 1,
    "type": "BUY",
    "coinPrice": 125.50,
    "amountUSD": 500,
    "amountCoinX": 3.98
  }
}
```

## 🚨 Solución de Problemas

### ❌ Error: "DATABASE_URL is missing"

**Solución**: Verifica que el archivo `.env` existe y contiene `DATABASE_URL`.

```bash
# Verificar que el archivo existe
ls .env   # macOS/Linux
dir .env  # Windows
```

### ❌ Error: "Connection refused"

**Problema**: No puedes conectarte a Supabase.

**Soluciones**:
1. Verifica que tu credencial de PostgreSQL es correcta en `.env`
2. Comprueba que tu proyecto de Supabase está activo
3. Asegúrate de estar conectado a internet

### ❌ Error: "Prepared statement already exists"

**Problema**: Pool de conexiones saturado.

**Solución**: Este problema fue corregido. Si reaparece, reinicia el servidor:

```bash
npm run dev
```

### ❌ Error: "Port 3000 already in use"

**Problema**: Otro proceso está usando el puerto 3000.

**Soluciones**:

**Windows (PowerShell):**
```bash
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Encontrar y matar proceso
lsof -i :3000
kill -9 <PID>
```

### ❌ El servidor no compila

**Solución**: Limpia el caché de Next.js:

```bash
# Windows
rm -r .next
rm -r .turbo

# Reinicia el servidor
npm run dev
```

## 🏗️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en modo desarrollo

# Producción
npm run build           # Crea build optimizado
npm start               # Inicia servidor en modo producción

# Base de datos
npm run prisma:migrate # Ejecutar migraciones
npm run prisma:seed    # Llenar BD con datos iniciales

# Lint y validación
npm run lint           # Ejecutar ESLint
```

## 🎨 Personalización

### Cambiar Colores de Tema

Edita `app/globals.css`:

```css
/* Cambiar color primario de verde a azul */
.btn-primary-green {
  @apply bg-blue-600 hover:bg-blue-700;
}
```

### Cambiar Balance Inicial

Edita `prisma/schema.prisma`:

```prisma
model Account {
  balanceUSD @default(50000.0)  // Cambiar de 10000 a 50000
  balanceCoinX @default(100.0)  // Agregar balance inicial
}
```

Luego ejecuta:
```bash
npm run prisma:migrate
```

### Cambiar Nombre de la Moneda

Busca "Coin-X" en los archivos y reemplaza con el nombre deseado:
- `app/trading/page.tsx`
- `app/globals.css`
- `app/layout.tsx`

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)

## 📝 Notas Importantes

- **No versionar `.env`**: Este archivo contiene credenciales sensibles. Agrégalo a `.gitignore`.
- **Copias de seguridad**: Realiza backups regulares de tu base de datos Supabase.
- **Seguridad**: Las contraseñas no se almacenan (actualmente). Implementa hashing si es necesario para producción.
- **Precios simulados**: Los precios de Coin-X se actualizan de forma aleatoria cada 2 segundos (solo simulación).

## 👥 Autoría

Proyecto educativo para demostración de:
- Next.js 16 con App Router
- React 19
- Tailwind CSS v4
- Prisma ORM
- Supabase - PostgreSQL
- Autenticación basada en cookies

## 📄 Licencia

Este proyecto es de código abierto y disponible bajo la licencia MIT.

---

**¿Preguntas o problemas?** Revisa la sección de [Solución de Problemas](#solución-de-problemas) o contacta al desarrollador.

**Última actualización**: 26 de noviembre de 2025

