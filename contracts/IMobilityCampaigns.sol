pragma solidity ^0.4.24;

interface IMobilityCampaigns {
  event UserRegistered(address indexed account, uint enabledAt, uint enabledAtCampaignIdx);
  event CampaignCreated(
    address indexed creator,
    string indexed organization,
    string title,
    string category,
    uint createdAt,
    uint budgetWei,
    uint idx
  );
  event CampaignCompleted(address indexed creator, uint totalCampaignReceivers, uint refundWei, uint idx);
  event UserRewardsWithdrawn(address indexed account, uint rewardsWei, uint totalRewardsWei, uint withdrewAt);
  event CampaignBlacklisted(address indexed creator, uint campaign);
  event CampaignFeatured(address indexed creator, uint campaign, uint rank);

  function createCampaign(
    string _organization,
    string _category,
    string _title,
    string _ipfsHash,
    string _key
  ) external;
  function getReceiveCampaign(address _a) external view returns (bool);
  function getProvideData(address _a) external view returns (bool);
  function enableNewUser() external;
  function disableUser() external;
  function getActiveCampaignId() external view returns(uint);
  function getActiveCampaign()
    external
    view
    returns(
      string organization,
      string category,
      string title,
      string ipfsHash,
      uint budgetWei,
      uint createdAt,
      uint expiresAt
    );
  function calculateRefundedWei() external view returns (uint);
  function completeCampaign() external;
  function getActiveCampaignIdsUsers() external view returns(uint[]);
  function getActiveCampaignUsers(uint _id)
    external
    view
    returns(
      string organization,
      string category,
      string title,
      string ipfsHash,
      string key
    );

  function getIsCampaignActive(uint _idx) external view returns(bool);
  function withdrawRewards() external;

  // actually used by MobilityAdVoting
  function isCampaignReceiver(address account) external view returns (bool);
  function setAdVotingAddress(address _contract) external;
  function blacklistCampaignCreator(uint _id) external;
  function setFeaturedCampaign(uint _id, uint _rank) external;
}
