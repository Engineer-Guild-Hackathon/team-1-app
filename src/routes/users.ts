import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// CREATE: 新しいユーザーを作成
router.post('/', async (req, res) => {
    try {
        const { email, name } = req.body;
        const newUser = await prisma.user.create({
            data: { email, name },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'User could not be created.' });
    }
});

// READ: 全てのユーザーを取得
router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// READ: IDで特定のユーザーを取得
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found.' });
    }
});

// UPDATE: ユーザー情報を更新
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(404).json({ error: 'User not found.' });
    }
});

// DELETE: ユーザーを削除
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(404).json({ error: 'User not found.' });
    }
});

export default router;