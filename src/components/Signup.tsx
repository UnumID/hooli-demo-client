import { FC, useEffect } from 'react';
import { CredentialRequest } from '@unumid/types';
import { DemoPresentationRequestOptions } from '@unumid/demo-types';
import VerifierWidget from '@unumid/web-sdk';

import { config } from '../config';

import { useActionCreators } from '../hooks/useActionCreators';
import { useTypedSelector } from '../hooks/useTypedSelector';

import MainContent from './Layout/MainContent';
import ContentBox from './Layout/ContentBox';
// import HorizontalDivider from './Layout/HorizontalDivider';
import LightFont from './Layout/LightFont';

import './Signup.css';

const Signup: FC = () => {
  const { createPresentationRequest } = useActionCreators();

  const { session } = useTypedSelector(state => state.session);
  const { request } = useTypedSelector(state => state.presentationRequest);

  useEffect(() => {
    if (!session) return;

    // customize these values for the specific demo (or not)
    const credentialRequests: CredentialRequest[] = [{
      type: 'DemoCredential',
      required: true,
      issuers: [config.issuerDid]
    }];

    const presentationRequestOptions: DemoPresentationRequestOptions = {
      credentialRequests,
      metadata: { sessionUuid: session.uuid }
    };

    createPresentationRequest(presentationRequestOptions);
  }, [session]);

  if (!session) return null;

  return (
    <div className='signup'>
      <MainContent>
        {/* customize these headers with branding for the specific demo, or remove them entirely */}
        <h1>Welcome to (Verifier)!</h1>
        <h2>Choose one of the options below to create an account.</h2>
        <ContentBox>
          {/* customize these headers with branding for the specific demo, or remove it entirely */}
          <h2>Instant sign up! <LightFont>(takes 10 seconds)</LightFont></h2>
          <h3>Instantly sign up for (Verifier) using your verified ACME account.</h3>
          <VerifierWidget
            presentationRequest={request?.presentationRequest}
            applicationTitle='ACME'
          />

          {/* hardcode the rest of the screen with an image */}
          {/* <HorizontalDivider /> */}
          {/* <img src={image} /> */}
        </ContentBox>
      </MainContent>

    </div>
  );
};

export default Signup;