import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import connect from './db.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) =>
  res.json({ ok: true, name: 'WEB91-MID-TEST' })
);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('❌', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal error'
  });
});

const PORT = process.env.PORT || 4000;

(async () => {
  await connect(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
})();
