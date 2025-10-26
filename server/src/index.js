import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import likesRouter from './routes/likes.js';
import chatRouter, { initChat } from './routes/chat.js';
import categoriesRoute from "./routes/categories.js";
import { authMiddleware } from './middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true, credentials: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRouter);
app.use('/api/posts', authMiddleware.optional, postsRouter);
app.use('/api/comments', authMiddleware.required, commentsRouter);
app.use('/api/likes', authMiddleware.required, likesRouter);
app.use('/api/chat', authMiddleware.required, chatRouter);
app.use("/categories", categoriesRoute);


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || '*' } });
initChat(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
