import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastProvider } from '@/components/common/ToastProvider';
import { fitnessApi } from '@/services/fitnessApi';
import type { WorkoutType } from '@fitness-tracker/shared-types';

import { WorkoutTypesPage } from './WorkoutTypesPage';

vi.mock('@/services/fitnessApi', () => ({
  fitnessApi: {
    workoutTypes: {
      create: vi.fn(),
      list: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
    },
  },
}));

const workoutType: WorkoutType = {
  id: 'type-1',
  name: 'Strength',
  description: 'Progressive overload and barbell patterns',
  trackingType: 'SETS_REPS',
  createdAt: '2026-05-19T00:00:00.000Z',
  updatedAt: '2026-05-19T00:00:00.000Z',
};

const workoutTypesApi = vi.mocked(fitnessApi.workoutTypes);

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <WorkoutTypesPage />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe('WorkoutTypesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    workoutTypesApi.list.mockResolvedValue([workoutType]);
    workoutTypesApi.update.mockImplementation((id, payload) =>
      Promise.resolve({
        ...workoutType,
        ...payload,
        id,
        updatedAt: '2026-05-20T00:00:00.000Z',
      }),
    );
    workoutTypesApi.remove.mockResolvedValue(true);
  });

  it('updates a workout type from the edit modal', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Strength' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('heading', { name: 'Edit Workout Type' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Strength');

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Power' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update Type' }));

    await waitFor(() =>
      expect(workoutTypesApi.update).toHaveBeenCalledWith(
        'type-1',
        expect.objectContaining({ name: 'Power' }),
      ),
    );
    expect(await screen.findByRole('heading', { name: 'Power' })).toBeInTheDocument();
  });

  it('deletes a workout type after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderPage();

    expect(await screen.findByRole('heading', { name: 'Strength' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => expect(workoutTypesApi.remove).toHaveBeenCalledWith('type-1'));
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Strength' })).not.toBeInTheDocument(),
    );
  });
});
