# 微信小程序多文件上传插件
受微信小程序`wx.uploadFile`只能上传单文件的限制，在小程序中同时上传多个文件非常繁琐。
## How to use
```js
//example.js
const multiUpload = require('path/to/multiUpload.js');
multiUpload({
   url: String,
   fileArr: [{filePath: String, name: String}],
   header: Object, 
   formData: Object,
   max: Number, 
   onComplete: Function 
 });
```
## params
参数描述与`wx.uploadFile`基本相同

| param | type | required | description |
| -------------- | ---------- | --------- | -------- |
| url | String | true | 图片上传地址 |
| fileArr | Array | true | 需要上传文件数组 |
| filePath | String|  | 通过`wx.chooseImage`等接口获取的临时文件路径 |
| name | String |  | 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容 |
| header | Object | false | HTTP 请求 Header, header 中不能设置 Referer |
| formData	| Object |	false |	HTTP 请求中其他额外的 form data |
| max | Number | false | 最大上传并发数，默认为5 |
| onComplete | Function | false | 上传完成，无论是否上传成功，有两个参数，successArr(并非成功保存到服务器的，自行打印`successArr[0].data`查看服务器返回的内容),errorArr |

## todo
- [ ] 获取每个文件的上传进度
- [ ] 每个文件的状态是否有更好的展示方法