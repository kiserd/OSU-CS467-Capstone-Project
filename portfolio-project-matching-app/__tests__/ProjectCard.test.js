import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext'
import { readAssociationById } from '../backend/dao'

// mock functions to control return values
jest.mock('../backend/dao', () => ({
    readAssociationById: jest.fn()
}));

jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// dummy project to pass to ProjectCard as prop
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

test('Dislike button renders as expected', async () => {
    // force useAuth to return object with user that has id
    useAuth.mockReturnValue({user: {id: 'id'}});
    // force readAssociation() to return something !== -1
    readAssociationById.mockResolvedValue({});

    // ARRANGE: render component
    render(
        <ProjectCard
        initialProject={project}
        />
    );
    
    // ASSERT: make sure Dislike button renders
    expect(await screen.findByText('Dislike')).toBeInTheDocument();
});

test('Like button renders as expected', async () => {
    // force useAuth to return object with user that has id
    useAuth.mockReturnValue({user: {id: 'id'}});
    // foce readAssociation() to return -1 (indicating no like history)
    readAssociationById.mockResolvedValue(-1);

    // ARRANGE: render component
    render(
        <ProjectCard
        initialProject={project}
        />
    );

    // ASSERT: make sure Like button renders
    expect(await screen.findByText('Like')).toBeInTheDocument();
});