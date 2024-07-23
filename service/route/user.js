import { Pay, Team, TeamMember, User } from "../schema/index.js";
import dayjs from "dayjs";
import { auth } from "./system.js";
import crypto from "crypto";
import { validateUserCreation } from "../middleware/common.js";
import { FullPermission } from "../constant/permisson.js";

export const PRICE_SCALE = 100000;

export const formatPrice = (val = 0, multiple = 1) => {
  return Number(((val / PRICE_SCALE) * multiple).toFixed(10));
};

// 加密
export const hashPassword = (psw) => {
  return crypto.createHash("sha256").update(psw).digest("hex");
};

const day = 60;

export const useUserRoute = (app) => {
  // 统计近 30 天注册用户数量
  app.get("/users/data", auth(), async (req, res) => {
    try {
      let startCount = await User.countDocuments({
        createTime: { $lt: new Date(Date.now() - day * 24 * 60 * 60 * 1000) },
      });
      const usersRaw = await User.aggregate([
        {
          $match: {
            createTime: {
              $gte: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createTime" },
              month: { $month: "$createTime" },
              day: { $dayOfMonth: "$createTime" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
          },
        },
        { $sort: { date: 1 } },
      ]);

      const countResult = usersRaw.map((item) => {
        const increaseRate = `${((item.count / startCount) * 100).toFixed(2)}%`;
        startCount += item.count;
        return {
          date: item.date,
          count: startCount,
          increase: item.count,
          increaseRate,
        };
      });

      res.json(countResult);
    } catch (err) {
      console.log(`Error fetching users: ${err}`);
      res.status(500).json({ error: "Error fetching users" });
    }
  });
  // 获取用户列表
  app.get("/users", auth(), async (req, res) => {
    try {
      const start = parseInt(req.query._start) || 0;
      const end = parseInt(req.query._end) || 20;
      const order = req.query._order === "DESC" ? -1 : 1;
      const sort = req.query._sort || "createTime";
      const username = req.query.username || "";
      const where = {
        $and: [
          { username: { $regex: username, $options: "i" } },
          // { username: { $ne: "root" } },
        ],
      };

      const usersRaw = await User.find(where)
        .skip(start)
        .limit(end - start)
        .sort({ [sort]: order });

      const users = [];
      for (var index in usersRaw) {
        var user = usersRaw[index];
        const obj = user.toObject();

        var defaultTeam = (
          await TeamMember.findOne({
            userId: obj._id,
            defaultTeam: true,
          })
        )?.toObject();

        users.push({
          ...obj,
          id: obj._id,
          createTime: dayjs(obj.createTime).format("YYYY/MM/DD HH:mm"),
          password: "",
          defaultTeamId: defaultTeam?.teamId,
        });
      }

      const totalCount = await User.countDocuments(where);

      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);
      res.json(users);
    } catch (err) {
      console.log(`Error fetching users: ${err}`);
      res.status(500).json({ error: "Error fetching users" });
    }
  });
  // 创建用户
  app.post("/users", auth(), validateUserCreation, async (req, res) => {
    try {
      const {
        username,
        password,
        avatar,
        timezone,
        promotionRate,
        defaultTeamId,
      } = req.body;

      // 创建用户
      const newUser = await User.create({
        username,
        status: "active",
        password: hashPassword(password),
        avatar,
        promotionRate: promotionRate,
        timezone,
      });

      console.log("新用户ID:", newUser._id);
      // 查询默认团队
      const defaultTeam = await Team.findOne({ _id: defaultTeamId });

      // 将新用户添加到默认团队
      const newTeamMember = await TeamMember.create({
        teamId: defaultTeam._id,
        userId: newUser._id,
        name: "Member",
        role: "visitor",
        status: "active",
        defaultTeam: true,
      });

      res.status(200).json({
        user: newUser,
        // team: newTeam,
        teamMember: newTeamMember,
      });
    } catch (err) {
      console.error(`创建用户或团队时出错: ${err}`);
      res.status(500).json({ error: "创建用户或团队时出错" });
    }
  });
  // 获取用户
  app.get("/users/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("用户不存在");
      }

      var obj = user.toObject();

      var defaultTeam = (
        await TeamMember.findOne({
          userId,
          defaultTeam: true,
        })
      )?.toObject();

      res.json({ ...obj, id: obj._id, defaultTeamId: defaultTeam?.teamId });
    } catch (error) {
      console.error("删除用户过程中发生错误:", error);
      res.status(500).send("内部服务器错误");
    }
  });
  // 删除用户
  app.delete("/users/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).send("用户不存在");
      }

      // 删除与用户相关联的团队成员信息
      const teamDeleteResult = await TeamMember.deleteMany({ userId });
      if (teamDeleteResult.deletedCount === 0) {
        console.log(`没有找到或删除任何与用户ID ${userId} 关联的团队成员`);
      }

      // 删除用户
      await User.findByIdAndDelete(userId);

      res.send("用户删除成功");
    } catch (error) {
      console.error("删除用户过程中发生错误:", error);
      res.status(500).send("内部服务器错误");
    }
  });

  // 修改用户信息
  app.put("/users/:id", auth(), async (req, res) => {
    try {
      const _id = req.params.id;

      let { username, password, status, promotionRate, defaultTeamId } =
        req.body;

      const result = await User.findByIdAndUpdate(
        _id,
        {
          status,
          promotionRate,
          ...(username && { username }),
          ...(password && { password: hashPassword(password) }),
        },
        { new: true }
      );

      // 修改默认团队
      var defaultTeam = await TeamMember.findOne({
        userId: _id,
        defaultTeam: true,
      });
      if (defaultTeam) {
        var obj = defaultTeam.toObject();
        if (obj._id !== defaultTeamId) {
          await TeamMember.findByIdAndDelete(obj._id);

          // 插入新默认团队
          await TeamMember.create({
            teamId: defaultTeamId,
            userId: _id,
            role: "admin",
            status: "active",
            defaultTeam: true,
          });
        }
      }
      await res.json(result);
    } catch (err) {
      console.log(`Error updating user: ${err}`);
      res.status(500).json({ error: "Error updating user" });
    }
  });

  // 新增: 获取 pays 列表
  app.get("/pays", auth(), async (req, res) => {
    try {
      const start = parseInt(req.query._start) || 0;
      const end = parseInt(req.query._end) || 20;
      const order = req.query._order === "DESC" ? -1 : 1;
      const sort = req.query._sort || "_id";
      const userId = req.query.userId || "";
      const where = userId ? { userId: userId } : {};

      const paysRaw = await Pay.find({
        ...where,
      })
        .skip(start)
        .limit(end - start)
        .sort({ [sort]: order });

      const pays = [];

      for (const payRaw of paysRaw) {
        const pay = payRaw.toObject();

        const orderedPay = {
          id: pay._id.toString(),
          userId: pay.userId,
          price: pay.price,
          orderId: pay.orderId,
          status: pay.status,
          createTime: dayjs(pay.createTime).format("YYYY/MM/DD HH:mm"),
        };

        pays.push(orderedPay);
      }
      const totalCount = await Pay.countDocuments({
        ...where,
      });
      res.header("Access-Control-Expose-Headers", "X-Total-Count");
      res.header("X-Total-Count", totalCount);
      res.json(pays);
    } catch (err) {
      console.log(`Error fetching pays: ${err}`);
      res
        .status(500)
        .json({ error: "Error fetching pays", details: err.message });
    }
  });
  // 获取本月账单
  app.get("/pays/data", auth(), async (req, res) => {
    try {
      let startCount = 0;

      const paysRaw = await Pay.aggregate([
        {
          $match: {
            status: "SUCCESS",
            createTime: {
              $gte: new Date(
                Date.now() - day * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
              ), // 补时差
            },
          },
        },
        {
          $addFields: {
            adjustedCreateTime: { $add: ["$createTime", 8 * 60 * 60 * 1000] },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$adjustedCreateTime" },
              month: { $month: "$adjustedCreateTime" },
              day: { $dayOfMonth: "$adjustedCreateTime" },
            },
            count: { $sum: "$price" },
          },
        },
        {
          $project: {
            _id: 0,
            date: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            count: 1,
          },
        },
        { $sort: { date: 1 } },
      ]);

      const countResult = paysRaw.map((item) => {
        startCount += item.count;
        return {
          date: item.date,
          total: startCount,
          count: item.count,
        };
      });

      res.json(countResult);
    } catch (err) {
      console.log(`Error fetching users: ${err}`);
      res.status(500).json({ error: "Error fetching users" });
    }
  });
};
