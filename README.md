# Implementación de Prisma ORM con Next.js y Supabase

Este proyecto implementa un servicio de API RESTful para la gestión de usuarios, demostrando la integración de **Prisma ORM** como la capa de acceso a datos con **Supabase (PostgreSQL)** y el framework **Next.js**.

El objetivo es facilitar la comprensión de cómo la seguridad de tipos de TypeScript se extiende hasta la base de datos a través de Prisma.

## 1. Requisitos y Configuración Inicial

Para ejecutar este proyecto, necesitas lo siguiente instalado en tu sistema:

* **Node.js** (versión 18 o superior).
* Una **Base de Datos PostgreSQL** activa en Supabase.

## 2. Clonar e Instalar Dependencias

Primero debe seguir el siguiente orden de comandos:

**1. Creamos un aplicativo de Next.js**
```bash
npx create-next-app . 
```

**2. Usamos el modo desarrollador para un test**
```bash
npm run dev
```
Esto iniciará el aplicativo web de Next.js

**3. Instalamos Prisma**
```bash
npm install dotenv prisma typescript tsx @types/node -D
```
Para las librerias requeridas

**4. Inicializamos Prisma**
```bash
npx prisma init
```

Después de los pasos abra su terminal, clona el repositorio e instala los archivos:

```bash
https://github.com/Sethego/Next-Prisma.git
```

## 3. Conexión con Supabase

Primero, debe crear su proyecto en **Supabase**, debe dirigirse al botón de **Connect**, allí encotrará los links de "Transaction Pooler" y "Session Pooler"

Debe asegurarse de que el archivo ***prisma.config.ts*** no este dentro del proyecto. Luego, en el archivo ***.env*** debe agregar los URL para la conexión con su Database y debe de la siguiente manera:

```bash
DATABASE_URL="postgresql://postgres.xxxxxxxxxx:[TU_CLAVE]@aws-1-us-east-2.pooler.supabase.com:6543/postgres"

DIRECT_URL="postgresql://postgres.xxxxxxxxxx:[TU_CLAVE]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

Tenga en cuenta que debe reemplazar **[TU_CLAVE]** por la clave de su Database.

Para conectar a su Database debe usar el siguiente comando en la terminal:

```bash
npx prisma db push
```

