const cookieName = 'zhuque'
const cookieKey = 'vvv_cookie_zhuque'
const cookieVal = $prefs.valueForKey(cookieKey)

function sign(code) {
  let url = {
    url: `https://zhuque.in/index`,
    method: 'GET',
    headers: { Cookie: cookieVal }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('种子数量') >= 0) {
      let title = `${cookieName}`
      let subTitle = `登录结果: 登录成功`
      let detail = `朱雀`
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } else {
      let title = `${cookieName}`
      let subTitle = `登录结果: 朱雀登录失败`
      let detail = `详见日志`
      console.log(`登录失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    }
    $done()
  })
}

sign({})
