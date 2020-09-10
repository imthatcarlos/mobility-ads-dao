import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const GET_MOBILITY_CAMPAIGNS = gql`
  {
    mobilityCampaigns(where:{ isActive_not: false }, orderBy: "createdAt", orderDirection: "desc", first: 10) {
      id
      idx
      creator {
        owner
        totalContributedWei
      }
      title
      category
      createdAt
      budgetWei
    }
  }
`;

export function useCampaignsReq() {
  const { loading, error, data } = useQuery(GET_MOBILITY_CAMPAIGNS, {});

  if (loading) return null;
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}
