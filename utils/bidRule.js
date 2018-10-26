const app = getApp();
/**
 * 减价规则
 */
function reduceMoney (curPrice, proPrice) {
  let price_Value = '';
  if (100000 < curPrice) {
    curPrice % 10000 == 0 ? price_Value = curPrice - 10000 : price_Value = (curPrice - curPrice % 10000)
  } else if (50000 < curPrice && curPrice <= 100000) {
    curPrice % 5000 == 0 ? price_Value = curPrice - 5000 : price_Value = (curPrice - curPrice % 5000)
  } else if (20000 < curPrice && curPrice <= 50000) {
    curPrice % 2000 == 0 ? price_Value = curPrice - 2000 : price_Value = (curPrice - curPrice % 2000)
  } else if (10000 < curPrice && curPrice <= 20000) {
    curPrice % 1000 == 0 ? price_Value = curPrice - 1000 : price_Value = (curPrice - curPrice % 1000)
  } else if (5000 < curPrice && curPrice <= 10000) {
    curPrice % 500 == 0 ? price_Value = curPrice - 500 : price_Value = (curPrice - curPrice % 500)
  } else if (2000 < curPrice && curPrice <= 5000) {
    curPrice % 250 == 0 ? price_Value = curPrice - 250 : price_Value = (curPrice - curPrice % 250)
  } else if (1000 < curPrice && curPrice <= 2000) {
    curPrice % 200 == 0 ? price_Value = curPrice - 200 : price_Value = (curPrice - curPrice % 200)
  } else if (500 < curPrice && curPrice <= 1000) {
    curPrice % 100 == 0 ? price_Value = curPrice - 100 : price_Value = (curPrice - curPrice % 100)
  } else if (100 < curPrice && curPrice <= 500) {
    curPrice % 50 == 0 ? price_Value = curPrice - 50 : price_Value = (curPrice - curPrice % 50)
  } else if (10 < curPrice && curPrice <= 100) {
    curPrice % 10 == 0 ? price_Value = curPrice - 10 : price_Value = (curPrice - curPrice % 10)
  } else {
    price_Value = curPrice - curPrice % 10
  }
  if (curPrice <= proPrice) {
    price_Value = proPrice;
    app.showToast('出价金额不得小于$' + proPrice);
  } else if (curPrice == 10) {
    app.showToast('已经是最低出价价格了');
  }
  return price_Value
}
/**
 * 加价规则
 */
function addMoney(curPrice) {
  let price_Value = '';
  if (0 <= curPrice && curPrice < 100) {
    curPrice % 10 == 0 ? price_Value = curPrice + 10 : price_Value = (curPrice + 10 - curPrice % 10)
  } else if (100 <= curPrice && curPrice < 500) {
    curPrice % 50 == 0 ? price_Value = curPrice + 50 : price_Value = (curPrice + 50 - curPrice % 50)
  } else if (500 <= curPrice && curPrice < 1000) {
    curPrice % 100 == 0 ? price_Value = curPrice + 100 : price_Value = (curPrice + 100 - curPrice % 100)
  } else if (1000 <= curPrice && curPrice < 2000) {
    curPrice % 200 == 0 ? price_Value = curPrice + 200 : price_Value = (curPrice + 200 - curPrice % 200)
  } else if (2000 <= curPrice && curPrice < 5000) {
    curPrice % 250 == 0 ? price_Value = curPrice + 250 : price_Value = (curPrice + 250 - curPrice % 250)
  } else if (5000 <= curPrice && curPrice < 10000) {
    curPrice % 500 == 0 ? price_Value = curPrice + 500 : price_Value = (curPrice + 500 - curPrice % 500)
  } else if (10000 <= curPrice && curPrice < 20000) {
    curPrice % 1000 == 0 ? price_Value = curPrice + 1000 : price_Value = (curPrice + 1000 - curPrice % 1000)
  } else if (20000 <= curPrice && curPrice < 50000) {
    curPrice % 2000 == 0 ? price_Value = curPrice + 2000 : price_Value = (curPrice + 2000 - curPrice % 2000)
  } else if (50000 <= curPrice && curPrice < 100000) {
    curPrice % 5000 == 0 ? price_Value = curPrice + 5000 : price_Value = (curPrice + 5000 - curPrice % 5000)
  } else {
    curPrice % 10000 == 0 ? price_Value = curPrice + 10000 : price_Value = (curPrice + 10000 - curPrice % 10000)
  }
  return price_Value
}
/**
 * 推荐价格
 */
function recommendMoney(price) {
  let list = new Array();
  // 生成价格
  if (price < 100) {
    // 100生成 0-100价格区间50
    var i = 0;
    for (var j = 0; j < 10; j++) {
      i = i + 10;
      if (i <= 100) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 100 && price < 500) {
    // 500生成 100-500价格区间50
    var i = 100;
    for (var j = 0; j < 8; j++) {
      i = i + 50;
      if (i <= 500) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 500 && price < 1000) {
    var i = 500;
    for (var j = 0; j < 5; j++) {
      i = i + 100;
      if (i <= 1000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 1000 && price < 2000) {
    var i = 1000;
    for (var j = 0; j < 5; j++) {
      i = i + 200;
      if (i <= 2000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 2000 && price < 5000) {
    var i = 2000;
    for (var j = 0; j < 12; j++) {
      i = i + 250;
      if (i <= 5000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 5000 && price < 10000) {
    var i = 5000;
    for (var j = 0; j < 10; j++) {
      i = i + 500;
      if (i <= 10000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 10000 && price < 20000) {
    var i = 10000;
    for (var j = 0; j < 10; j++) {
      i = i + 1000;
      if (i <= 20000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 20000 && price < 50000) {
    var i = 20000;
    for (var j = 0; j < 15; j++) {
      i = i + 2000;
      if (i <= 50000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 50000 && price < 100000) {
    var i = 50000;
    for (var j = 0; j < 15; j++) {
      i = i + 5000;
      if (i <= 100000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 100000) {
    var i = 100000;
    for (var j = 0; j < 15; j++) {
      i = i + 100000;
      list.push(i);
    }
    return list;
  }
  return list;
}
module.exports = {
  reduceMoney: reduceMoney,
  addMoney: addMoney,
  recommendMoney: recommendMoney
}    