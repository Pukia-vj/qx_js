const cookieName = 'hdfans'
const cookieKey = 'vvv_cookie_hdfans'
const cookieVal = $prefs.valueForKey(cookieKey)

function sign(code) {
  let url = {
    url: `https://hdfans.org/attendance.php`,
    method: 'GET',
    headers: { Cookie: cookieVal }
  }
  $task.fetch(url).then((response) => {
    let data = response.body
    if (data.indexOf('签到成功') >= 0) {
      let title = `${cookieName}`
      let subTitle = `签到结果: 签到成功`
      let detail = `红豆饭`
      console.log(`${title}, ${subTitle}, ${detail}`)
      $notify(title, subTitle, detail)
    } else {
      let title = `${cookieName}`
      let subTitle = `签到结果: 红豆饭签到失败`
      let detail = `详见日志`
      console.log(`签到失败: ${cookieName}, data: ${data}`)
      $notify(title, subTitle, detail)
    }
    $done()
  })
}

sign({})
