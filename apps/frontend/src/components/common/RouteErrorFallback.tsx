import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';

export function RouteErrorFallback() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'The page could not be rendered.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud p-6 text-ink dark:bg-[#121816] dark:text-white">
      <Panel className="max-w-lg">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">
          Application Error
        </p>
        <h1 className="mt-3 text-2xl font-bold">Something needs attention</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65 dark:text-white/65">{message}</p>
        <div className="mt-5">
          <Button onClick={() => window.location.reload()} variant="secondary">
            Reload
          </Button>
        </div>
      </Panel>
    </main>
  );
}
