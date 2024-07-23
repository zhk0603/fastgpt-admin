import express from 'express';
import cors from 'cors';
import {useUserRoute} from './service/route/user.js';
import {useAppRoute} from './service/route/app.js';
import {useKbRoute} from './service/route/kb.js';
import {useSystemRoute} from './service/route/system.js';
import {useTeamRoute} from './service/route/team.js';
import {useTeamMemberRoute} from './service/route/teamMember.js';
import {useDashboardRoute} from "./service/route/dashboard.js";
import {logMiddleware} from "./service/middleware/common.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(logMiddleware);

useUserRoute(app);
useAppRoute(app);
useKbRoute(app);
useSystemRoute(app);
useDashboardRoute(app);
useTeamRoute(app);
useTeamMemberRoute(app);

app.get('/*', (req, res) => {
  try {
    res.sendFile(new URL('dist/index.html', import.meta.url).pathname);
  } catch (error) {
    res.end();
  }
});

app.use((err, req, res, next) => {
  try {
    res.sendFile(new URL('dist/index.html', import.meta.url).pathname);
  } catch (error) {
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
