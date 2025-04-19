import express from 'express';
import userRoutes from './routes/userRoute'
import activityRoutes from './routes/activityRoute'
import reportRoutes from './routes/reportRoute';
import suggetionRoutes from './routes/suggetionRoute';
import emmisiontimeRoutes from './routes/emmisiontimeRoute';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// cors
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

// routes

app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/suggestions', suggetionRoutes);
app.use('/api/emissions', emmisiontimeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;