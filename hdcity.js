const cookieName = 'hdcity'
const cookieKey = 'vvv_cookie_hdcity'
const cookieVal = $prefs.valueForKey(cookieKey)

function sign(code) {
  let url = {
    url: `https://hdcity.leniter.org/`,
    method: 'GET',
    headers: { Cookie: cookieVal }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('上传量') >= 0) {
      let title = `${cookieName}`
      let subTitle = `登录结果: 登录成功`
      let detail = `城市`
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } else {
      let title = `${cookieName}`
      let subTitle = `登录结果: 城市登录失败`
      let detail = `详见日志`
      console.log(`登录失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    }
    $done()
  })
}

sign({})
