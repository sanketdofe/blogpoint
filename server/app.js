import express from 'express';
import cors from 'cors';
const app = express();

import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

app.use(express.json({limit: '5mb'}));
app.use(
  express.urlencoded({
    limit: '5mb',
    extended: true,
  })
);
app.use(cors());


/////////////////////////////Routes///////////////////////////////
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);


//////////////////////////////Port Setup////////////////////////////////
app.listen(process.env.PORT || "5000", function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is up on port 5000");
  }
}); 