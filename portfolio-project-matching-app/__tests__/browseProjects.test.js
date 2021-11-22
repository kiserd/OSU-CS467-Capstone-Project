import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import '@testing-library/jest-dom';
import BrowseProjects from '../pages/browseProjects';
import { readAllObjects, readAssociationById } from '../backend/dao';
import { useAuth } from '../context/AuthContext';
import { act } from 'react-dom/test-utils';
import { Project } from '../models/Project';

// mock functions to control return values
jest.mock('../backend/dao', () => ({
    readAllObjects: jest.fn(),
    readAssociationById: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// build array of project objects
const project1 = new Project();
project1.id = 'id1';
project1.name = 'Wastegram';
project1.description = 'post stuff about food waste';
project1.capacity = 5;
project1.census = 2;
project1.open = true;
project1.ownerId = 'id1';
project1.ownerRef = 'owner ref';
project1.users = [{id: 'id1', username: 'user1'}, {id: 'id2', username: 'user2'}];
project1.technologies = [{id: 'id1', name: 'Javascript'}, {id: 'id2', name: 'C++'}];
project1.owner = {id: 'id1', username: 'user1'};

const project2 = new Project();
project2.id = 'id2';
project2.name = 'Pet Finder';
project2.description = 'find lost pets';
project2.capacity = 4;
project2.census = 2;
project2.open = true;
project2.ownerId = 'id3';
project2.ownerRef = 'owner ref';
project2.users = [{id: 'id3', username: 'user3'}, {id: 'id4', username: 'user4'}];
project2.technologies = [{id: 'id3', name: 'CSS'}, {id: 'id4', name: 'React'}];
project2.owner = {id: 'id3', username: 'user3'};

const projects = [project1, project2];

const technologies = [
    {
        id: 'id1',
        name: 'Javascript',
    },
    {
        id: 'id2',
        name: 'C++',
    },
    {
        id: 'id3',
        name: 'CSS',
    },
    {
        id: 'id4',
        name: 'React',
    }
]

// dummy authUser object
const fakeUser = {user: {id: 'id'}};

// dummy likes document snapshot
const fakeLikeSnap = {id: 'id', project_id: 'project id', user_id: 'user id'};

test('Clicking available filter moves button to selected filters', async () => {
    /*
        ARRANGE
    */
    // force useAuth to return object with user that has id
    useAuth.mockReturnValue(fakeUser);
    // force readAssociation() to return something !== -1
    const fakeLikeSnapPromise = Promise.resolve(fakeLikeSnap)
    readAssociationById.mockImplementation(() => fakeLikeSnapPromise);
    // force readAllObjects to return projects and technologies
    const fakeProjectsPromise = Promise.resolve(projects);
    const fakeTechnologiesPromise = Promise.resolve(technologies);
    readAllObjects
    .mockImplementationOnce(() => fakeProjectsPromise)
    .mockImplementationOnce(() => fakeTechnologiesPromise);
    // render component
    render(<BrowseProjects />);

    /*
        ASSERT
    */
    // expect selected filters div to be empty
    expect(await screen.findByTestId('selectedFiltersDiv')).toBeEmptyDOMElement();

    /*
        ACT
    */
    // assign name to elements to improve readability
    const filterButtonsDiv = await screen.findByTestId('filterButtonsDiv');
    let jsButton = within(filterButtonsDiv).getByRole('button', {name: 'Javascript'});
    // click Javascript filter button
    userEvent.click(jsButton);

    /*
        ASSERT
    */
    // expect Javascript button to have moved to selected filters section
    jsButton = within(filterButtonsDiv).getByRole('button', {name: 'Javascript'});
    const selectedFiltersDiv = await screen.findByTestId('selectedFiltersDiv');
    expect(selectedFiltersDiv).toContainElement(jsButton);

    /*
        CLEANUP
    */
    // force test to wait until promises resolve before finishing
    await act(() => fakeLikeSnapPromise);
    await act(() => fakeProjectsPromise);
    await act(() => fakeTechnologiesPromise);
});