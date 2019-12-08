function getUrlParam(sUrl, sKey) {
    const result = {}
    if (sUrl) {
        const params = (sUrl.split("?")[1]).split("#")[0].split("&")
        params.forEach((item) => {
            const obj = item.split("=")
            if (result.hasOwnProperty(obj[0])) {
                result[obj[0]] = [...result[obj[0]], obj[1]]
            } else {
                result[obj[0]] = obj[1]
            }

        })
    }
    if (sKey && result[sKey]) {
        return {
            sKey: result[sKey]
        }
    }
    return result

}