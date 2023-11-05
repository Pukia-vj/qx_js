// 设置 Cookie 名称，用于标识操作的网站或应用
const cookieName = 'AcFun'

// 设置 Cookie 和 Token 的键名，用于存储相关数据
const cookieKey = 'chavy_cookie_acfun'
const tokenKey = 'chavy_token_acfun'

// 初始化 chavy 对象，它包含了用于 HTTP 请求、数据读写、通知发送等操作的函数
const chavy = init()

// 从存储中获取 AcFun 网站的 Cookie 数据，存储在 cookieVal 变量中
const cookieVal = chavy.getdata(cookieKey)

// 从存储中获取 AcFun 网站的 Token 数据，存储在 tokenVal 变量中
const tokenVal = chavy.getdata(tokenKey)

// 调用签到函数 sign()
sign()

// 定义签到函数 sign()
function sign() {
  // 构建请求的 URL 和请求头，包括 Cookie 和 Token 信息
  let url = {
    url: `https://api-new.acfunchina.com/rest/app/user/signIn`,
    headers: {
      Cookie: cookieVal,
      'access_token': `${tokenVal}`,
      'acPlatform': 'IPHONE',
      'User-Agent': 'AcFun/6.14.2 (iPhone; iOS 13.3; Scale/2.00)'
    }
  }

  // 设置请求主体内容，包括 access_token
  url.body = `access_token=${cookieVal}`

  // 发送 HTTP POST 请求到签到接口
  chavy.post(url, (error, response, data) => {
    // 解析响应数据为 JSON 格式
    const result = JSON.parse(data)
    const title = `${cookieName}` // 通知的标题
    let subTitle = '' // 通知的子标题
    let detail = '' // 通知的详细内容

    // 根据签到结果进行处理
    if (result.result == 0 || result.result == 122) {
      // 若签到成功，调用 getinfo() 函数获取签到信息
      getinfo(result)
    } else {
      subTitle = '签到结果: 失败'
      detail = `编码: ${result.result}, 说明: ${result.error_msg}`
      // 发送通知
      chavy.msg(title, subTitle, detail)
    }
    // 记录日志
    chavy.log(`${cookieName}, data: ${data}`)
  })
}

// 定义获取签到信息的函数 getinfo()
function getinfo(signresult) {
  // 构建请求的 URL 和请求头，包括 Cookie 和 Token 信息
  let url = {
    url: `https://api-new.acfunchina.com/rest/app/user/hasSignedIn`,
    headers: {
      Cookie: cookieVal,
      'access_token': `${tokenVal}`,
      'acPlatform': 'IPHONE',
      'User-Agent': 'AcFun/6.14.2 (iPhone; iOS 13.3; Scale/2.00)'
    }
  }

  // 设置请求主体内容，包括 access_token
  url.body = `access_token=${cookieVal}`

  // 发送 HTTP POST 请求获取签到信息
  chavy.post(url, (error, response, data) => {
    // 解析响应数据为 JSON 格式
    const result = JSON.parse(data)
    const title = `${cookieName}` // 通知的标题
    let subTitle = '' // 通知的子标题
    let detail = '' // 通知的详细内容

    // 根据签到结果进行处理
    if (signresult.result == 0) {
      subTitle = '签到结果: 成功'
    } else if (signresult.result == 122) {
      subTitle = '签到结果: 成功 (重复签到)'
    }
    detail = `共签: ${result.cumulativeDays}次, 连签: ${result.continuousDays}次, 说明: ${signresult.msg}`
    // 发送通知
    chavy.msg(title, subTitle, detail)
    // 记录日志
    chavy.log(`${cookieName}, data: ${data}`)
    // 完成操作
    chavy.done()
  })
}

// 初始化 chavy 对象，包括一系列通用函数
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
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }

  // 发送 HTTP POST 请求的函数
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }

  // 完成操作的函数
  done = (value = {}) => {
    $done(value)
  }

  // 返回包含各种函数的对象
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
