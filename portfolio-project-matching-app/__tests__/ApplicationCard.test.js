import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ApplicationCard from '../components/ApplicationCard';
import { readObjectById } from '../backend/dao';
import { act } from 'react-dom/test-utils';

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

jest.mock('../backend/dao', () => ({
    readObjectById: jest.fn()
}));

test('ApplicationCard tests', async () => {
    readObjectById.mockName('mockedReadApplication');
    readObjectById.mockResolvedValue(fakeApplication);
    render(
        <ApplicationCard
        appId={'id'}
        isOutgoing={true}
        />
    );
    expect(await screen.findByText('owner username')).toBeInTheDocument();
    console.log(readObjectById.getMockName());
    console.log(readObjectById.mock.results);

    expect(readObjectById).toHaveBeenCalledTimes(1);
    screen.debug()
});