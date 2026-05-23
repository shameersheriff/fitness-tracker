import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Calendar, KeyRound, Loader2, Moon, Ruler, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PageHeader } from '@/components/common/PageHeader';
import { useToast } from '@/components/common/ToastProvider';
import { SelectField } from '@/components/forms/SelectField';
import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { fitnessApi } from '@/services/fitnessApi';
import { useThemeStore } from '@/stores/themeStore';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the new password'),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SettingsPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { notify } = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onPasswordSubmit(values: PasswordFormValues) {
    setServerError(null);

    try {
      await fitnessApi.settings.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      notify({ title: 'Password updated successfully' });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to update password');
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Configure theme, units, week structure, and notification preferences."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <Moon className="h-5 w-5" aria-hidden />
            Appearance
          </h2>
          <SelectField
            label="Theme"
            onChange={(event) => setTheme(event.target.value as 'system' | 'light' | 'dark')}
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
            value={theme}
          />
        </Panel>
        <Panel>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <Ruler className="h-5 w-5" aria-hidden />
            Units
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Weight"
              options={[
                { label: 'Pounds', value: 'lbs' },
                { label: 'Kilograms', value: 'kg' },
              ]}
              defaultValue="lbs"
            />
            <SelectField
              label="Distance"
              options={[
                { label: 'Miles', value: 'mi' },
                { label: 'Kilometers', value: 'km' },
              ]}
              defaultValue="mi"
            />
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <Calendar className="h-5 w-5" aria-hidden />
            Planning
          </h2>
          <SelectField
            label="Week starts on"
            options={[
              { label: 'Monday', value: 'MONDAY' },
              { label: 'Sunday', value: 'SUNDAY' },
            ]}
            defaultValue="MONDAY"
          />
        </Panel>
        <Panel>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <Bell className="h-5 w-5" aria-hidden />
            Notifications
          </h2>
          <div className="space-y-3">
            {['Workout reminders', 'Meal reminders', 'Water reminders', 'Weigh-in reminders'].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center justify-between gap-4 rounded-md bg-cloud p-3 text-sm font-medium dark:bg-white/10"
                >
                  <span>{item}</span>
                  <input className="h-5 w-5 accent-moss" type="checkbox" defaultChecked />
                </label>
              ),
            )}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-ink dark:text-white">
            <KeyRound className="h-5 w-5" aria-hidden />
            Password
          </h2>
          <form
            className="space-y-4"
            noValidate
            onSubmit={(event) => {
              void handleSubmit(onPasswordSubmit)(event);
            }}
          >
            <TextField
              label="Current password"
              type="password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <TextField
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {serverError ? (
              <p className="rounded-md bg-coral/10 px-3 py-2 text-sm font-medium text-coral">
                {serverError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            >
              {isSubmitting ? 'Updating password...' : 'Update Password'}
            </Button>
          </form>
        </Panel>
      </div>
      <div className="mt-6">
        <Button icon={<Save className="h-4 w-4" aria-hidden />}>Save Settings</Button>
      </div>
    </>
  );
}
