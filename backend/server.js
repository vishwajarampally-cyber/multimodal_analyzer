const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const connectDb = require('./config/db');
const documentRoutes = require('./routes/documentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();

connectDb();

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cors());
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
