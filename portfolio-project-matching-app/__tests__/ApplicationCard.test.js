import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ApplicationCard from '../components/ApplicationCard';
import { readObjectById } from '../backend/dao';
import { act } from 'react-dom/test-utils';

// mock functions to control return values
jest.mock('../backend/dao', () => ({
    readObjectById: jest.fn(),
    updateDoc: jest.fn(),
    createAssociation: jest.fn()
}));

// clear mock data after each test
afterEach(() => {
    jest.clearAllMocks();
})

// dummy application to pass to ApplicationCard as prop
const fakeApplication = {
    id: 'id',
    response: "Pending",
    open: true,
    owner_id: "owner id",
    user_id: "user id",
    project_id: "project id",
    owner: {id: 1, username: "owner username"},
    project: {id: 1, name: "project name"},
    user: {id: 1, username: "user username"}
};

test('Loading message renders as expected', async () => {
    // force readObjectById() to return our fake application
    const fakeAppPromise = Promise.resolve(fakeApplication);
    readObjectById.mockImplementationOnce(() => fakeAppPromise);

    // ARRANGE: render component
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );

    // ASSERT: make sure loading message appears
    expect(screen.getByTestId('loadingDiv')).toBeInTheDocument();
    // force test to wait until promises resolve before finishing
    await act(() => fakeAppPromise);
});

test('Application correctly renders as outgoing', async () => {
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadApplication');
    // force readObjectById() to return our fake application
    const fakeAppPromise = Promise.resolve(fakeApplication)
    readObjectById.mockImplementationOnce(() => fakeAppPromise);

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
    // force test to wait until promises resolve before finishing
    await act(() => fakeAppPromise);
});

test('clicking Cancel correctly updates pending application', async () => {
    const fakeApplication2 = {
        id: 'id',
        response: "Cancelled",
        open: false,
        owner_id: "owner id",
        user_id: "user id",
        project_id: "project id",
        owner: {id: 1, username: "owner username"},
        project: {id: 1, name: "project name"},
        user: {id: 1, username: "user username"}
    };
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadObject');
    // force readObjectById() to return our fake application
    const fakeAppPromise = Promise.resolve(fakeApplication);
    const fakeAppPromise2 = Promise.resolve(fakeApplication2)
    readObjectById
    .mockImplementationOnce(() => fakeAppPromise)
    .mockImplementationOnce(() => fakeAppPromise2);

    // ARRANGE: render component
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );

    // ASSERT: make sure cancel button appears as expected
    expect(await screen.findByTestId('outgoingPendingButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure mocked readObjectById() only called once
    expect(readObjectById).toHaveBeenCalledTimes(1);
    // ACT: click the cancel button
    const cancelButton = screen.getByRole('button', {name: 'Cancel Application'});
    userEvent.click(cancelButton);
    // ASSERT: make sure application was cancelled and shows Re-Open button
    expect(await screen.findByTestId('cancelledButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure open status is updated
    expect(await screen.findByTestId('statusDiv')).toHaveTextContent('Status: Closed');
    // ASSERT: make sure response is updated
    expect(await screen.findByTestId('responseDiv')).toHaveTextContent('Response: Cancelled');
    // force test to wait until promises resolve before finishing
    await act(() => fakeAppPromise);
    await act(() => fakeAppPromise2);
});

test('clicking Re-Open correctly updates pending application', async () => {
    const fakeApplication2 = {
        id: 'id',
        response: "Cancelled",
        open: false,
        owner_id: "owner id",
        user_id: "user id",
        project_id: "project id",
        owner: {id: 1, username: "owner username"},
        project: {id: 1, name: "project name"},
        user: {id: 1, username: "user username"}
    };
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadObject');
    // force readObjectById() to return our fake application
    const fakeAppPromise = Promise.resolve(fakeApplication);
    const fakeAppPromise2 = Promise.resolve(fakeApplication2);
    readObjectById
    .mockImplementationOnce(() => fakeAppPromise2)
    .mockImplementationOnce(() => fakeAppPromise);

    // ARRANGE: render component
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );

    // ASSERT: make sure cancel button appears as expected
    expect(await screen.findByTestId('cancelledButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure mocked readObjectById() only called once
    expect(readObjectById).toHaveBeenCalledTimes(1);
    // ACT: click the cancel button
    const reOpenButton = screen.getByRole('button', {name: 'Re-Open Application'});
    userEvent.click(reOpenButton);
    // ASSERT: make sure application was cancelled and shows Re-Open button
    expect(await screen.findByTestId('outgoingPendingButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure open status is updated
    expect(await screen.findByTestId('statusDiv')).toHaveTextContent('Status: Open');
    // ASSERT: make sure response is updated
    expect(await screen.findByTestId('responseDiv')).toHaveTextContent('Response: Pending');
    // force test to wait until promises resolve before finishing
    await act(() => fakeAppPromise);
    await act(() => fakeAppPromise2);
});

test('clicking Accept correctly updates pending application', async () => {
    const fakeApplication2 = {
        id: 'id',
        response: "Approved",
        open: false,
        owner_id: "owner id",
        user_id: "user id",
        project_id: "project id",
        owner: {id: 1, username: "owner username"},
        project: {id: 1, name: "project name"},
        user: {id: 1, username: "user username"}
    };
    // trying out giving mocked readObjectById an alias
    readObjectById.mockName('mockedReadObject');
    // force readObjectById() to return our fake application
    const fakeAppPromise = Promise.resolve(fakeApplication);
    const fakeAppPromise2 = Promise.resolve(fakeApplication2);
    readObjectById
    .mockImplementationOnce(() => fakeAppPromise)
    .mockImplementationOnce(() => fakeAppPromise2);

    // ARRANGE: render component
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={false}
        />
    );

    // ASSERT: make sure cancel button appears as expected
    expect(await screen.findByTestId('incomingPendingButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure mocked readObjectById() only called once
    expect(readObjectById).toHaveBeenCalledTimes(1);
    // ACT: click the cancel button
    const approveButton = screen.getByRole('button', {name: 'Approve'});
    userEvent.click(approveButton);
    // ASSERT: make sure application was cancelled and shows Re-Open button
    expect(await screen.findByTestId('rejectedApprovedButtonDiv')).toBeInTheDocument();
    // ASSERT: make sure open status is updated
    expect(await screen.findByTestId('statusDiv')).toHaveTextContent('Status: Closed');
    // ASSERT: make sure response is updated
    expect(await screen.findByTestId('responseDiv')).toHaveTextContent('Response: Approved');
    // force test to wait until promises resolve before finishing
    await act(() => fakeAppPromise);
    await act(() => fakeAppPromise2);
});