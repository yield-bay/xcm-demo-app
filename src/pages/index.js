import React from 'react';
import HomeV2 from '../components/Home';

function IndexPage() {
  return <HomeV2 />;
}

IndexPage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home-v2', 'header', 'footer'],
});

export default IndexPage;
