import { useEffect, useState } from 'react';
import { dotBifrostHelper } from '../utils/bifrostHelper';

function useSubscribeXtokenBalance() {
  const [unsub, setUnsub] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => () => {
    if (unsub) {
      unsub();
    }
  }, [unsub]);

  const subscribe = async (xtokenAddress) => {
    if (!dotBifrostHelper.initialized) {
      return;
    }
    const currencyId = { Token: 'ksm' };
    setUnsub(await dotBifrostHelper.getApi().query.tokens.accounts(xtokenAddress, currencyId, (newBalance) => setBalance(newBalance)));
  };

  return { balance, subscribe };
}

export default useSubscribeXtokenBalance;
