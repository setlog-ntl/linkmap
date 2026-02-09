import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase client before importing the hook
const mockSelect = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockUpdate = vi.fn().mockReturnThis();
const mockDelete = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockOrder = vi.fn();
const mockSingle = vi.fn();

const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
  eq: mockEq,
  order: mockOrder,
  single: mockSingle,
}));

// Chain properly for select().order()
mockSelect.mockReturnValue({
  order: mockOrder,
  single: mockSingle,
  eq: mockEq,
});

// Chain for insert().select().single()
mockInsert.mockReturnValue({
  select: vi.fn().mockReturnValue({
    single: mockSingle,
  }),
});

// Chain for delete().eq()
mockDelete.mockReturnValue({
  eq: mockEq,
});

// Chain for update().eq()
mockUpdate.mockReturnValue({
  eq: mockEq,
});

const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: 'test-user-id' } },
  error: null,
});

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
    auth: { getUser: mockGetUser },
  }),
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useProjects } from './use-projects';

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockEq.mockResolvedValue({ data: null, error: null });
    mockSingle.mockResolvedValue({ data: { id: 'new-project' }, error: null });
  });

  it('should fetch projects on mount', async () => {
    const mockProjects = [
      { id: '1', name: 'Project 1', project_services: [] },
      { id: '2', name: 'Project 2', project_services: [] },
    ];
    mockOrder.mockResolvedValueOnce({ data: mockProjects, error: null });

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.projects).toEqual(mockProjects);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'Fetch failed' } });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.projects).toEqual([]);
  });

  it('should create a project', async () => {
    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createProject('New Project', 'Description');
    });

    expect(mockFrom).toHaveBeenCalledWith('projects');
  });

  it('should throw if not logged in when creating', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null });

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.createProject('Test');
      })
    ).rejects.toThrow('로그인이 필요합니다.');
  });

  it('should delete a project', async () => {
    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteProject('project-1');
    });

    expect(mockFrom).toHaveBeenCalledWith('projects');
  });
});
