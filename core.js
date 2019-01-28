const https = require("https");
const _ = require("lodash");

const coreReq = (url, content,targetPrice) => {
  return (resolve, reject) => {
    const req = https.get(url + content, res => {
      let json = "";
      let coinprice = [];
      let targetCoinprice = [];
      if (res.statusCode === 200) {
        res.setEncoding("utf8");
        res.on("data", d => {
          json += d;
        });
        res.on("end", () => {
          //获取到的数据
          json = JSON.parse(json);
          _.map(json.data, res => {
            if (res.price <= targetPrice) {
              targetCoinprice.push(res.price);
              resolve(targetCoinprice);
            } else {
              coinprice.push(res.price);
              reject(coinprice);
            }
          });
        });
      }
    });

    req.on("error", function(e) {
      console.log("problem with request: " + e.message);
    });

    req.end();
  };
};

module.exports.coreReq = coreReq;
