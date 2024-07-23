import { Team, TeamMember } from "../schema/index.js";
import { auth } from "./system.js";

export const useTeamMemberRoute = (app) => {
  // 列表
  app.get("/team-member", auth(), async (req, res) => {
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

      const itemsRaw = await TeamMember.find(where)
        .populate("teamId")
        .populate("userId")
        .skip(start)
        .limit(end - start)
        .sort({ [sort]: order });

      const items = [];

      for (const itemRaw of itemsRaw) {
        const item = itemRaw.toObject();

        const orderedKb = {
          ...item,
          teamId: item.teamId._id,
          teamName: item.teamId.name,
          userId: item.userId._id,
          username: item.userId.username,
          id: item._id.toString(),
        };

        items.push(orderedKb);
      }
      const totalCount = await TeamMember.countDocuments(where);
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);
      res.json(items);
    } catch (err) {
      console.log(`Error fetching: ${err}`);
      res.status(500).json({ error: "Error fetching", details: err.message });
    }
  });
  // 创建
  app.post("/team-member", auth(), async (req, res) => {
    const { teamId, userId, role, defaultTeam } = req.body;

    // 是否已经已加入团队
    const exists = await TeamMember.exists({
      teamId,
      userId,
    });

    if (exists) {
      return res.status(500).json({ message: "用户已经加入此团队" });
    }

    // 如果defaultTeam：true，是否已经存在一个默认团队。
    if (defaultTeam) {
      const existsDefaultTeam = await TeamMember.exists({
        userId,
        defaultTeam: true,
      });
      if (existsDefaultTeam) {
        return res.status(500).json({ message: "用户已经存在一个默认团队" });
      }
    }

    const newTm = await TeamMember.create({
      teamId,
      userId,
      name: role == "owner" ? "Owner" : "Member",
      role,
      defaultTeam,
      status: "active",
    });

    res.status(200).json({
      teamMember: newTm,
    });
  });
  // 更新
  app.put("/team-member/:id", auth(), async (req, res) => {
    const _id = req.params.id;
    const { role, defaultTeam, status } = req.body;

    const result = await TeamMember.findByIdAndUpdate(
      _id,
      {
        name: role == "owner" ? "Owner" : "Member",
        role,
        defaultTeam,
        status,
      },
      { new: true }
    );

    res.status(200).json(result);
  });
  // 详情
  app.get("/team-member/:id", auth(), async (req, res) => {
    const id = req.params.id;

    try {
      const team = await TeamMember.findById(id)
        .populate("teamId")
        .populate("userId");

      if (!team) {
        return res.status(404).end("团队成员不存在");
      }

      var obj = team.toObject();

      res.json({ ...obj, id: obj._id });
    } catch (error) {
      console.error("get ", error);
      res.status(500).send("内部服务器错误");
    }
  });
  // 删除
  app.delete("/team-member/:id", auth(), async (req, res) => {
    const id = req.params.id;

    try {
      const team = await TeamMember.findById(id);

      if (!team) {
        return res.status(404).json({ message: "团队成员不存在" });
      }

      const obj = team.toObject();
      if (obj.role == "owner") {
        return res.status(500).json({ message: "不允许删除创建者" });
      }

      await TeamMember.findByIdAndDelete(id);

      res.send("删除成功");
    } catch (error) {
      console.error("删除过程中发生错误:", error);
      res.status(500).send("内部服务器错误");
    }
  });
};
