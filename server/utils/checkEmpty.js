const validator = require("validator")

exports.checkEmpty = (fields) => {
    let error = {}
    let isError = false
    for (const key in fields) {
        const val = fields[key]
        
        if (val === null || val === undefined) {
            error[key] = `${key} is Required`
            isError = true
            continue
        }

        if (Array.isArray(val)) {
            if (val.length === 0) {
                error[key] = `${key} is Required`
                isError = true
            }
            continue
        }

        if (typeof val === 'object') {
            if (Object.keys(val).length === 0) {
                error[key] = `${key} is Required`
                isError = true
            }
            continue
        }

        const strVal = typeof val === 'string' ? val : String(val)
        if (validator.isEmpty(strVal.trim())) {
            error[key] = `${key} is Required`
            isError = true
        }
    }
    return { error, isError }
}