import _ from 'lodash';
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import pngLogo from '../../assets/image/header/logo.png';
import pngLogoBlack from '../../assets/image/header/logo-black.png';
import pngLogoTuringBlack from '../../assets/image/header/logo-turing-black.png';
import pngLogoTuring from '../../assets/image/header/logo-turing.png';

function Logo({ isBlack, className = '', ...rest }) {
  const router = useRouter();
  let logoImage = isBlack ? pngLogoBlack : pngLogo;
  if (_.startsWith(router.pathname, '/turing')) {
    logoImage = isBlack ? pngLogoTuringBlack : pngLogoTuring;
  }

  return (
    <Link href="/">
      <a className={`d-block oak-logo-wrapper ${className}`} {...rest}>
        <img alt="logo" className="oak-logo" src={logoImage} />
      </a>
    </Link>
  );
}

Logo.propTypes = {
  isBlack: PropTypes.bool,
  className: PropTypes.string,
};

Logo.defaultProps = {
  isBlack: false,
  className: '',
};

export default Logo;
