import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    // Intentar crear directamente el usuario
    const user = await prisma.user.create({
      data: {
        email: 'trader@example.com',
        name: 'Trader Principal',
        account: {
          create: {
            balanceUSD: 10000.0,
            balanceCoinX: 0.0,
          },
        },
      },
    });

    console.log('✅ Usuario creado:', user);
    console.log('✅ Cuenta de trading creada para el usuario');
    console.log('💰 Saldo inicial: $10,000 USD');
    console.log('🪙 Coin-X: 0 CX');
  } catch (error: any) {
    // Si el usuario ya existe, ignorar el error
    if (error.code === 'P2002') {
      console.log('✅ El usuario trader@example.com ya existe');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
