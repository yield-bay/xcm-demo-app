import React, { useContext, useRef, useState } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import nexti18N from '../../i18n';
import PageWrapper from '../components/PageWrapper';
import GlobalContext from '../context/GlobalContext';
import Features from '../sections/partnership/features';
import Tour from '../sections/partnership/tour';
import Intro from '../sections/partnership/intro';

const { withTranslation } = nexti18N;

function Partnership() {
  const { setShowReveal } = useContext(GlobalContext);
  const { headerConfig } = useState({ align: 'right', isFluid: true });
  const refFeatures = useRef(null);

  useScrollPosition(() => {
    const featuresY = refFeatures.current.getBoundingClientRect().top;
    setShowReveal(featuresY < 100);
  });

  return (
    <PageWrapper headerConfig={headerConfig}>
      <div className="partnership">
        <Intro />
        <Features refSection={refFeatures} />
        <Tour />
      </div>
    </PageWrapper>
  );
}

export default withTranslation('common')(Partnership);
