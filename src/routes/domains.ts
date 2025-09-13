import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// CREATE: 新しいドメインを作成
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const newDomain = await prisma.domain.create({
        data: { name, description },
    });
    res.status(201).json(newDomain);
});

// READ: 全てのドメインを取得（関連するノードも含む）
router.get('/', async (req, res) => {
    const domains = await prisma.domain.findMany({
        include: { nodes: true }, // 関連するノードも一緒に取得
    });
    res.json(domains);
});

// 他のUPDATE, DELETEもUserと同様のパターンで実装できます

export default router;