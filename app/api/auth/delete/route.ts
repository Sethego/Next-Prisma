import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
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

    // Eliminar el usuario (esto eliminará en cascada la cuenta y transacciones)
    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    // Crear respuesta y limpiar cookie
    const response = NextResponse.json({
      success: true,
      message: 'Cuenta eliminada',
    });

    response.cookies.delete('userId');
    return response;
  } catch (error) {
    console.error('Error eliminando cuenta:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la cuenta' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
