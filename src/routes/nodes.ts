import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// CREATE: 新しい知識ノードを作成
router.post('/', async (req, res) => {
    const { title, description, domainId } = req.body;
    try {
        const newNode = await prisma.knowledgeNode.create({
            data: {
                title,
                description,
                domainId, // どのドメインに属するかを指定
            },
        });
        res.status(201).json(newNode);
    } catch (error) {
        res.status(400).json({ error: 'Node could not be created. Invalid domainId?' });
    }
});

// READ: 全てのノードを取得（関連情報も含む）
router.get('/', async (req, res) => {
    const nodes = await prisma.knowledgeNode.findMany({
        include: {
            domain: true,         // 所属するドメイン
            prerequisites: true,  // 前提知識ノード
            unlocks: true,        // このノードが前提となるノード
        },
    });
    res.json(nodes);
});

// UPDATE: 前提知識を追加する
router.post('/:id/prerequisites', async (req, res) => {
    const { id } = req.params;
    const { prerequisiteId } = req.body;
    try {
        const updatedNode = await prisma.knowledgeNode.update({
            where: { id },
            data: {
                prerequisites: {
                    connect: { id: prerequisiteId } // 既存のノードを前提知識として接続
                }
            }
        });
        res.json(updatedNode);
    } catch (error) {
        res.status(400).json({ error: 'Could not add prerequisite.' });
    }
});


// 他のUPDATE, DELETEもUserと同様のパターンで実装できます

export default router;