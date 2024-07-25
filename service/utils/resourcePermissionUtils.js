import { ResourcePermission } from "../schema/index.js";
import { TeamMemberRoleEnum, OwnerPermissionVal, ReadPermissionVal, ManagePermissionVal } from "../constant/constant.js";

export const updateResourcePer = async function ({
  teamId,
  tmbId,
  resourceType,
  permission,
  resourceId,
}) {
  let rp = await ResourcePermission.findOne({
    teamId,
    tmbId,
    resourceType,
    resourceId,
  });

  if (rp == null) {
    rp = await ResourcePermission.create({
      teamId,
      tmbId,
      resourceType,
      permission,
      resourceId,
    });
  } else {
    rp = await ResourcePermission.findByIdAndUpdate(
      rp._id,
      {
        teamId,
        tmbId,
        resourceType,
        permission,
        resourceId,
      },
      { new: true }
    );
  }

  return rp;
};

export const getPerValue = function (teamRole) {
  switch (teamRole) {
    case TeamMemberRoleEnum.owner:
      return OwnerPermissionVal;
    case TeamMemberRoleEnum.admin:
      return ManagePermissionVal;
    case TeamMemberRoleEnum.visitor:
      return ReadPermissionVal;
  }
};
