import 'dotenv/config';
import express from 'express';
import studentRoutes from './routes/studentRoutes.js';
import classRoutes from './routes/classRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import academicSessionRoutes from './routes/academicSessionRoutes.js'
import resultRoutes from './routes/resultRoutes.js'
import staffRoutes from './routes/staffRoutes.js'
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';

const app = express();
const port = 3000;


app.use(express.json());

app.use('/students', studentRoutes);
app.use('/classes', classRoutes);
app.use('/subjects', subjectRoutes);
app.use('/user', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/academicSessions', academicSessionRoutes);
app.use('/results', resultRoutes);
app.use('/staff', staffRoutes);


app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use(errorHandler);


const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on: http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start server')
  }
};

startServer();