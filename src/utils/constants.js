const env = {
  MANGATA_PARA_ID: process.env.NEXT_PUBLIC_MANGATA_PARA_ID,
  MANGATA_ENDPOINT: process.env.NEXT_PUBLIC_MANGATA_ENDPOINT,
  TURING_PARA_ID: process.env.NEXT_PUBLIC_TURING_PARA_ID,
  TURING_ENDPOINT: process.env.NEXT_PUBLIC_TURING_ENDPOINT,
};

const chainConfig = {
  rococo: {
    ss58: 42,
  },
  turing: {
    ss58: 51,
  },
  mangata: {
    ss58: 42,
  },
};

const tokenConfig = {
  MGR: {
    decimal: '1000000000000000000',
  },
  ROC: {
    decimal: '1000000000000',
  },
  TUR: {
    decimal: '10000000000',
  },
  IMBU: {
    decimal: '1000000000000',
  },
  KSM: {
    decimal: '1000000000000',
  },
  MGX: {
    decimal: '1000000000000',
  },
  USDR: {
    decimal: '1000000000000000000',
  },
  'MGR-TUR': {
    decimal: '1000000000000000000',
  },
  'ROC-IMBU': {
    decimal: '1000000000000000000',
  },
  'MGR-IMBR': {
    decimal: '1000000000000000000',
  },
  'MGR-BNC': {
    decimal: '1000000000000000000',
  },
  'KAR-TUR': {
    decimal: '1000000000000000000',
  },
  'MGR-BNC': {
    decimal: '1000000000000000000',
  },
  'MGR-BNC': {
    decimal: '1000000000000000000',
  },
  'MGR-BNC': {
    decimal: '1000000000000000000',
  },
};

export { env, chainConfig, tokenConfig };
