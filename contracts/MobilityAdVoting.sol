pragma solidity ^0.4.24;

import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/os/contracts/apps/AragonApp.sol";
import "./IMobilityCampaigns.sol";

contract MobilityAdVoting is AragonApp {
  using SafeMath for uint256;

  event Flagged(uint id, address sender);
  event Liked(uint id, address sender);
  event Blacklisted(uint id, address sender);
  event Featured(uint id, address sender);

  bytes32 constant public COMMUNITY_ROLE = keccak256("COMMUNITY_ROLE");
  uint8 constant public MIN_FLAG_AMOUNT = 3;
  uint8 constant public MIN_LIKE_AMOUNT = 10;

  mapping(uint => uint) public campaignFlagCount;
  mapping(uint => uint) public campaignLikeCount;

  IMobilityCampaigns public mobilityCampaigns;

  modifier onlyCampaignReceiver() {
    require(mobilityCampaigns.isCampaignReceiver(msg.sender), "only campaign receivers");
    _;
  }

  function initialize(address campaignsContractAddress) public onlyInit {
    mobilityCampaigns = IMobilityCampaigns(campaignsContractAddress);
    initialized();
  }

  function flagCampaign(uint id) public onlyCampaignReceiver {
    campaignFlagCount[id] += 1;
    emit Flagged(id, msg.sender);
  }

  function likeCampaign(uint id) public onlyCampaignReceiver {
    campaignLikeCount[id] += 1;
    emit Liked(id, msg.sender);
  }

  function blacklistCampaign(uint id) public auth(COMMUNITY_ROLE) isInitialized {
    require(campaignFlagCount[id] > MIN_FLAG_AMOUNT, "flag count must be more that MIN_FLAG_AMOUNT");

    mobilityCampaigns.blacklistCampaignCreator(id);
    emit Blacklisted(id, msg.sender);
  }

  function featureCampaign(uint id) public auth(COMMUNITY_ROLE) isInitialized {
    require(campaignLikeCount[id] > MIN_LIKE_AMOUNT, "like count must be more that MIN_LIKE_AMOUNT");

    mobilityCampaigns.setFeaturedCampaign(id, campaignLikeCount[id]);
    emit Featured(id, msg.sender);
  }
}
