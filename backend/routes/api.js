import { Router } from 'express';

const router = Router();

// Example endpoint: GET /api/test
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

export default router;
