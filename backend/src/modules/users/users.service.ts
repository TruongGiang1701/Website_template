import { Injectable } from "@nestjs/common";
import {
  getUserProfileById,
  updateUserSettingsByUserId,
} from "./users.repository";

@Injectable()
export class UsersService {
  getProfile(userId: string) {
    return getUserProfileById(userId);
  }

  updateSettings(userId: string, patch: Record<string, unknown>) {
    return updateUserSettingsByUserId(userId, patch);
  }
}
