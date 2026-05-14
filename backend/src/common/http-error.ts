import { HttpException, HttpStatus } from "@nestjs/common";

export function apiError(message: string, status = HttpStatus.INTERNAL_SERVER_ERROR) {
  return new HttpException({ ok: false, error: message }, status);
}

export function asPlainObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw apiError("Payload phải là object JSON", HttpStatus.BAD_REQUEST);
  }
  return value as Record<string, unknown>;
}
