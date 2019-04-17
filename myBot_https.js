const { Wechaty } = require("wechaty");
const nodeHttp = require("./core");
const moment = require("moment");
const qs = require("querystring");
const {
  targetUrl,
  EthSellData,
  EthBuyData,
  UsdtBuyData,
  UsdtSellData,
  BtcBuyData,
  BtcSellData
} = require("./config");

const bot = new Wechaty();
let coinPrice = null;
let targetCoinPrice = null;

let selectData = [
  {
    coinConfig: qs.stringify(EthSellData),
    coinTargetPrice: 1000,
    targetCoin: "ETH"
  },
  {
    coinConfig: qs.stringify(UsdtSellData),
    coinTargetPrice: 6.87,
    targetCoin: "USDT"
  },
  {
    coinConfig: qs.stringify(BtcSellData),
    coinTargetPrice: 32500,
    targetCoin: "BTC"
  }
];

const engineCore = (url, coinContent, targetPrice, room, coinType) => {
  let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  new Promise(nodeHttp.coreReq(url, coinContent, targetPrice))
    .then(result => {
      targetCoinPrice = result.join(",");

      room.say(
        `查询完毕，${coinType}法币购买价格为${targetCoinPrice}` +
          " --来自ShowPenZ的小机器人" +
          now
      );
    })
    .catch(reason => {
      coinPrice = reason.join(",");
      room.say(
        `查询完毕，${coinType}法币出售价格为${coinPrice}` +
          " --来自ShowPenZ的小机器人" +
          now
      );
    });
};

bot.on("scan", (url, code) => {
  if (!/201|200/.test(String(code))) {
    let loginUrl = url.replace(/\/qrcode\//, "/l/");
    require("qrcode-terminal").generate(loginUrl, { small: true });
  }
});

bot.on("login", async user => {
  // console.log(`user ${user} login`);
  let activePushRoom = await bot.Room.find("测试群");

  if (await bot.Room.find("测试群")) {
    selectData.map((param, index) => {
      console.log(param.targetCoin, param.coinTargetPrice);
      const Interval = setInterval(() => {
        let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

        new Promise(
          nodeHttp.coreReq(targetUrl, param.coinConfig, param.coinTargetPrice)
        )
          .then(result => {
            targetCoinPrice = result.join(",");
            activePushRoom.say(
              `${param.targetCoin}法币出售有情况!低于${
                param.coinTargetPrice
              }了` +
                targetCoinPrice +
                "老哥下手吧！" +
                now
            );
          })
          .catch(reason => {
            coinPrice = reason.join(",");
            activePushRoom.say(
              `${param.targetCoin}法币出售行情！` +
                coinPrice +
                "老哥先观望下！" +
                now
            );
          });
      }, 300000);
    });
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

    keyrooms.map(res => {
      if (
        res.payload.topic === "测试群"
        // ||
        // res.payload.topic === "溜溜球" ||
        // res.payload.topic === "水滴大前端"
      ) {
        targetRoom.push(res);
      }
    });

    targetRoom.map(res => {
      if (res) {
        if (/eth法币出售价格/.test(content)) {
          coinContent = qs.stringify(EthSellData);
          engineCore(targetUrl, coinContent, 800, res, "eth");
        } else if (/eth法币购买价格/.test(content)) {
          coinContent = qs.stringify(EthBuyData);
          engineCore(targetUrl, coinContent, 860, res, "eth");
        } else if (/btc法币出售价格/.test(content)) {
          coinContent = qs.stringify(BtcSellData);
          engineCore(targetUrl, coinContent, 24200, res, "btc");
        } else if (/btc法币购买价格/.test(content)) {
          coinContent = qs.stringify(BtcBuyData);
          engineCore(targetUrl, coinContent, 25200, res, "btc");
        } else if (/usdt法币购买价格/.test(content)) {
          coinContent = qs.stringify(UsdtSellData);
          engineCore(targetUrl, coinContent, 6.88, res, "usdt");
        } else if (/usdt法币出售价格/.test(content)) {
          coinContent = qs.stringify(UsdtBuyData);
          engineCore(targetUrl, coinContent, 7.0, res, "usdt");
        }
      }
    });
  } else {
    console.log(`Contact: ${contact.name()} Content: ${content}`);
  }
});
bot.start();
