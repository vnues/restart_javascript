// 统一返回的数据格式

class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }
        data && (this.data = data)
        message && (this.message = message)

    }
}


class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errcode = 0
    }
}


class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errcode = -1
    }
}


module.exports = {
    SuccessModel,
    ErrorModel
}