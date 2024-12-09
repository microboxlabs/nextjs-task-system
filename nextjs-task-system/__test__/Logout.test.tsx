import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
import { signOut } from 'next-auth/react';
import Logout from '@/components/Logout';

// Mock de next-auth
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('Logout Component', () => {
  it('renders the logout button', () => {
    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut when the button is clicked', () => {
    render(<Logout />);
    const button = screen.getByRole('button', { name: /logout/i });

    // Simular clic en el botón
    fireEvent.click(button);

    // Verificar si signOut fue llamado
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
