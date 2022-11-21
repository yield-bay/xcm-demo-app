import React, { useState } from 'react';

import PageWrapper from '../components/PageWrapper';
import Members from '../sections/common/members';
import Story from '../sections/team/story';

function Team() {
  const { headerConfig } = useState({ align: 'right', isFluid: true });

  return (
    <PageWrapper headerConfig={headerConfig}>
      <Story />
      <Members />
    </PageWrapper>
  );
}

Team.getInitialProps = async () => ({
  namespacesRequired: ['common', 'team', 'header', 'footer'],
});

export default Team;
