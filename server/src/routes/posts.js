import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// List posts (public)
/*router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, username: true, avatarUrl: true } }, _count: { select: { comments: true, likes: true } } }
  });
  res.json(posts);
});*/
router.get('/', async (req, res) => {
  const { category } = req.query;
  const where = category ? { categories: { some: { category: { name: category } } } } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, avatarUrl: true } },
      categories: { include: { category: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  res.json(posts);
});
 

// Get single post (with categories)
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        categories: {                 // 🟣 ADD THIS
          include: { category: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Create post (auth required)
router.post('/', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Auth required' });
  const { title, content, imageUrl, categories } = req.body;

  try {
    // Ensure categories is an array of names
    const categoryConnect = categories?.map(name => ({
      category: {
        connectOrCreate: {
          where: { name },
          create: { name },
        },
      },
    })) || [];

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: req.user.id,
        categories: {
          create: categoryConnect,
        },
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});


export default router;
