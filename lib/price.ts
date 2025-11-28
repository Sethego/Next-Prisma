// lib/price.ts

// Rango de precio simulado para Coin-X (entre 450 y 550 USD)
const MIN_PRICE = 450;
const MAX_PRICE = 550;

/**
 * Genera un precio simulado para Coin-X.
 */
export function getCurrentPrice(): number {
  const price = Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE;
  // Redondea a 2 decimales
  return parseFloat(price.toFixed(2));
}