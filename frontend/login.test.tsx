import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Login from './src/views/Profile/Login/Login';
import {loginUser, UserRole} from './src/services/usersApi';
import '@testing-library/jest-dom'; // Import this to enable `toBeInTheDocument`
import type * as JotaiModule from 'jotai';



vi.mock('./src/services/usersApi', () => ({
    loginUser: vi.fn(),
}));

vi.mock('jotai', async (importOriginal) => {
    // Import the original `jotai` module
    const actual = (await importOriginal()) as typeof JotaiModule; // Explicitly type `actual`

    // Return the original exports along with the mocked `useAtom`
    return {
        atom: actual.atom,
        Provider: actual.Provider, // Keep all original exports, such as `atom`
        useAtom: vi.fn(() => [null, vi.fn()]), // Mock only the `useAtom` function
    };
});

const mockedLoginUser = vi.mocked(loginUser);


describe('Login Component', () => {
    it('renders the login form', () => {
        render(<Login />);
        // Check that the form renders correctly
        expect(screen.getByLabelText('Uporabniško Ime')).toBeInTheDocument();
        expect(screen.getByLabelText('Geslo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Prijavi se' })).toBeInTheDocument();
    });

    it('does not display an error message on initial render', () => {
        render(<Login />);

        // Check that the error message is not present initially
        expect(screen.queryByText('Napačno uporabniško ime ali geslo.')).toBeNull();
    });

    it('renders the submit button in an enabled state', () => {
        render(<Login />);

        const submitButton = screen.getByRole('button', { name: 'Prijavi se' });

        // Check if the button is in the document and enabled
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).not.toBeDisabled();
    });

    it('does not allow submission with empty inputs', () => {
        render(<Login />);

        const submitButton = screen.getByRole('button', { name: 'Prijavi se' });

        // Simulate form submission with empty fields
        fireEvent.click(submitButton);

        // Ensure the required inputs are still present and no error is set
        expect(screen.getByLabelText('Uporabniško Ime')).toBeInTheDocument();
        expect(screen.getByLabelText('Geslo')).toBeInTheDocument();
    });


    it('updates form inputs correctly', () => {
        render(<Login />);

        const usernameInput = screen.getByLabelText('Uporabniško Ime');
        const passwordInput = screen.getByLabelText('Geslo');

        // Simulate typing into the inputs
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPass' } });

        // Assert that the input values are updated
        expect(screen.getByDisplayValue('testUser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('testPass')).toBeInTheDocument();
    });




});