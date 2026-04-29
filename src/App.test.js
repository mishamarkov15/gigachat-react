import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-markdown', () => {
  return function ReactMarkdownMock({ children }) {
    return <div>{children}</div>;
  };
});

test('renders auth form first', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /авторизация/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/credentials/i)).toBeInTheDocument();
});
