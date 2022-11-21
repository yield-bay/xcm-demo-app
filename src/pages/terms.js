import React, { useState } from 'react';

import styled from 'styled-components';
import PageWrapper from '../components/PageWrapper';
import Terms from '../components/OAKTerms';
import Container from '../components/Container/Container';
import { device } from '../utils';

export const Wrapper = styled.div`
    
    padding: 150px 0px;

    @media ${device.md} {
        padding-top: 200px;
    }
`;

function TermPage() {
  const { headerConfig } = useState({ align: 'right', isFluid: true });

  return (
    <PageWrapper headerConfig={headerConfig}>
      <Container>
        <Wrapper>
          <Terms />
        </Wrapper>
      </Container>
    </PageWrapper>
  );
}

TermPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'header', 'footer'],
});

export default TermPage;
