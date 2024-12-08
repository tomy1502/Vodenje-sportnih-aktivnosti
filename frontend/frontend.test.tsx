import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest'; // Ensure `vi` and `expect` come from Vitest
import EventFilter, {eventFilterEmpty} from './src/views/Events/EventFilter/EventFilter';



describe('EventFilter Component', () => {
    it('calls onFilterUpdate when inputs change', () => {
        const mockOnFilterUpdate = vi.fn(); // Mock function
        render(<EventFilter onFilterUpdate={mockOnFilterUpdate} />);

        const keywordsInput = screen.getByLabelText('Keywords');

        fireEvent.change(keywordsInput, { target: { value: 'conference' } });

        expect(mockOnFilterUpdate).toHaveBeenCalledWith({
            text: 'conference',
            date: '',
            location: '',
        });
    });

    it('resets all fields when clear button is clicked', () => {
        const mockOnFilterUpdate = vi.fn();
        render(<EventFilter onFilterUpdate={mockOnFilterUpdate} />);

        fireEvent.change(screen.getByLabelText('Keywords'), { target: { value: 'conference' } });
        fireEvent.change(screen.getByLabelText('Date until'), { target: { value: '2023-12-31' } });
        fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });

        fireEvent.click(screen.getByTitle('Clear filter'));

        expect(mockOnFilterUpdate).toHaveBeenCalledWith({
            text: '',
            date: '',
            location: '',
        });
    });

    it('resets the filter when the clear button is clicked', () => {
        const mockOnFilterUpdate = vi.fn();
        render(<EventFilter onFilterUpdate={mockOnFilterUpdate} />);

        const clearButton = screen.getByTitle('Clear filter');
        fireEvent.click(clearButton);

        // Verify the filter was reset
        expect(mockOnFilterUpdate).toHaveBeenCalledWith(eventFilterEmpty);
    });

    it('does not call onFilterUpdate with an empty input', () => {
        const mockOnFilterUpdate = vi.fn();
        render(<EventFilter onFilterUpdate={mockOnFilterUpdate} />);

        const keywordsInput = screen.getByLabelText('Keywords');
        fireEvent.change(keywordsInput, { target: { value: '' } });

        expect(mockOnFilterUpdate).not.toHaveBeenCalled();
    });

    it('updates the button style when a filter is applied', () => {
        render(<EventFilter onFilterUpdate={vi.fn()} />);

        const clearButton = screen.getByTitle('Clear filter');

        // Check the initial computed color
        const initialColor = getComputedStyle(clearButton).color;
        expect(initialColor).toBe('rgb(128, 128, 128)'); // Equivalent of grey

        // Simulate applying a filter
        fireEvent.change(screen.getByLabelText('Keywords'), { target: { value: 'conference' } });

        // Check the updated computed color
        const updatedColor = getComputedStyle(clearButton).color;
        expect(updatedColor).toBe('rgb(13, 110, 253)'); // Equivalent of #0d6efd (blue)
    });



    it('updates individual filter values without affecting others', () => {
        const mockOnFilterUpdate = vi.fn();
        render(<EventFilter onFilterUpdate={mockOnFilterUpdate} />);

        // Simulate updating the "Date until" filter
        fireEvent.change(screen.getByLabelText('Date until'), { target: { value: '2023-12-31' } });

        // Verify the mock function is called with only the date updated
        expect(mockOnFilterUpdate).toHaveBeenCalledWith({
            text: '',
            date: '2023-12-31',
            location: '',
        });

        // Simulate updating the "Location" filter
        fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });

        // Verify the mock function is called with only the location updated
        expect(mockOnFilterUpdate).toHaveBeenCalledWith({
            text: '',
            date: '2023-12-31', // Date should remain unchanged
            location: 'New York',
        });
    });




});






