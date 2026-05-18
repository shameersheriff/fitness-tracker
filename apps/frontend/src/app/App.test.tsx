import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the dashboard route shell', async () => {
    render(<App />);

    expect((await screen.findAllByText('Dashboard')).length).toBeGreaterThan(0);
    expect(screen.getByText('Fitness Tracker')).toBeInTheDocument();
  });
});
