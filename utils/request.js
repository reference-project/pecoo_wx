
const app = getApp();
const host = app.globalData.host;
const searchHost = app.globalData.searchHost;
const recommendHost = app.globalData.recommendHost;

module.exports = (url = '', data = {}, type = 'GET', format) => {
  let headers = {
    'accessToken': wx.getStorageSync('userInfo').tokenId || '',
    'version': 'V1.0.0',
    'clientTime': new Date().getTime(),
    'sourceMode': 'MINI'
  };
  if (type == 'GET') {
    headers['content-type'] = 'application/json';
  } else {
    if (format == 'json') {
      headers['content-type'] = 'application/json';
    } else {
      headers['content-type'] = 'application/x-www-form-urlencoded';
    }
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: format == 'search' ? searchHost + url : format == 'recommend' ? recommendHost + url :host + url,
      method: type,
      data: data,
      header: headers,
      success: function (res) {
        if (res.statusCode == '200') {
          if (res.data.scode) {
            let code = res.data.code;
            if (code == '40003') {
              wx.navigateTo({
                url: `/pages/login/login`,
              })
            } else {
              reject(res);
            }
          } else {
            let code = res.data.code
            switch (code) {
              case '10000':
                resolve(res.data.result);
                break;
              case '10001':
                app.showErrorModal(res.data.msg)
                reject(res.data.result);
                break;
              case '40000':
                app.showErrorModal(res.data.msg);
                reject(res.data.result);
                break;
              case '40003':
                wx.redirectTo({
                  url: '/pages/login/login',
                })
                break;
              case '40004':
                app.showErrorModal(res.data.msg)
                reject(res.data.result);
                return false;
              case '40005':
                app.showErrorModal(res.data.msg)
                reject(res.data.result);
                return false;
              case '90000':
                app.showErrorModal(res.data.msg)
                reject(res.data.result);
                return false
            }
          }
        } else if (res.statusCode == '500') {
          app.showErrorModal('服务器开小差了～');
          reject(res.data.result);
          return false
        }
      },
      fail: function (res) {
        app.showErrorModal(res.data.error)
        reject(res);
      }
    });
  });
}