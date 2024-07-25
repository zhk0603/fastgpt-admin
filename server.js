import express from "express";
import cors from "cors";
import { useUserRoute } from "./service/route/user.js";
import { useAppRoute } from "./service/route/app.js";
import { useKbRoute } from "./service/route/kb.js";
import { useSystemRoute } from "./service/route/system.js";
import { useTeamRoute } from "./service/route/team.js";
import { useTeamMemberRoute } from "./service/route/teamMember.js";
import { useDashboardRoute } from "./service/route/dashboard.js";
import { logMiddleware } from "./service/middleware/common.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(process.env.VITE_BASE_NAME || "", express.static("dist"));
app.use(logMiddleware);

// 重写路由方法
const methods = ["get", "post", "put", "delete", "patch", "options", "head"];
const originalMethods = {};

methods.forEach((method) => {
  originalMethods[method] = app[method].bind(app);
  app[method] = (path, ...handlers) => {
    if (typeof path === "string") {
      if(path.indexOf('/') != 0) {
        path = '/' + path
      }
      path = `${process.env.VITE_BASE_NAME || ""}${path}`;
    }
    return originalMethods[method](path, ...handlers);
  };
});

useUserRoute(app);
useAppRoute(app);
useKbRoute(app);
useSystemRoute(app);
useDashboardRoute(app);
useTeamRoute(app);
useTeamMemberRoute(app);

app.get(`${process.env.VITE_BASE_NAME || ""}/*`, (req, res) => {
  try {
    res.sendFile(new URL("dist/index.html", import.meta.url).pathname);
  } catch (error) {
    res.end();
  }
});

app.use((err, req, res, next) => {
  try {
    res.sendFile(new URL("dist/index.html", import.meta.url).pathname);
  } catch (error) {
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
