import {
  createNumberField,
  createTextField,
  createSelectField,
  createReferenceField,
} from "tushan";
const OwnerPermissionVal = ~0 >>> 0;

export const userFields = [
  createTextField("id", { label: "ID" }),
  createTextField("username", {
    label: "用户名",
    create: {
      disabled: false,
    },
    edit: {
      rules: [{ required: true }],
      disabled: true,
    },
  }),
  createReferenceField("defaultTeamId", {
    label: "默认团队",
    reference: "teams",
    displayField: "name",
    create: {
      rules: [{ required: false }],
    },
    edit: {
      rules: [{ required: true }],
    },
  }),
  // createNumberField('balance', { label: '余额（元）', list: { sort: true } }),
  createTextField("createTime", {
    label: "创建时间",
    list: { sort: true },
    edit: { hidden: true },
  }),
  // createTextField('avatar', { label: '头像' }),
  createSelectField("status", {
    label: "状态",
    edit: {
      rules: [{ required: true }],
    },
    create: { hidden: true },
    items: [
      {
        value: "active",
        label: "激活",
        color: "green",
      },
      {
        value: "forbidden",
        label: "禁用",
        color: "red",
      },
    ],
  }),
  createSelectField("promotionRate", {
    label: "权 限",
    edit: {
      rules: [{ required: true }],
    },
    items: [
      {
        value: 0b100,
        label: "读权限",
      },
      {
        value: 0b110,
        label: "写权限",
      },
      {
        value: 0b111,
        label: "管理员",
      },
      {
        value: 0b1111,
        label: "ROOT",
      },
    ],
  }),
  createTextField("password", {
    label: "密码",
    create: {
      rules: [{ required: true }],
    },
    list: { hidden: true },
  }),
  // createTextField('lastLoginTmbId', { label: '最后登录团队ID', })
];

export const payFields = [
  createTextField("id", { label: "ID" }),
  createTextField("userId", { label: "用户Id" }),
  createNumberField("price", { label: "支付金额" }),
  createTextField("orderId", { label: "orderId" }),
  createTextField("status", { label: "状态" }),
  createTextField("createTime", { label: "创建时间", list: { sort: true } }),
];

export const kbFields = [
  createTextField("id", { label: "ID" }),
  createReferenceField("userId", {
    label: "所属用户",
    reference: "team-member",
    displayField: "username",
    edit: { hidden: true },
  }),
  createTextField("name", { label: "知识库" }),
  createTextField("tags", { label: "Tags" }),
];

export const AppFields = [
  createTextField("id", { label: "ID" }),
  createTextField("userId", {
    label: "所属用户",
    list: { hidden: true },
    edit: { hidden: true },
  }),
  createTextField("name", { label: "名字" }),
  createTextField("app", { label: "应用", edit: { hidden: true } }),
  createTextField("share.collection", {
    label: "收藏数",
    list: { sort: true },
  }),
  createTextField("share.topNum", { label: "置顶等级", list: { sort: true } }),
  createTextField("share.isShare", { label: "是否分享(true,false)" }),
  createTextField("intro", { label: "介绍", list: { width: 400 } }),
  createTextField("relatedKbs", {
    label: "引用的知识库",
    list: { hidden: true },
  }),
  createTextField("temperature", { label: "温度" }),
  createTextField("systemPrompt", {
    label: "提示词",
    list: {
      width: 400,
      hidden: true,
    },
  }),
];

export const teamFields = [
  createTextField("id", { label: "ID" }),
  createTextField("name", {
    label: "名称",
    edit: {
      rules: [{ required: true }],
    },
  }),
  // createTextField("ownerId", { label: "所有者" }),
  createReferenceField("ownerId", {
    label: "所有者",
    reference: "users",
    displayField: "username",
    edit: {
      rules: [{ required: true }],
    },
  }),
  createSelectField("defaultPermission", {
    label: "成员默认权限",
    edit: {
      rules: [{ required: true }],
    },
    items: [
      {
        value: 0b100,
        label: "读权限",
      },
      {
        value: 0b110,
        label: "写权限",
      },
      {
        value: 0b111,
        label: "管理员",
      },
      {
        value: OwnerPermissionVal,
        label: "所有者",
      },
    ],
  }),
];

export const teamMemberFields = [
  createTextField("id", { label: "ID" }),
  createReferenceField("userId", {
    label: "成员",
    reference: "users",
    displayField: "username",
    list: { hidden: true },
    detail: { hidden: true },
    create: {
      disabled: false,
      rules: [{ required: true }],
    },
    edit: {
      disabled: true,
    },
  }),
  createTextField("username", {
    label: "成员",
    edit: {
      hidden: true,
    },
  }),
  createReferenceField("teamId", {
    label: "团队",
    reference: "teams",
    displayField: "name",
    list: { hidden: true },
    detail: { hidden: true },
    create: {
      disabled: false,
      rules: [{ required: true }],
    },
    edit: {
      disabled: true,
    },
  }),
  createTextField("teamName", {
    label: "团队",
    edit: {
      hidden: true,
    },
  }),
  createTextField("name", {
    label: "昵称",
    create: {
      rules: [{ required: false }],
    },
    edit: {
      rules: [{ required: true }],
    },
  }),
  createSelectField("role", {
    label: "角色",
    edit: {
      rules: [{ required: true }],
    },
    items: [
      { value: "visitor", label: "访客" },
      { value: "admin", label: "管理员" },
      { value: "owner", label: "创建者", disabled: true },
    ],
  }),
  createSelectField("status", {
    label: "状态",
    edit: {
      rules: [{ required: true }],
    },
    create: { hidden: true },
    items: [
      { value: "active", label: "已加入" },
      { value: "leave", label: "离开" },
      { value: "waiting", label: "待接受" },
      { value: "reject", label: "拒绝" },
    ],
  }),
  createSelectField("defaultTeam", {
    label: "默认团队",
    edit: {
      rules: [{ required: true }],
    },
    items: [
      { value: true, label: "是" },
      { value: false, label: "否" },
    ],
  }),
];
