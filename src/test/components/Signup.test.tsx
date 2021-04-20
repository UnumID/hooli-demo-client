import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { when } from 'jest-when';

import Signup from '../../components/Signup';
import { store } from '../../state';
import { client } from '../../feathers';
import { dummyDemoPresentationRequestoDto, dummySession } from '../mocks';
import { createSession } from '../../state/actionCreators';

jest.mock('../../feathers', () => ({
  client: {
    service: jest.fn()
  }
}));

describe('signup', () => {
  const mockSessionCreate = jest.fn();
  const mockPresentationRequestCreate = jest.fn();
  const mockOn = jest.fn();

  beforeEach(() => {
    mockSessionCreate.mockResolvedValueOnce(dummySession);
    mockPresentationRequestCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);

    when(client.service as unknown as jest.Mock)
      .calledWith('session').mockReturnValue({ create: mockSessionCreate })
      .calledWith('presentationRequest').mockReturnValue({ create: mockPresentationRequestCreate })
      .calledWith('presentationWebsocket').mockReturnValue({ on: mockOn, removeAllListeners: jest.fn() });

    createSession()(store.dispatch);
    render(<Provider store={store}><Signup /></Provider>);
  });

  it('displays a welcome header', async () => {
    expect(await screen.findByText('Welcome to Hooli!')).toBeInTheDocument();
  });

  it('creates a presentationRequest', async () => {
    await screen.findByText('Welcome to Hooli!');
    expect(mockPresentationRequestCreate).toBeCalled();
  });

  it('listens for created presentations', async () => {
    await screen.findByAltText('Powered by Unum ID');
    expect(mockOn.mock.calls[0][0]).toEqual('created');
  });

  it('shows the web sdk widget', async () => {
    expect(await screen.findByAltText('Powered by Unum ID')).toBeInTheDocument();
  });
});
