import express from 'express';
import userRoutes from './routes/userRoute'
import activityRoutes from './routes/activityRoute'
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;