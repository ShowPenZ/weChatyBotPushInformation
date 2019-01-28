const { Wechaty } = require("wechaty");
const moment = require("moment");
const WebSocket = require("ws");
const bot = new Wechaty();
const maxV = 6;

const wsDatas = {
  "1m": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_1m",
    min: 3
  },
  "5m": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_5m",
    min: 5
  },
  "15m": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_15m",
    min: 8
  },
  "1h": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_1h",
    min: 15
  },
  "6h": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_6h",
    min: 50
  },
  "1d": {
    url: "wss://stream2.binance.cloud/stream?streams=btcusdt@kline_1d",
    min: 80
  }
};

openWebsocket = (url, callback) => {
  const ws = new WebSocket(url);
  ws.on("open", (open = () => {}));
  ws.on(
    "message",
    (incoming = data => {
      const klineData = eval("(" + data + ")").data.k;
      const { t, T, o, c, h, l } = klineData;
      const high = Math.max(o, c);
      const low = Math.min(o, c);
      const max = h - l;
      callback(max, low, high, +l, +h);
    })
  );
};

//二维码
bot.on("scan", (url, code) => {
  if (!/201|200/.test(String(code))) {
    let loginUrl = url.replace(/\/qrcode\//, "/l/");
    require("qrcode-terminal").generate(loginUrl, { small: true });
  }
});

// 登陆自动发送
bot.on("login", async user => {
  console.log(`user ${user} login`);
  let activePushRoom = await bot.Room.find({ topic: "测试群" });
  console.log("activePushRoom", activePushRoom);

  if (activePushRoom) {
    for (let key in wsDatas) {
      openWebsocket(wsDatas[key].url, (max, low, high, l, h) => {
        console.log(max, low, high, l, h);
        let now = moment(new Date()).format("YYYY-MM-DD HH:mm");
        if ((high - low) * 3 <= low - l && low - l > wsDatas[key].min) {
          activePushRoom.say(`${now} BTC/USDT ${key} 出现T线 请留意 可以猜涨`);
        }
        if ((high - low) * 3 <= h - high && h - high > wsDatas[key].min) {
          activePushRoom.say(`${now} BTC/USDT ${key} 出现T线 请留意 可以猜跌`);
        }
        if (key == "1m" && max > maxV) {
          activePushRoom.say(`${now} BTC/USDT ${key} 变化幅度较大 请留意`);
        }
      });
    }
  }
});

// 运行
bot.start();
