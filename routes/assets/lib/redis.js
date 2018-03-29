const path = require('path');
const config = require(path.join(__dirname, '../../../config'));
const ioRedis = require('ioredis');
const redis = new ioRedis(config.redisConfig);
// redis 链接错误
redis.on("error", function(error) {
    console.log(error);
});

function setData(index, el, time) {
    return redis.set(index, el, 'EX', time);
}

function getData(index) {
    return redis.get(index);
}

exports.redis = redis;
exports.setData = setData;
exports.getData = getData;