import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Eliminar la cookie de sesión
  response.cookies.delete('userId');

  return response;
}
