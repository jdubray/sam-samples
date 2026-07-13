import { render, screen } from '@testing-library/react';
import App from './App';

test('renders two SAM-provided counters', async () => {
  render(<App />);
  const counters = await screen.findAllByText(/Count:/i);
  expect(counters).toHaveLength(2);
  expect(screen.getAllByText(/Increment by 1/i)).toHaveLength(2);
});
