import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-markdown', () => {
  return function ReactMarkdownMock({ children }) {
    return <div>{children}</div>;
  };
});

test('renders chat interface', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /новый чат/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/сообщение/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /новый чат/i }).length).toBeGreaterThan(0);
});
