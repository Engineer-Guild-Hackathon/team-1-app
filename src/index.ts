import express from 'express';
import usersRouter from './routes/users';
import domainsRouter from './routes/domains';
import nodesRouter from './routes/nodes';

const app = express();
const PORT = 3000;

// POSTリクエストのbodyをJSONとして解析するために必要
app.use(express.json());

// 各ルートをマウント
app.use('/api/users', usersRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/nodes', nodesRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});