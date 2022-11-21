import { useEffect, useState } from 'react';
import { dotHelper } from '../utils/polkadotHelper';

function useSubscribeBalance() {
  const [unsub, setUnsub] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => () => {
    if (unsub) {
      unsub();
    }
  }, [unsub]);

  const subscribe = async (address) => setUnsub(await dotHelper.getApi().query.system.account(address, ({ data: newBalance }) => setBalance(newBalance)));

  return { balance, subscribe };
}

export default useSubscribeBalance;
