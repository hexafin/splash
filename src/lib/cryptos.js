export const cryptoNameDict = {
    BTC: "bitcoin",
    ETH: "ethereum",
    GUSD: "gemini dollars"
};

export const cryptoTitleDict = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    GUSD: "Gemini Dollars",
    BCH: "Bitcoin cash",
    LTC: "Litecoin",
    USD: "US Dollars"
};

export const cryptoColors = {
    BTC: "rgba(247, 147, 26, 1)",
    ETH: "rgba(60, 60, 61, 1)",
    GUSD: "rgba(32, 39, 52, 1)"
};

export const cryptoImages = {
    BTC: require("../assets/images/bitcoin-logo.png"),
    ETH: require("../assets/images/ether-icon.png"),
    GUSD: require("../assets/images/gemini-icon.png")
};

export const cryptoUnits = {
    BTC: 100000000,
    ETH: 1000000000000000000,
    GUSD: 100,
    USD: 100
};

export const currencySymbolDict = {
    USD: "$"
};

// v2 - only bitcoin, ether, and GUSD
export const cryptoNames = ["BTC", "ETH", "GUSD"];

export const erc20Names = ["GUSD"];

export const decimalLengths = {
    BTC: 5,
    ETH: 6,
    USD: 2,
    GUSD: 2
};

export const contractAddresses = {
    testnet: {
        GUSD: "0x388b0d6c519b1a502302f81a56efeda0b137d9c1" // Gemini USD
    },
    mainnet: {
        OMG: "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", // OmiseGo coin
        USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7", // tether
        GUSD: "0x056fd409e1d7a124bd7017459dfea2f387b6d5cd", // Gemini USD
        BNB: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", // BNB
        ZRX: "0xe41d2489571d322189246dafa5ebde1f4699f498" // 0x
    }
};

// standard erc20 ABI for transfer, balanceOf, and decimals
export const erc20ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8"
            }
        ],
        payable: false,
        type: "function"
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address"
            }
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256"
            }
        ],
        payable: false,
        type: "function"
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address"
            },
            {
                name: "_value",
                type: "uint256"
            }
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool"
            }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        payable: false,
        type: "function"
    }
];

// convert decimal value to unit value for specified currency
export const decimalToUnits = (value, currency) => {
    // use string manipulations to make sure no value is lost
    const units = cryptoUnits[currency];
    value = value.toString();
    const decimalIndex = value.indexOf(".");
    let total = 0;
    if (decimalIndex != -1) {
        if (decimalIndex > 0)
            total += parseInt(value.slice(0, decimalIndex)) * units;
        for (
            var i = 0, len = value.slice(decimalIndex + 1).length;
            i < len;
            i++
        ) {
            const multiplier = parseInt(units / 10 ** (i + 1));
            if (multiplier > 0)
                total += parseInt(value[decimalIndex + i + 1]) * multiplier;
        }
    } else {
        total += parseInt(value) * units;
    }
    return total;
};

// convert unit value to decimal value for specified currency
export const unitsToDecimal = (value, currency) => {
    // use string manipulations to make sure no value is lost
    const decimalLength = decimalLengths[currency];
    const units = cryptoUnits[currency];
    const index = -1 * units.toString().length + 1;
    const str = value.toString();

    let zeros = "";
    for (var i = str.length, len = -1 * index; i < len; i++) {
        zeros = zeros.concat("0");
    }
    if (value % units) {
        if (zeros) {
            return parseFloat("0" + "." + zeros + str.slice(index)).toFixed(
                decimalLength
            );
        } else {
            return parseFloat(
                str.slice(0, index) + "." + zeros + str.slice(index)
            ).toFixed(decimalLength);
        }
    } else {
        if (!str.slice(0, index)) {
            return parseFloat("0." + zeros).toFixed(decimalLength);
        } else {
            return str.slice(0, index);
        }
    }
};
