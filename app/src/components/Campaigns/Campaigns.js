import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { orderBy } from 'lodash/collection';
import { useAragonApi } from '@aragon/api-react'
import {
  Box,
  Button,
  IconHeart,
  IconFlag,
  GU
} from '@aragon/ui';

import { useCampaignsReq } from './CampaignsReq';

function FeedItem(props) {
  const { api, appState } = useAragonApi()
  const { data } = props;
  const [elevation, setElevation] = useState(2);

  return (
    <Box>
      <h1>{ data.text }</h1>
      <Box>
        <div>
          <Button
            display="icon"
            icon={<IconHeart />}
            label="Like Campaign"
            onClick={() => api.flagCampaign(data.idx).toPromise()}
          />
          <Button
            display="icon"
            icon={<IconFlag />}
            label="Flag"
            onClick={() => api.likeCampaign(data.idx).toPromise()}
            css={`
              margin-left: ${2 * GU}px;
            `}
          />
        </div>
      </Box>
    </Box>
  );
}

export default function Campaigns(props) {
  const [graphData, setGraphData] = useState();

  const campaigns = useCampaignsReq();

  const timeDiff = (ts) => moment.duration(moment.utc().diff(moment.utc(ts * 1000))).humanize();

  const getItem = ({ type, data }) => ({
    text: `[${data.creator.owner}] created campaign '${data.title}'`,
    ts: `${timeDiff(data.createdAt)} ago`
  });

  useEffect(() => {
    if (campaigns) {
      console.log(campaigns);
      const data = campaigns.mobilityCampaigns.map((d) => ({ type: 'campaign', ts: d.createdAt, ...d }));
      setGraphData(orderBy(data, ['ts'], ['desc']));
    }
  }, [campaigns]);

  if (!graphData) return null;

  return (
    <div>
      <h2>Campaigns: {campaigns.mobilityCampaigns.length}</h2>
      {
        graphData.map((data, idx) => (
          <FeedItem key={`c-item-${idx}`} data={getItem({ type: data.type, data })} />
        ))
      }
    </div>
  );
};
