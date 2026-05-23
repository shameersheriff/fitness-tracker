import { zodResolver } from '@hookform/resolvers/zod';
import { Dumbbell, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { TextField } from '@/components/forms/TextField';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/services/authApi';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const payload = await authApi.login(values.email, values.password);
      setAuth(payload.token, payload.user);
      await navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cloud px-4 dark:bg-[#121816]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-moss text-white dark:bg-mint dark:text-ink">
            <Dumbbell className="h-7 w-7" aria-hidden />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-ink dark:text-white">Fitness Tracker</h1>
            <p className="mt-1 text-sm text-ink/55 dark:text-white/55">Sign in to your account</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-[#141b19]">
          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            noValidate
            className="space-y-4"
          >
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {serverError ? (
              <p className="rounded-md bg-coral/10 px-3 py-2 text-sm font-medium text-coral">
                {serverError}
              </p>
            ) : null}

            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={isSubmitting}
              icon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
