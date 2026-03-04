export type FeatureRequestCategory = 'feature' | 'bug' | 'improvement';
export type FeatureRequestStatus =
  | 'pending'
  | 'in_review'
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export type FeedbackSortOrder = 'votes' | 'newest' | 'oldest';

export interface FeatureRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: FeatureRequestCategory;
  status: FeatureRequestStatus;
  vote_count: number;
  admin_note: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureRequestAuthor {
  name: string | null;
  avatar_url: string | null;
}

export interface FeatureRequestWithMeta extends FeatureRequest {
  author: FeatureRequestAuthor;
  has_voted: boolean;
  comment_count: number;
}

export interface FeatureRequestComment {
  id: string;
  feature_request_id: string;
  user_id: string;
  content: string;
  is_admin_comment: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureRequestCommentWithAuthor extends FeatureRequestComment {
  author: FeatureRequestAuthor;
}

export interface FeedbackListParams {
  category?: FeatureRequestCategory;
  status?: FeatureRequestStatus;
  sort?: FeedbackSortOrder;
  page?: number;
  limit?: number;
}

export interface FeedbackListResponse {
  items: FeatureRequestWithMeta[];
  total: number;
  page: number;
  limit: number;
}
