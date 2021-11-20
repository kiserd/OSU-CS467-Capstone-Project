import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import FilterButtons from '../components/FilterButtons';

test('Clicking filter button changes button class appropriately', () => {
    // dummy props to pass to FilterButtons component
    const choices = [
        {id: 1, name: 'Javascript'},
        {id: 2, name: 'CSS'},
        {id: 3, name: 'Golang'}
    ];
    const category = 'myCategory';
    const onAdd = jest.fn();
    const onRemove = jest.fn();

    // ARRANGE
    render(
        <FilterButtons
        onAdd={onAdd}
        onRemove={onRemove}
        category={category}
        choices={choices}
        />
    );

    // create some helper variable to improve readability
    const availableFiltersDiv = screen.getByTestId('availableFiltersDiv');
    const selectedFiltersDiv = screen.getByTestId('selectedFiltersDiv');
    let jsButton = screen.getByRole('button', {name: 'Javascript'});

    // ASSERT
    // the JS button should reside in the available filters div
    expect(availableFiltersDiv).toContainElement(jsButton);
    // the JS button should NOT reside in the selected filters div
    expect(selectedFiltersDiv).not.toContainElement(jsButton);

    // ACT: simulate user clicking the JS filter button 
    userEvent.click(jsButton);

    // re-bind jsButton variable to new button
    jsButton = screen.getByRole('button', {name: 'Javascript'});

    // ASSERT
    // the JS button should NOT reside in the available filters div
    expect(availableFiltersDiv).not.toContainElement(jsButton);
    // the JS button should reside in the selected filters div
    expect(selectedFiltersDiv).toContainElement(jsButton);
});