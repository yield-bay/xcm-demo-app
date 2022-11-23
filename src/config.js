import {
  faTwitter, faLinkedinIn, faDiscord, faTelegramPlane, faMediumM, faYoutube, faGithubAlt,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelopeSquare } from '@fortawesome/pro-solid-svg-icons';


const config = {
  company: 'OAK Network',
  website: 'https://oak.tech',
  copyright: 'OAK Network © 2022 , All Right Reserved',
  env: process.env.NEXT_PUBLIC_ENV,

  emails: {
    contact: 'contact@oak.tech',
  },

  routingConfig: {
    '/': {
      title: 'XCM Demo App',
      description: 'Web app for Mangata auto-compound demo',
      isDark: true,
    },
  },
  socialMedia: {
    telegramAnnouncements: {
      link: 'https://t.me/OAK_Announcements',
      icon: faTelegramPlane,
    },
    telegramCommunity: {
      link: 'https://t.me/OAKNetworkCommunity',
      icon: faTelegramPlane,
    },
    twitter: {
      link: 'https://twitter.com/oak_network',
      icon: faTwitter,
    },
    discord: {
      link: 'https://discord.gg/7W9UDvsbwh',
      icon: faDiscord,
    },
    medium: {
      link: 'https://medium.com/oak-blockchain',
      icon: faMediumM,
    },
    youtube: {
      link: 'https://youtube.com/channel/UCpR12msmm43z46PoAJ1TAiQ',
      icon: faYoutube,
    },
    linkedin: {
      link: 'https://www.linkedin.com/company/oak-blockchain/',
      icon: faLinkedinIn,
    },
    github: {
      link: 'https://github.com/OAK-Foundation/',
      icon: faGithubAlt,
    },
    email: {
      link: 'contact@oak.tech',
      icon: faEnvelopeSquare,
    },
  },
  wallet: 'https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frpc.turing-staging.oak.tech#/explorer',
  docs: 'https://docs.oak.tech',
  github: 'https://github.com/OAK-Foundation',
  mediaKit: 'https://drive.google.com/drive/folders/1mXBPPQGe0fYBOEMM03uM-DFCqZn9rz_W',
  polkadotBrowserExtension: 'https://polkadot.js.org/extension/',
  turing: {
    endpoint: process.env.NEXT_PUBLIC_TURING_ENDPOINT,
    parachainId: process.env.NEXT_PUBLIC_TURING_PARA_ID,
  },
  mangata: {
    endpoint: process.env.NEXT_PUBLIC_MANGATA_ENDPOINT,
    parachainId: process.env.NEXT_PUBLIC_MANGATA_PARA_ID,
  },
};

export default config;
