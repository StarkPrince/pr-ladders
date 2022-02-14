// import all data from the files in the data folder
var data800 = require('./800.json');
var data900 = require('./900.json');
var data1000 = require('./1000.json');
var data1100 = require('./1100.json');
var data1200 = require('./1200.json');
var data1300 = require('./1300.json');
var data1400 = require('./1400.json');
var data1500 = require('./1500.json');
var data1600 = require('./1600.json');
var data1700 = require('./1700.json');
var data1800 = require('./1800.json');
var data1900 = require('./1900.json');
var data2000 = require('./2000.json');
var data2100 = require('./2100.json');
var data2200 = require('./2200.json');
var data2300 = require('./2300.json');
var data2400 = require('./2400.json');
var data2500 = require('./2500.json');
var data2600 = require('./2600.json');
var data2700 = require('./2700.json');
var data2800 = require('./2800.json');
var data2900 = require('./2900.json');
var data3000 = require('./3000.json');
var data3100 = require('./3100.json');
var data3200 = require('./3200.json');
var data3300 = require('./3300.json');
var data3400 = require('./3400.json');

const allData = [data800.data, data900.data, data1000.data, data1100.data, data1200.data, data1300.data, data1400.data, data1500.data, data1600.data, data1700.data, data1800.data, data1900.data, data2000.data, data2100.data, data2200.data, data2300.data, data2400.data, data2500.data, data2600.data, data2700.data, data2800.data, data2900.data, data3000.data, data3100.data, data3200.data, data3300.data, data3400.data];

const customData = (lowRating, highRating) =>
{
    var dt = [];
    for (let i = lowRating - 800; i <= highRating - 800; i += 100) {
        dt.push(allData[i / 100]);
    }
    return dt.flat();
}


export default customData;
