const invoices = [
    {
        id: 80,
        category: "专票",
        invoice_no: "32234234",
        amount: 927,
        company: "腾讯公司"
    },
    {
        id: 81,
        category: "专票",
        invoice_no: "32234234",
        amount: 9123,
        company: "网易"
    },
    {
        id: 80,
        category: "专票",
        invoice_no: "324",
        amount: 927,
        company: "腾讯公司"
    },
    {
        id: 83,
        category: "普票",
        invoice_no: "9999999",
        amount: 927,
        company: "微软公司"
    },
    {
        id: 84,
        category: "电子发票",
        invoice_no: "9999999",
        amount: 927,
        company: "网景公司"
    }
];

// 数组对象去重
const has = {}
const arr = invoices.reduce((accumulator, currentValue) => {
    has[currentValue.id] ? '' : (has[currentValue.id] = true) && accumulator.push(currentValue)
    return accumulator
}, [])


console.log('arr', arr)