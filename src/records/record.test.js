import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecordsPage from './records';

describe('RecordsPage', () => {
  const mockNavigate = jest.fn();
  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders RecordsPage component', () => {
    render(
      <MemoryRouter>
        <RecordsPage isLoggedIn={true} handleLogout={mockHandleLogout} />
      </MemoryRouter>
    );

    expect(screen.getByText('Records')).toBeInTheDocument();
    expect(screen.getByText('Go to Calculator')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

});
