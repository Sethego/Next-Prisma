import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { 
        account: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      account: user.account ? {
        id: user.account.id,
        balanceUSD: Number(user.account.balanceUSD),
        balanceCoinX: Number(user.account.balanceCoinX),
      } : null,
      transactions: user.account?.transactions ? user.account.transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        coinPrice: Number(tx.coinPrice),
        amountUSD: Number(tx.amountUSD),
        amountCoinX: Number(tx.amountCoinX),
        createdAt: tx.createdAt.toISOString(),
      })) : [],
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de usuario' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
