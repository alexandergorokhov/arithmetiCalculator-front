import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LoginPage from './login';
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage', () => {
  it('should render login form', () => {
    render(
      <MemoryRouter>
        <LoginPage setIsLoggedIn={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should handle login success', async () => {
    const setIsLoggedInMock = jest.fn();

    render(
      <MemoryRouter>
        <LoginPage setIsLoggedIn={setIsLoggedInMock} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ result: 'mockedToken' }),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(setIsLoggedInMock).toHaveBeenCalledWith(true);
      expect(sessionStorage.getItem('token')).toEqual('mockedToken'); 
    });
  });

  it('should handle login failure', async () => {
    render(
      <MemoryRouter>
        <LoginPage setIsLoggedIn={() => {}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 403,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Access denied.')).toBeInTheDocument();
    });
  });
});
