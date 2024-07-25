import mongoose from "mongoose";
import { TeamCollectionName, TeamMemberCollectionName, PerResourceTypeEnum } from "../constant/constant.js";

export const ResourcePermissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TeamCollectionName,
  },
  tmbId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TeamMemberCollectionName,
  },
  resourceType: {
    type: String,
    enum: Object.values(PerResourceTypeEnum),
    required: true,
  },
  permission: {
    type: Number,
    required: true,
  },
  // Resrouce ID: App or DataSet or any other resource type.
  // It is null if the resourceType is team.
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
