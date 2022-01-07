const dashRE = /-/g
const lodashRE = /_/g

function jwtDecode(tokenStr) {
  const base64Url = tokenStr.split('.')[1]
  if (base64Url === undefined) return null
  const base64 = base64Url.replace(dashRE, '+').replace(lodashRE, '/')
  const jsonStr = Buffer.from(base64, 'base64').toString()
  return JSON.parse(jsonStr)
}

export default jwtDecode