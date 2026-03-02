import { z } from 'zod';

export const createFeedbackSchema = z.object({
  title: z
    .string()
    .min(5, '제목은 5자 이상이어야 합니다')
    .max(100, '제목은 100자 이하여야 합니다'),
  description: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다')
    .max(2000, '내용은 2000자 이하여야 합니다'),
  category: z.enum(['feature', 'bug', 'improvement'], {
    error: '올바른 카테고리를 선택해주세요',
  }),
});

export const updateFeedbackSchema = z.object({
  title: z
    .string()
    .min(5, '제목은 5자 이상이어야 합니다')
    .max(100, '제목은 100자 이하여야 합니다')
    .optional(),
  description: z
    .string()
    .min(10, '내용은 10자 이상이어야 합니다')
    .max(2000, '내용은 2000자 이하여야 합니다')
    .optional(),
  category: z
    .enum(['feature', 'bug', 'improvement'], {
      error: '올바른 카테고리를 선택해주세요',
    })
    .optional(),
  // 관리자 전용 필드 (API에서 isAdmin 확인 후 처리)
  status: z
    .enum(['pending', 'in_review', 'planned', 'in_progress', 'completed', 'rejected'])
    .optional(),
  admin_note: z.string().max(2000).nullable().optional(),
});

export const createFeedbackCommentSchema = z.object({
  content: z
    .string()
    .min(1, '댓글을 입력해주세요')
    .max(1000, '댓글은 1000자 이하여야 합니다'),
});

export const feedbackListQuerySchema = z.object({
  category: z.enum(['feature', 'bug', 'improvement']).optional(),
  status: z
    .enum(['pending', 'in_review', 'planned', 'in_progress', 'completed', 'rejected'])
    .optional(),
  sort: z.enum(['votes', 'newest', 'oldest']).optional().default('votes'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;
export type CreateFeedbackCommentInput = z.infer<typeof createFeedbackCommentSchema>;
export type FeedbackListQuery = z.infer<typeof feedbackListQuerySchema>;
