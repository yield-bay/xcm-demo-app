import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { makeTimeoutPromise } from '../utils/helperFn';
import { fetchPromotionalMilestones } from '../utils/parseHelper';
import { logError } from '../utils/log';

function usePromotionalMilestones(relayChainName, auction) {
  const [promotionalMilestones, setPromotionalMilestones] = useState(null);
  const [milestone, setMilestone] = useState(null);

  const getPromotionalMilestones = useCallback(async () => {
    try {
      const milestones = await fetchPromotionalMilestones({
        relayChainName,
        auction,
      });
      const milestoneIndex = _.findLastIndex(milestones, { isActive: true });
      setMilestone(milestoneIndex >= 0 ? milestoneIndex + 1 : 0);
      setPromotionalMilestones(milestones);
    } catch (error) {
      // If the request fails, retry after 5 seconds.
      logError('usePromotionalMilestones', error);
      await makeTimeoutPromise(5 * 1000);
      getPromotionalMilestones();
    }
  }, []);

  useEffect(() => {
    getPromotionalMilestones();
  }, [getPromotionalMilestones]);

  return { milestone, promotionalMilestones };
}

export default usePromotionalMilestones;
