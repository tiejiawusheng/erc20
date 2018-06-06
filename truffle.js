module.exports = {
    networks: {
        development: {
            host: "localhost",
            port:8545,
            network_id:"*"  // 匹配任何network id
        },
        hadoopchina: {
            host: "http://eth.chinahadoop.cn",
            port:80,
            network_id:"*"  // 匹配任何network id
        },
    }
};