// 设置 Cookie 名称，用于标识操作的网站或应用
const cookieName = '樊登读书'

// 设置存储签到 URL、请求头和请求主体的键名
const signurlKey = 'senku_signurl_pandeng'
const signheaderKey = 'senku_signheader_pandeng'
const signbodyKey = 'senku_signbody_pandeng'

// 初始化 senku 对象，包含了用于 HTTP 请求、数据读写、通知发送等操作的函数
const senku = init()

// 从存储中获取签到 URL
const signurlVal = senku.getdata(signurlKey)

// 从存储中获取签到请求头
const signheaderVal = senku.getdata(signheaderKey)

// 从存储中获取签到请求主体
const signBodyVal = senku.getdata(signbodyKey)

// 调用签到函数 sign()
sign()

// 定义签到函数 sign()
function sign() {
  // 创建包含签到 URL、请求头和请求主体的 URL 对象
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal), body: signBodyVal }

  // 发送 HTTP POST 请求到签到 URL
  senku.post(url, (error, response, data) => {
    // 记录签到响应数据
    senku.log(`${cookieName}, data: ${data}`)
    
    // 解析响应数据为 JSON 格式
    const res = JSON.parse(data)
    
    // 初始化通知的子标题和详细信息
    let subTitle = ``
    let detail = ``

    // 根据签到结果进行处理
    if (res.status == 1) {
      // 若签到成功，设置通知子标题
      subTitle = `签到结果: 成功`
    } else {
      // 若签到失败，设置通知子标题和详细信息
      subTitle = `签到结果: 失败`
      detail = `状态: ${res.message}`
    }

    // 发送通知
    senku.msg(cookieName, subTitle, detail)

    // 完成操作
    senku.done()
  })
}

// 初始化 senku 对象，包含一系列通用函数
function init() {
  // 检测是否在 Surge 环境中
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }

  // 检测是否在 Quantumult X 环境中
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }

  // 从存储中获取数据的函数
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }

  // 将数据存储到存储中的函数
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }

  // 发送通知的函数
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }

  // 记录日志的函数
  log = (message) => console.log(message)

  // 发送 HTTP GET 请求的函数
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }

  // 发送 HTTP POST 请求的函数
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }

  // 完成操作的函数
  done = (value = {}) => {
    $done(value)
  }

  // 返回包含各种函数的对象
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
