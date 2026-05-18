import { Bell, Calendar, Moon, Ruler, Save } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { SelectField } from '@/components/forms/SelectField';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { useThemeStore } from '@/stores/themeStore';

export function SettingsPage() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

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
            {['Workout reminders', 'Meal reminders', 'Water reminders', 'Weigh-in reminders'].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-md bg-cloud p-3 text-sm font-medium dark:bg-white/10">
                <span>{item}</span>
                <input className="h-5 w-5 accent-moss" type="checkbox" defaultChecked />
              </label>
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <Button icon={<Save className="h-4 w-4" aria-hidden />}>Save Settings</Button>
      </div>
    </>
  );
}
