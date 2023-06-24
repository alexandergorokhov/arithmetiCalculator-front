import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalculatorPage from './calculator';


describe('CalculatorPage', () => {
  it('should render calculator page', () => {
    render(
      <MemoryRouter>
        <CalculatorPage isLoggedIn={true} handleLogout={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Calculator' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to Records' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.getByLabelText('Number 1:')).toBeInTheDocument();
    expect(screen.getByLabelText('Number 2:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subtract' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Multiply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Divide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Square Root' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate Random String' })).toBeInTheDocument();
  });

  it('should handle addition calculation', async () => {
    const handleLogoutMock = jest.fn();

    render(
      <MemoryRouter>
        <CalculatorPage isLoggedIn={true} handleLogout={handleLogoutMock} />
      </MemoryRouter>
    );


    fireEvent.change(screen.getByLabelText('Number 1:'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Number 2:'), { target: { value: '10' } });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ result: 15 })),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(screen.getByText('Result: 15')).toBeInTheDocument(); 
    });
  });

  it('should handle logout click', () => {
    const handleLogoutMock = jest.fn();

    render(
      <MemoryRouter>
        <CalculatorPage isLoggedIn={true} handleLogout={handleLogoutMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(handleLogoutMock).toHaveBeenCalled(); 
  });
});
