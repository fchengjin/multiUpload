let successArr = [];
let errorArr = [];
let processing = {};
const multiUpload = function (obj) {
  if (typeof obj !== 'object') {
    console.log('参数必须为Object类型');
    return;
  }
  if (!multiUpload.done) {
    console.log('请等待上次请求队列执行完毕');
    return;
  }
  multiUpload.done = false;
  successArr = [];
  errorArr = [];
  processing = {};

  const totalLength = obj.fileArr.length;
  let completeLength = -1; //上传完成数，无论是否上传成功
  const max = obj.max || 5; //上传并发量

  const upload = function () {
    //检查是否可以插入到processing
    if (max <= Object.keys(processing).length) {
      return;
    } else {
      completeLength++;
    }
    const filePath = obj.fileArr[completeLength].filePath;
    const name = obj.fileArr[completeLength].name;
    let id = 'id_' + (~~(Math.random() * (1 << 24))).toString(16);
    while (processing[id]) {
      id = 'id_' + (~~(Math.random() * (1 << 24))).toString(16);
    }
    const conf = {
      url: obj.url,
      filePath: filePath,
      name: name,
      success: function (res) {
        const data = res.data;
        successArr.push({
          filePath: filePath,
          name: name,
          data: data
        });
      },
      fail: function () {
        errorArr.push({
          filePath: filePath,
          name: name
        });
      },
      complete: function () {
        delete processing[id];
        //检查是否全部完成
        if (successArr.length + errorArr.length === totalLength) {
          multiUpload.done = true;
          typeof obj.onComplete === 'function' &&
          obj.onComplete(successArr, errorArr);
        } else {
          setTimeout(function () {
            if (completeLength < totalLength - 1) {
              upload();
            }
          }, 50);
        }
      }
    };
    if (typeof obj.header === 'object') {
      conf.header = obj.header;
    }
    if (typeof obj.formdata === 'object') {
      conf.formdata = obj.formdata;
    }
    //将该条插入到processing中
    processing[id] = {
      filePath: filePath,
      name: name
    };
    wx.uploadFile(conf);
    setTimeout(function () {
      if (completeLength < totalLength - 1) {
        upload();
      }
    }, 50);
  };

  upload();
};
multiUpload.done = true;

module.exports = multiUpload;