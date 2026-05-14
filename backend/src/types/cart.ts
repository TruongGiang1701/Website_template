/** Dòng giỏ guest — `id` trùng quy ước catalog (`legacy_key` hoặc `slug`). */
export type GuestCartLineDTO = {
  id: string;
  qty: number;
};

export type GuestCartDTO = {
  cartId: string;
  lines: GuestCartLineDTO[];
};
