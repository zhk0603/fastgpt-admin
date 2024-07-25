export const TeamCollectionName = "teams";
export const TeamMemberCollectionName = "team_members";
export const TeamTagsCollectionName = "team_tags";

export const PerResourceTypeEnum = {
  team: "team",
  app: "app",
  dataset: "dataset",
};

export const PermissionKeyEnum = {
  read: "read",
  write: "write",
  manage: "manage",
};

export const PermissionList = {
  [PermissionKeyEnum.read]: {
    name: "读权限",
    description: "",
    value: 0b100,
    checkBoxType: "single",
  },
  [PermissionKeyEnum.write]: {
    name: "写权限",
    description: "",
    value: 0b110, // 如果某个资源有特殊要求，再重写这个值
    checkBoxType: "single",
  },
  [PermissionKeyEnum.manage]: {
    name: "管理员",
    description: "",
    value: 0b111,
    checkBoxType: "single",
  },
};

export const NullPermission = 0;
export const OwnerPermissionVal = ~0 >>> 0;
export const ReadPermissionVal = PermissionList["read"].value;
export const WritePermissionVal = PermissionList["write"].value;
export const ManagePermissionVal = PermissionList["manage"].value;

// 团队 - 成员角色
export const TeamMemberRoleEnum = {
  owner: "owner",
  admin: "admin",
  visitor: "visitor",
};

export const TeamMemberRoleMap = {
  [TeamMemberRoleEnum.owner]: {
    value: TeamMemberRoleEnum.owner,
    label: "user.team.role.Owner",
  },
  [TeamMemberRoleEnum.admin]: {
    value: TeamMemberRoleEnum.admin,
    label: "user.team.role.Admin",
  },
  [TeamMemberRoleEnum.visitor]: {
    value: TeamMemberRoleEnum.visitor,
    label: "user.team.role.Visitor",
  },
};

// 团队 - 成员状态
const TeamMemberStatusEnum = {
  waiting: "waiting",
  active: "active",
  reject: "reject",
  leave: "leave",
};

export const TeamMemberStatusMap = {
  [TeamMemberStatusEnum.waiting]: {
    label: "user.team.member.waiting",
    color: "orange.600",
  },
  [TeamMemberStatusEnum.active]: {
    label: "user.team.member.active",
    color: "green.600",
  },
  [TeamMemberStatusEnum.reject]: {
    label: "user.team.member.reject",
    color: "red.600",
  },
  [TeamMemberStatusEnum.leave]: {
    label: "user.team.member.leave",
    color: "red.600",
  },
};

export const notLeaveStatus = { $ne: TeamMemberStatusEnum.leave };

export const UserStatusEnum = {
  active: "active",
  forbidden: "forbidden",
};

export const userStatusMap = {
  [UserStatusEnum.active]: {
    label: "support.user.status.active",
  },
  [UserStatusEnum.forbidden]: {
    label: "support.user.status.forbidden",
  },
};

// 定义应用类型映射
export const AppTypeEnum = {
  simple: "simple",
  advanced: "advanced",
};

export const AppTypeMap = {
  [AppTypeEnum.simple]: {
    label: "simple",
  },
  [AppTypeEnum.advanced]: {
    label: "advanced",
  },
};

// 默认的 Whisper 配置
export const defaultWhisperConfig = {
  open: false,
  autoSend: false,
  autoTTSResponse: false,
};

// 默认的问题指南文本配置
export const defaultQuestionGuideTextConfig = {
  open: false,
  textList: [],
  customURL: "",
};

export const AuthUserTypeEnum = {
  token: "token",
  root: "root",
  apikey: "apikey",
  outLink: "outLink",
  teamDomain: "teamDomain",
};

export const PermissionTypeEnum = {
  private: "private",
  public: "public",
};

// 权限类型映射
export const PermissionTypeMap = {
  [PermissionTypeEnum.private]: {
    iconLight: "support/permission/privateLight",
    label: "permission.Private",
  },
  [PermissionTypeEnum.public]: {
    iconLight: "support/permission/publicLight",
    label: "permission.Public",
  },
};

export const ResourceTypeEnum = {
  team: "team",
  app: "app",
  dataset: "dataset",
};
