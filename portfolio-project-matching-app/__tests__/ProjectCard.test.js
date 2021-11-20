import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ProjectCard from '../components/ProjectCard';

test('ProjectCard tests', () => {
    // dummy props to pass to FilterButtons component
    // const choices = [
    //     {id: 1, name: 'Javascript'},
    //     {id: 2, name: 'CSS'},
    //     {id: 3, name: 'Golang'}
    // ];
    // const category = 'myCategory';
    // const onAdd = jest.fn();
    // const onRemove = jest.fn();

    const project = {
        name: 'project name',
        description: 'description',
        capacity: 5,
        census: 2,
        open: true,
        likes: 42,
        users: [],
        technologies: [],
    }

    // ARRANGE
    render(
        <ProjectCard
        initialProject={project}
        />
    );
    
    // mocking DB interaction for after like project branch merged
    // SOURCE: https://reactjs.org/docs/testing-recipes.html
    // const fakeUser = {
    //     name: "Joni Baez",
    //     age: "32",
    //     address: "123, Charming Avenue"
    // };
    // jest.spyOn(global, "fetch").mockImplementation(() =>
    //     Promise.resolve({
    //     json: () => Promise.resolve(fakeUser)
    //     })
    // );

    screen.debug();

    // // create some helper variable to improve readability
    // const availableFiltersDiv = screen.getByTestId('availableFiltersDiv');
    // const selectedFiltersDiv = screen.getByTestId('selectedFiltersDiv');
    // let jsButton = screen.getByRole('button', {name: 'Javascript'});

    // // ASSERT
    // // the JS button should reside in the available filters div
    // expect(availableFiltersDiv).toContainElement(jsButton);
    // // the JS button should NOT reside in the selected filters div
    // expect(selectedFiltersDiv).not.toContainElement(jsButton);

    // // ACT: simulate user clicking the JS filter button 
    // userEvent.click(jsButton);

    // // re-bind jsButton variable to new button
    // jsButton = screen.getByRole('button', {name: 'Javascript'});

    // // ASSERT
    // // the JS button should NOT reside in the available filters div
    // expect(availableFiltersDiv).not.toContainElement(jsButton);
    // // the JS button should reside in the selected filters div
    // expect(selectedFiltersDiv).toContainElement(jsButton);
});