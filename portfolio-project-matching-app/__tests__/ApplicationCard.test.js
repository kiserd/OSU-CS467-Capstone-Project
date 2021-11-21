import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ApplicationCard from '../components/ApplicationCard';
import { readObjectById } from '../backend/dao';
import { act } from 'react-dom/test-utils';

// mock functions to control return values
jest.mock('../backend/dao', () => ({
    readObjectById: jest.fn()
}));

// clear mock data after each test
afterEach(() => {
    jest.clearAllMocks();
})

// dummy application to pass to ApplicationCard as prop
const fakeApplication = {
    id: 'id',
    response: "pending",
    open: true,
    owner_id: "owner id",
    user_id: "user id",
    project_id: "project id",
    owner: {id: 1, username: "owner username"},
    project: {id: 1, name: "project name"},
    user: {id: 1, username: "user username"}
};

test('Loading message renders as expected', () => {
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadApplication');
    // force readObjectById() to return our fake application
    readObjectById.mockResolvedValue(fakeApplication);

    // ARRANGE: render component
    act(() => {
        render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );
    })
    
    // ASSERT: make sure loading message appears
    expect(screen.getByTestId('loadingDiv')).toBeInTheDocument();
});

test('Application correctly renders as outgoing', async () => {
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadApplication');
    // force readObjectById() to return our fake application
    readObjectById.mockResolvedValue(fakeApplication);

    // ARRANGE: render component
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );

    // ASSERT: make sure owner username renders rather than user username
    expect(await screen.findByText('owner username')).toBeInTheDocument();
    // ASSERT: make sure cancel button appears as expected
    expect(await screen.findByTestId('outgoingPendingButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure mocked readObjectById() only called once
    expect(readObjectById).toHaveBeenCalledTimes(1);
    // making sure alias sticks to readObjectById()
    console.log(readObjectById.getMockName());
    // testing things out, checking to see what mocked function was called with
    console.log(readObjectById.mock.results);
});