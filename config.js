const targetUrl = "https://otc-api.eiijo.cn/v1/data/trade-market?";

const EthSellData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 3,
  tradeType: "sell",
  blockType: "general",
  online: 1
};

const EthBuyData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 3,
  tradeType: "buy",
  blockType: "general",
  online: 1
};

//购买
const UsdtSellData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 2,
  tradeType: "sell",
  blockType: "general",
  online: 1
};

//出售
const UsdtBuyData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 2,
  tradeType: "buy",
  blockType: "general",
  online: 1
};

const BtcSellData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 1,
  tradeType: "sell",
  blockType: "general",
  online: 1
};

const BtcBuyData = {
  country: 37,
  currency: 1,
  payMethod: 0,
  currPage: 1,
  coinId: 1,
  tradeType: "buy",
  blockType: "general",
  online: 1
};

module.exports = {
  targetUrl: targetUrl,
  EthSellData: EthSellData,
  EthBuyData: EthBuyData,
  UsdtSellData: UsdtSellData,
  UsdtBuyData: UsdtBuyData,
  BtcSellData: BtcSellData,
  BtcBuyData: BtcBuyData
};
