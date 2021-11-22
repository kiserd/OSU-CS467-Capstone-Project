import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext'
import { readAssociationById } from '../backend/dao'
import { act } from 'react-dom/test-utils';

// mock functions to control return values
jest.mock('../backend/dao', () => ({
    readAssociationById: jest.fn()
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// dummy project to pass to ProjectCard as prop
const project = {
    id: 'id',
    name: 'project name',
    description: 'description',
    capacity: 5,
    census: 2,
    open: true,
    likes: 42,
    users: [],
    technologies: [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}],
}

// dummy authUser object
const fakeUser = {user: {id: 'id'}};

// dummy likes document snapshot
const fakeLikeSnap = {id: 'id', project_id: 'project id', user_id: 'user id'};

test('Dislike button renders as expected', async () => {
    // force useAuth to return object with user that has id
    useAuth.mockReturnValue(fakeUser);
    // force readAssociation() to return something !== -1
    const fakeLikeSnapPromise = Promise.resolve(fakeLikeSnap);
    readAssociationById.mockImplementation(() => fakeLikeSnapPromise);

    // ARRANGE: render component
    render(
        <ProjectCard
        initialProject={project}
        />
    );
    
    // ASSERT: make sure Dislike button renders
    expect(await screen.findByText('Dislike')).toBeInTheDocument();
    // force test to wait until promises resolve before finishing
    await act(() => fakeLikeSnapPromise);
});

test('Like button renders as expected', async () => {
    // force useAuth to return object with user that has id
    useAuth.mockReturnValue({user: {id: 'id'}});
    // foce readAssociation() to return -1 (indicating no like history)
    const fakeLikeSnapPromise = Promise.resolve(-1);
    readAssociationById.mockImplementation(() => fakeLikeSnapPromise);

    // ARRANGE: render component
    render(
        <ProjectCard
        initialProject={project}
        />
    );

    // ASSERT: make sure Like button renders
    expect(await screen.findByText('Like')).toBeInTheDocument();
    // force test to wait until promises resolve before finishing
    await act(() => fakeLikeSnapPromise);
});