import { GeneralError } from '@feathersjs/errors';

import { createPresentationRequest } from '../../../state/actionCreators/presentationRequest';
import { PresentationRequestActionType } from '../../../state/actionTypes/presentationRequest';
import { dummyDemoPresentationRequestoDto, dummyDemoPresentationRequestOptions } from '../../mocks';
import { client } from '../../../feathers';

jest.mock('../../../feathers');
const mockCreate = jest.fn();
const mockService = (client.service as unknown as jest.Mock);

describe('presentationRequest action creators', () => {
  describe('createPresentationRequest', () => {
    it('returns a function', () => {
      expect(typeof createPresentationRequest(dummyDemoPresentationRequestOptions)).toEqual('function');
    });

    describe('the inner function', () => {
      const dispatch = jest.fn();

      beforeEach(() => {
        mockService.mockReturnValue({ create: mockCreate });
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it(`dispatches a ${PresentationRequestActionType.CREATE_PRESENTATION_REQUEST} action`, async () => {
        mockCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);
        await createPresentationRequest(dummyDemoPresentationRequestOptions)(dispatch);
        expect(dispatch.mock.calls[0][0]).toEqual({ type: PresentationRequestActionType.CREATE_PRESENTATION_REQUEST });
      });

      it('creates a presentationRequest', async () => {
        mockCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);
        await createPresentationRequest(dummyDemoPresentationRequestOptions)(dispatch);
        expect(mockService).toBeCalledWith('presentationRequest');
        expect(mockCreate).toBeCalledWith(dummyDemoPresentationRequestOptions);
      });

      it(`dispatches a ${PresentationRequestActionType.CREATE_PRESENTATION_REQUEST_SUCCESS} action with the created presentationRequest data`, async () => {
        mockCreate.mockResolvedValueOnce(dummyDemoPresentationRequestoDto);
        await createPresentationRequest(dummyDemoPresentationRequestOptions)(dispatch);
        expect(dispatch.mock.calls[1][0]).toEqual({
          type: PresentationRequestActionType.CREATE_PRESENTATION_REQUEST_SUCCESS,
          payload: dummyDemoPresentationRequestoDto
        });
      });

      it(`dispatches a ${PresentationRequestActionType.CREATE_PRESENTATION_REQUEST_ERROR} action if there is an error creating the presentationRequst`, async () => {
        const err = new GeneralError('error creating presentationRequest');
        mockCreate.mockRejectedValueOnce(err);
        await createPresentationRequest(dummyDemoPresentationRequestOptions)(dispatch);
        expect(dispatch.mock.calls[1][0]).toEqual({
          type: PresentationRequestActionType.CREATE_PRESENTATION_REQUEST_ERROR,
          payload: err
        });
      });
    });
  });
});