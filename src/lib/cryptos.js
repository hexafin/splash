export const cryptoNameDict = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BCH: "bitcoin cash",
    LTC: "litecoin"
}

export const cryptoTitleDict = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BCH: "Bitcoin cash",
    LTC: "Litecoin",
    USD: "US Dollars"
}

export const cryptoUnits = {
    BTC: 100000000,
    USD: 100,
}

export const currencySymbolDict = {
    USD: "$"
}

// v1 - only bitcoin
export const cryptoNames = [
    "BTC",
    //"ETH",
    //"BCH",
    //"LTC"
]

const decimalLengths = {
    BTC: 5,
    USD: 2,
}

export const decimalToUnits = (value, currency) => {
    const units = cryptoUnits[currency]
    value = value.toString()
    const decimalIndex = value.indexOf('.')
    let total = 0
    if (decimalIndex != -1) {
        if (decimalIndex > 0) total += parseInt(value.slice(0, decimalIndex))*units
        for (var i=0, len=value.slice(decimalIndex+1).length; i<len; i++) {
            const multiplier = parseInt(units/(10**(i+1)))
            if (multiplier > 0) total += parseInt(value[decimalIndex+i+1])*multiplier
        }
    } else {
        total += parseInt(value)*units
    }
    return total
}

export const unitsToDecimal = (value, currency) => {
    const decimalLength = decimalLengths[currency]
    const units = cryptoUnits[currency]
    const index = (-1*(units.toString()).length)+1
    const str = value.toString()
    
    let zeros = ''
    for (var i=str.length, len = -1*index; i < len; i++) {
        zeros = zeros.concat('0')
    }
    if (value % units) {
        if (zeros) {
            return parseFloat('0' + '.' + zeros + str.slice(index)).toFixed(decimalLength)
        } else {
            return parseFloat(str.slice(0, index) + '.' + zeros + str.slice(index)).toFixed(decimalLength)
        }
    } else {
        return str.slice(0, index)
    }
}