const cookieName = 'audiences'
const cookieKey = 'vvv_cookie_audiences'
const cookieVal = $request.headers['Cookie'] || $request.headers['cookie']

if (cookieVal) {
  let cookie = $prefs.setValueForKey(cookieVal, cookieKey)
  if (cookie) {
    let msg = `${cookieName}`
    $notify(msg, 'Cookie写入成功', '详见日志')
    console.log(msg)
    console.log(cookieVal)
  }
}

$done({})
