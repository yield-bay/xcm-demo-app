import React, { useState } from 'react';

import PageWrapper from '../components/PageWrapper';

function Team() {
  const { headerConfig } = useState({ align: 'right', isFluid: true });

  return (
    <PageWrapper headerConfig={headerConfig}>
      <div />
    </PageWrapper>
  );
}

Team.getInitialProps = async () => ({
  namespacesRequired: ['common', 'header', 'footer'],
});

export default Team;
