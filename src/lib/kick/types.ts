// FILE: src/lib/kick/types.ts

export type KickApiListResponse<T> = {
  data: T[];
  message?: string;
};

export type KickApiItemResponse<T> = {
  data: T;
  message?: string;
};

export type KickUser = {
  user_id: number;
  name: string;
  email?: string | null;
  profile_picture?: string | null;
};

export type KickChannel = {
  id: number | string;
  user_id?: number | string;
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  language?: string | null;
  is_live?: boolean;
};

export type KickReward = {
  id: number | string;
  title: string;
  cost: number;
  description?: string | null;
  background_color?: string | null;
  is_enabled?: boolean;
  is_paused?: boolean;
  is_user_input_required?: boolean;
  should_redemptions_skip_request_queue?: boolean;
};