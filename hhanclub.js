const cookieName = 'hhanclub'
const cookieKey = 'vvv_cookie_hhanclub'
const cookieVal = $prefs.valueForKey(cookieKey)

function sign(code) {
  let url = {
    url: `https://hhanclub.top/attendance.php`,
    method: 'GET',
    headers: { Cookie: cookieVal }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('今日签到排名') >= 0) {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到成功`
      let detail = `憨憨`
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } else {
      let title = `${cookieName}`
      let subTitle = `签到结果: 憨憨签到失败`
      let detail = `详见日志`
      console.log(`签到失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    }
    $done()
  })
}

sign({})
