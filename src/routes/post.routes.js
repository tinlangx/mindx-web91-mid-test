import { Router } from 'express';
import requireApiKey from '../middleware/requireApiKey.js';
import Post from '../models/Post.js';

const router = Router();

/**
 * 3) Tạo post (chỉ khi có apiKey hợp lệ)
 * POST /posts?apiKey=...
 * Body: { content }
 */
router.post('/', requireApiKey, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    const e = new Error('content là bắt buộc');
    e.statusCode = 400;
    throw e;
  }

  const post = await Post.create({
    userId: req.user._id.toString(),
    content
  });

  res.status(201).json(post);
});

/**
 * 4) Cập nhật post theo id (đúng chủ + apiKey hợp lệ)
 * PUT /posts/:id?apiKey=...
 * Body: { content }
 */
router.put('/:id', requireApiKey, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    const e = new Error('Không tìm thấy bài post');
    e.statusCode = 404;
    throw e;
  }

  if (post.userId !== req.user._id.toString()) {
    const e = new Error('Không có quyền cập nhật bài post này');
    e.statusCode = 403;
    throw e;
  }

  if (content != null) post.content = content;
  await post.save();

  res.json(post);
});

export default router;
