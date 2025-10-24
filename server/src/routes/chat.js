import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

let ioInstance = null;
export function initChat(io) {
  ioInstance = io;
  io.on('connection', (socket) => {
    socket.on('room:join', ({ roomId }) => socket.join(roomId));
    socket.on('msg:send', async ({ roomId, content, tokenUser }) => {
      if (!tokenUser) return;
      const msg = await prisma.message.create({
        data: { content, roomId, senderId: tokenUser.id }
      });
      io.to(roomId).emit('msg:new', { ...msg, sender: { id: tokenUser.id, username: tokenUser.username } });
    });
  });
}

router.post('/rooms', async (req, res) => {
  const { name, isPrivate } = req.body;
  const room = await prisma.room.create({ data: { name, isPrivate: !!isPrivate, members: { create: { userId: req.user.id } } } });
  res.status(201).json(room);
});

router.get('/rooms', async (_req, res) => {
  const rooms = await prisma.room.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(rooms);
});

router.get('/rooms/:roomId/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { roomId: req.params.roomId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { id: true, username: true } } }
  });
  res.json(messages);
});

export default router;
