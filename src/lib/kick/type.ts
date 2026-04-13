export type KickUser = {
  user_id: number;
  name: string;
  email?: string;
  profile_picture?: string;
};

export type KickChannel = {
  broadcaster_user_id: number;
  slug: string;
  stream?: {
    is_live: boolean;
    viewer_count?: number;
    thumbnail?: string;
  };
};

export type KickReward = {
  id: string;
  title: string;
  description?: string | null;
  cost: number;
  background_color?: string | null;
  is_enabled: boolean;
  is_paused: boolean;
  is_user_input_required: boolean;
  should_redemptions_skip_request_queue: boolean;
};

export type KickApiListResponse<T> = {
  data: T[];
  message?: string;
};

export type KickApiItemResponse<T> = {
  data: T;
  message?: string;
};