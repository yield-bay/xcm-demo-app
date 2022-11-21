import { Layout } from 'antd';
import React, { useContext, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import GlobalContext from '../context/GlobalContext';
import background from '../assets/image/background.jpg';

import Intro from '../sections/intro';

const {
  Header, Footer, Sider, Content,
} = Layout;

function HomeV2() {
  // const {} = useContext(GlobalContext);
  const { headerConfig } = useState({ align: 'right', isFluid: true });

  return (
    <PageWrapper>
      <Layout
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgb(3, 4, 8)',
          color: 'white',
        }}
      >
        <Sider width={400} style={{ height: '100vh' }}>Sider</Sider>
        <Layout>
          <Content>
            <Intro />
          </Content>
        </Layout>
      </Layout>
    </PageWrapper>
  );
}

HomeV2.getInitialProps = async () => ({
  namespacesRequired: ['common', 'home-v2', 'header', 'footer'],
});

export default HomeV2;
