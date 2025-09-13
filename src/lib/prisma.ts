import { PrismaClient } from '@prisma/client';

// アプリケーション全体で共有するPrismaClientのインスタンス
export const prisma = new PrismaClient();