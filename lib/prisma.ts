// lib/prisma.ts
// DEPRECATED: Use per-request PrismaClient instances instead
// See app/api/auth/* and app/api/trade for examples

import { PrismaClient } from '@prisma/client';

// This singleton is no longer used - each API route creates its own instance
// to avoid connection pool exhaustion with Supabase
throw new Error('DEPRECATED: Do not use lib/prisma.ts - create per-request PrismaClient instances instead');

export default null;