const { Wechaty } = require("wechaty");
const nodeHttp = require("./core");
const moment = require("moment");
const { FileBox } = require("file-box");
const qs = require("querystring");

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

const bot = new Wechaty();
let coinPrice = null;
let targetCoinPrice = null;
let IntervalethCoinContent = qs.stringify(EthSellData);
let IntervalbtcCoinContent = qs.stringify(BtcSellData);

const engineCore = (url, coinContent, targetPrice, room) => {
  let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  new Promise(nodeHttp.coreReq(url, coinContent, targetPrice))
    .then(result => {
      targetCoinPrice = result.join(",");
      console.log(targetCoinPrice);
      room.say(
        `有情况，eth法币出售价格低于${targetPrice}` +
          targetCoinPrice +
          " --来自ShowPenZ的小机器人" +
          now
      );
    })
    .catch(reason => {
      coinPrice = reason.join(",");
      console.log(coinPrice);
      room.say(coinPrice + " --来自ShowPenZ的小机器人" + now);
    });
};

bot.on("scan", (url, code) => {
  if (!/201|200/.test(String(code))) {
    let loginUrl = url.replace(/\/qrcode\//, "/l/");
    require("qrcode-terminal").generate(loginUrl, { small: true });
  }
});

bot.on("login", async user => {
  console.log(`user ${user} login`);
  let activePushRoom = await bot.Room.find("测试群");

  if (await bot.Room.find("测试群")) {
    const ethInterval = setInterval(() => {
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      new Promise(nodeHttp.coreReq(targetUrl, IntervalethCoinContent, 750))
        .then(result => {
          targetCoinPrice = result.join(",");
          activePushRoom.say(
            "ETH法币出售有情况!低于750了" +
              targetCoinPrice +
              "老哥下手吧！" +
              now
          );
          console.log(targetCoinPrice, "--targetCoinPrice");
        })
        .catch(reason => {
          coinPrice = reason.join(",");
          console.log(coinPrice, "--coinPrice");
          activePushRoom.say(
            "ETH法币出售行情！" + coinPrice + "老哥先观望下！" + now
          );
        });
    }, 15000);

    const btcInterval = setInterval(() => {
      let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

      new Promise(nodeHttp.coreReq(targetUrl, IntervalbtcCoinContent, 23500))
        .then(result => {
          targetCoinPrice = result.join(",");
          activePushRoom.say(
            "BTC法币出售有情况!！！！低于23500了" +
              targetCoinPrice +
              "老哥下手吧！" +
              now
          );
          console.log(targetCoinPrice, "--targetCoinPrice");
        })
        .catch(reason => {
          coinPrice = reason.join(",");
          console.log(coinPrice, "--coinPrice");
          activePushRoom.say(
            "BTC法币出售行情！" + coinPrice + "老哥先观望下！" + now
          );
        });
    }, 15000);
    console.log("234234");
  }

  //   const contactList = await bot.Contact.find({ alias: "ShowPenZ" }); // find allof the contacts whose name is 'ruirui'

  //   await contactList.say("大佬你好");
});

bot.on("message", async message => {
  const contact = message.from();
  const content = message.text();
  const room = message.room();
  let coinContent = null; //coin param
  let targetRoom = []; //Storage target room
  let keyrooms = await bot.Room.findAll(); // search all room

  if (room) {
    console.log(`Room: ${room} Contact: ${contact.name()} Content: ${content}`);

    // keyrooms.map(res => {
    //   if (
    //     res.payload.topic === "测试群"
    //     // ||
    //     // res.payload.topic === "溜溜球" ||
    //     // res.payload.topic === "水滴大前端"
    //   ) {
    //     targetRoom.push(res);
    //   }
    // });

    // targetRoom.map(res => {
    //   if (res) {
    //     if (/eth法币出售价格/.test(content)) {
    //       coinContent = qs.stringify(EthSellData);
    //       engineCore(targetUrl, coinContent, 800, res);
    //     } else if (/eth法币购买价格/.test(content)) {
    //       coinContent = qs.stringify(EthBuyData);
    //       engineCore(targetUrl, coinContent, 860, res);
    //     } else if (/btc法币出售价格/.test(content)) {
    //       coinContent = qs.stringify(BtcSellData);
    //       engineCore(targetUrl, coinContent, 24200, res);
    //     } else if (/btc法币购买价格/.test(content)) {
    //       coinContent = qs.stringify(BtcBuyData);
    //       engineCore(targetUrl, coinContent, 25200, res);
    //     }
    //   }
    // });
  } else {
    console.log(`Contact: ${contact.name()} Content: ${content}`);
  }
});
bot.start();
