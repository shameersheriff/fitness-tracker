import { Outlet } from 'react-router-dom';

import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cloud text-ink dark:bg-[#121816] dark:text-white">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
