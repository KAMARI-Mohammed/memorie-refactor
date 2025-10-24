import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

router.post('/:postId/toggle', async (req, res) => {
  const postId = req.params.postId;
  const existing = await prisma.like.findFirst({ where: { postId, userId: req.user.id } });
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return res.json({ liked: false });
  } else {
    await prisma.like.create({ data: { postId, userId: req.user.id } });
    return res.json({ liked: true });
  }
});

export default router;
