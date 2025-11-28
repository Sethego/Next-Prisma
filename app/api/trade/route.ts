// app/api/trade/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  
  try {
    const { userId, type, amount, currentPrice } = await request.json();

    // 1. Obtener cuenta del usuario
    const account = await prisma.account.findUnique({
      where: { userId: userId }
    });

    if (!account) return NextResponse.json({ error: "Cuenta no encontrada" }, { status: 404 });

    // 2. Calcular montos
    let newBalanceUSD = Number(account.balanceUSD);
    let newBalanceCoinX = Number(account.balanceCoinX);
    let transactionAmountUSD = 0;
    let transactionAmountCoinX = 0;

    if (type === 'BUY') {
      // amount es USD que el usuario gasta
      if (newBalanceUSD < amount) return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
      
      transactionAmountUSD = amount;
      transactionAmountCoinX = amount / currentPrice;

      newBalanceUSD -= transactionAmountUSD;
      newBalanceCoinX += transactionAmountCoinX;
    } else {
      // SELL: amount es CoinX que el usuario vende
      if (newBalanceCoinX < amount) return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 });
      
      transactionAmountCoinX = amount;
      transactionAmountUSD = amount * currentPrice;

      newBalanceCoinX -= transactionAmountCoinX;
      newBalanceUSD += transactionAmountUSD;
    }

    // 3. Transacción atómica (Prisma Transaction)
    // Actualizamos la cuenta y creamos el registro de transacción al mismo tiempo
    const result = await prisma.$transaction([
      prisma.account.update({
        where: { id: account.id },
        data: {
          balanceUSD: newBalanceUSD,
          balanceCoinX: newBalanceCoinX
        }
      }),
      prisma.transaction.create({
        data: {
          accountId: account.id,
          type: type,
          coinPrice: currentPrice,
          amountUSD: transactionAmountUSD,
          amountCoinX: transactionAmountCoinX
        }
      })
    ]);

    return NextResponse.json({ success: true, newBalance: result[0], transaction: result[1] });
  } catch (error) {
    console.error('Error en trade:', error);
    return NextResponse.json({ error: 'Error al procesar la transacción' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}