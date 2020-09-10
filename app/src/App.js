import React from 'react'
import { useAragonApi } from '@aragon/api-react';
import {
  Header,
  Main,
  SyncIndicator,
  Text,
  textStyle,
} from '@aragon/ui';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import Campaigns from './components/Campaigns/Campaigns';

const GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/imthatcarlos/dark-horse-mobility-campaigns';

function App() {
  const { api, appState } = useAragonApi()
  const { isSyncing } = appState

  const apolloClient = new ApolloClient({ uri: GRAPH_URL });

  return (
    <ApolloProvider client={apolloClient}>
      <Main>
        {isSyncing && <SyncIndicator />}
        <Header
          primary="MobilityAdVoting"
          secondary={
            <Text
              css={`
                ${textStyle('title2')}
              `}
            >
            </Text>
          }
        />

        <Campaigns />
      </Main>
    </ApolloProvider>
  )
}

export default App
