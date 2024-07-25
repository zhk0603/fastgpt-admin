import { Team, TeamMember } from "../schema/index.js";
import { auth } from "./system.js";

export const useTeamRoute = (app) => {
  // 列表
  app.get("/teams", auth(), async (req, res) => {
    try {
      const start = parseInt(req.query._start) || 0;
      const end = parseInt(req.query._end) || 20;
      const order = req.query._order === "DESC" ? -1 : 1;
      const sort = req.query._sort || "_id";
      const tag = req.query.tag || "";
      const name = req.query.name || "";

      const where = {
        ...(name
          ? {
              name: { $regex: name, $options: "i" },
            }
          : {}),
        ...(tag
          ? {
              tags: { $elemMatch: { $regex: tag, $options: "i" } },
            }
          : {}),
      };

      const itemsRaw = await Team.find(where)
        .skip(start)
        .limit(end - start)
        .sort({ [sort]: order });

      const items = [];

      for (const itemRaw of itemsRaw) {
        const item = itemRaw.toObject();

        const orderedKb = {
          ...item,
          id: item._id.toString(),
        };

        items.push(orderedKb);
      }
      const totalCount = await Team.countDocuments(where);
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);
      res.json(items);
    } catch (err) {
      console.log(`Error fetching: ${err}`);
      res.status(500).json({ error: "Error fetching", details: err.message });
    }
  });
  // 创建
  app.post("/teams", auth(), async (req, res) => {
    const { name, ownerId, defaultPermission } = req.body;
    const newTeam = await Team.create({
      name,
      ownerId,
      defaultPermission,
    });

    console.log("新团队ID:", newTeam._id);

    const newTeamMember = await TeamMember.create({
      teamId: newTeam._id,
      userId: ownerId,
      name: "Owner",
      role: "owner",
      status: "active",
      defaultTeam: false,
    });

    res.status(200).json({
      team: newTeam,
      teamMember: newTeamMember,
    });
  });
  // 更新
  app.put("/teams/:teamId", auth(), async (req, res) => {
    const _id = req.params.teamId;
    const { name, defaultPermission, ownerId } = req.body;

    const result = await Team.findByIdAndUpdate(
      _id,
      {
        name,
        defaultPermission,
        ownerId,
      },
      { new: true }
    );

    res.status(200).json(result);
  });
  // 详情
  app.get("/teams/:teamId", auth(), async (req, res) => {
    const teamId = req.params.teamId;

    try {
      const team = await Team.findById(teamId);

      if (!team) {
        return res.status(404).send("团队不存在");
      }

      var obj = team.toObject();

      res.json({ ...obj, id: obj._id });
    } catch (error) {
      console.error("get teams", error);
      res.status(500).send("内部服务器错误");
    }
  });
  // 删除
  app.delete("/teams/:teamId", auth(), async (req, res) => {
    const teamId = req.params.teamId;

    try {
      const team = await Team.findById(teamId);

      if (!team) {
        return res.status(404).send("团队不存在");
      }

      // 删除此团队的所有成员
      const teamDeleteResult = await TeamMember.deleteMany({ teamId });
      if (teamDeleteResult.deletedCount === 0) {
        console.log(`团队没有任何成员`);
      }

      // 删除用户
      await Team.findByIdAndDelete(teamId);

      res.send("删除成功");
    } catch (error) {
      console.error("删除过程中发生错误:", error);
      res.status(500).send("内部服务器错误");
    }
  });
};
