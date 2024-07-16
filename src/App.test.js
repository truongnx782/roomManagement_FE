import { render, screen } from '@testing-library/react';
import App from './App';
import TableComponent from './TableComponent';

test('renders learn react link', () => {
  render(<TableComponent />);
  // expect(linkElement).toBeInTheDocument();
});
