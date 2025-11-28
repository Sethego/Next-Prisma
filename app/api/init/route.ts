import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  
  try {
    // Buscamos o creamos el usuario con ID 1
    const user = await prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: 'trader@example.com',
        name: 'Trader Principal',
      },
    });

    // Buscamos o creamos la cuenta del usuario
    let account = await prisma.account.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          userId: user.id,
          balanceUSD: 10000.0,
          balanceCoinX: 0.0,
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      account: {
        id: account.id,
        balanceUSD: Number(account.balanceUSD),
        balanceCoinX: Number(account.balanceCoinX),
      }
    });
  } catch (error) {
    console.error('Error al inicializar cuenta:', error);
    return NextResponse.json({ 
      error: 'Error al inicializar la cuenta' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
