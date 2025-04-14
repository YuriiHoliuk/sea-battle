import { render, screen } from '@testing-library/react';
import App from './App';

// This is just a sample test file to demonstrate testing setup
describe('App component', () => {
  it('renders without crashing', () => {
    // Mock any dependencies as needed
    render(<App />);

    // Get the main heading by its text content
    expect(screen.getByRole('heading', { name: /Sea Battle/i })).toBeInTheDocument();
  });
});
