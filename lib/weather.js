"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _jsonp = _interopRequireDefault(require("jsonp"));

var _moment = _interopRequireDefault(require("moment"));

var _echarts = _interopRequireDefault(require("echarts/lib/echarts"));

var _core = _interopRequireDefault(require("echarts-for-react/lib/core"));

require("echarts/lib/chart/bar");

require("echarts/lib/chart/line");

require("./weather.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var m = {
  "00": "C2",
  "01": "C9",
  "02": "C1",
  "03": "C3",
  "04": "C3",
  "05": "C3",
  "06": "C3",
  "07": "C3",
  "08": "C3",
  "09": "C3",
  "10": "C3",
  11: "C3",
  12: "C3",
  13: "C4",
  14: "C4",
  15: "C4",
  16: "C4",
  17: "C4",
  18: "C5",
  19: "C3",
  20: "C7",
  21: "C3",
  22: "C3",
  23: "C3",
  24: "C3",
  25: "C3",
  26: "C4",
  27: "C4",
  28: "C4",
  29: "C7",
  30: "C7",
  31: "C7",
  53: "C6",
  99: "C8",
  32: "C5",
  49: "C5",
  54: "C6",
  55: "C6",
  56: "C6",
  57: "C5",
  58: "C5",
  301: "C3",
  302: "C4"
}; //黄历、穿衣、雨伞、感冒、洗车、运动、防晒、钓鱼、旅游、交通、空气污染扩散条件、舒适度、晾晒指数

var livingKeys = [// { key: "huangli", icon: "icon_huangli" },
{
  key: "clothes",
  icon: "icon_chuanyi"
}, {
  key: "umbrella",
  icon: "icon_yusan"
}, {
  key: "cold",
  icon: "icon_ganmao"
}, {
  key: "carwash",
  icon: "icon_xiche"
}, {
  key: "sports",
  icon: "icon_yundong"
}, {
  key: "sunscreen",
  icon: "icon_fangsai"
}, {
  key: "fish",
  icon: "icon_diaoyu"
}, {
  key: "tourism",
  icon: "icon_lvyou"
}, {
  key: "traffic",
  icon: "icon_jiaotong"
}, {
  key: "diffusion",
  icon: "icon_wurankuosan"
}, {
  key: "comfort",
  icon: "icon_shushidu"
}, {
  key: "drying",
  icon: "icon_liangshai"
}, {
  key: "makeup",
  icon: "icon_huazhuang"
}, {
  key: "morning",
  icon: "icon_chenlian"
}, {
  key: "chill",
  icon: "icon_guomin"
}, {
  key: "heatstroke",
  icon: "icon_zhongshu"
}]; //配置穿衣指数的信息
//key:序号，level：穿衣级别，icon：对应服饰的icon
//1，炎热;2，热，短袖
//3，舒适;4，较舒适，长袖，衬衫，薄外套
//5，较冷，厚外套，毛衣
//6，冷;7，寒冷，棉服，羽绒服

var clothesKeys = [{
  key: 1,
  level: "炎热",
  icon: "icon_chuanyi_hot"
}, {
  key: 2,
  level: "热",
  icon: "icon_chuanyi_hot"
}, {
  key: 3,
  level: "舒适",
  icon: "icon_chuanyi_shushi"
}, {
  key: 4,
  level: "较舒适",
  icon: "icon_chuanyi_shushi"
}, {
  key: 5,
  level: "较冷",
  icon: "icon_chuanyi_jiaoleng"
}, {
  key: 6,
  level: "冷",
  icon: "icon_chuanyi_cool"
}, {
  key: 7,
  level: "寒冷",
  icon: "icon_chuanyi_cool"
}];

_moment["default"].locale('zh-cn', {
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_')
});

var curX = 0,
    hoursDragLock = true,
    // 小时预报 加锁
daysDragLock = true,
    // 7天预报 加锁
livingDragLock = true; // 生活指数 加锁

function Weather(_ref) {
  var province = _ref.province,
      city = _ref.city,
      _ref$props = _ref.props,
      props = _ref$props === void 0 ? {} : _ref$props,
      _ref$showDays = _ref.showDays,
      showDays = _ref$showDays === void 0 ? true : _ref$showDays,
      _ref$showHours = _ref.showHours,
      showHours = _ref$showHours === void 0 ? true : _ref$showHours,
      _ref$showLiving = _ref.showLiving,
      showLiving = _ref$showLiving === void 0 ? true : _ref$showLiving,
      _ref$showTomorrow = _ref.showTomorrow,
      showTomorrow = _ref$showTomorrow === void 0 ? true : _ref$showTomorrow;

  if (city == "") {
    province = "上海";
    city = "上海";
  }

  var _useState = (0, _react.useState)(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      observe = _useState2[0],
      setObserve = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = _slicedToArray(_useState3, 2),
      windOrHumidity = _useState4[0],
      setWindOrHumidity = _useState4[1];

  var _useState5 = (0, _react.useState)(true),
      _useState6 = _slicedToArray(_useState5, 2),
      LivingLeft = _useState6[0],
      setLivingLeft = _useState6[1];

  var _useState7 = (0, _react.useState)(500),
      _useState8 = _slicedToArray(_useState7, 2),
      livingWidth = _useState8[0],
      setLivingWidth = _useState8[1];

  var _useState9 = (0, _react.useState)(0),
      _useState10 = _slicedToArray(_useState9, 2),
      hoursLeft = _useState10[0],
      setHousrLeft = _useState10[1]; // 小时预报


  var _useState11 = (0, _react.useState)(0),
      _useState12 = _slicedToArray(_useState11, 2),
      daysLeft = _useState12[0],
      setDaysLeft = _useState12[1]; // 7天预报


  var _useState13 = (0, _react.useState)(0),
      _useState14 = _slicedToArray(_useState13, 2),
      tip = _useState14[0],
      setTip = _useState14[1]; // tip：切换


  var hoursRef = (0, _react.useRef)(null);
  var daysRef = (0, _react.useRef)(null); // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node

  var livingRef = (0, _react.useCallback)(function (node) {
    if (node !== null) {
      setLivingWidth(function () {
        return node.getBoundingClientRect().width;
      });
    }
  }, []); // const [hoursCurX, setHoursCurX] = useState(0) // 鼠标位置

  (0, _react.useEffect)(function () {
    (0, _jsonp["default"])("https://wis.qq.com/weather/common?source=pc&weather_type=forecast_1h|forecast_24h|alarm|limit|tips|rise|observe|index|air&province=".concat(province, "&city=").concat(city, "&county="), {}, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        setObserve(data.data);
      }
    }); // tip 轮换

    var tick = setInterval(function () {
      setWindOrHumidity(function (v) {
        return !v;
      });
    }, 5000); // 拖动

    document.addEventListener("mouseup", dragUp);
    return function () {
      clearInterval(tick);
      document.removeEventListener("mouseup", dragUp);
    };
  }, []); // useEffect(() => {
  //     livingWidth = livingRef.current.clientWidth
  // }, [livingRef.current])

  var dragUp = function dragUp(e) {
    if (!hoursDragLock) {
      var move = e.clientX - curX;
      setHousrLeft(function (hoursLeft) {
        var x = move <= 0 ? hoursLeft - hoursRef.current.clientWidth : hoursLeft + hoursRef.current.clientWidth;
        x = x >= 0 ? 0 : x;
        x = Math.abs(x) <= hoursRef.current.clientWidth * 3 ? x : -hoursRef.current.clientWidth * 3;
        return x;
      });
    }

    if (!daysDragLock) {
      var _move = e.clientX - curX;

      setDaysLeft(function () {
        var x = _move <= 0 ? daysRef.current.clientWidth - 500 : 0;
        x = x >= 0 ? 0 : x;
        x = Math.abs(x) <= 500 ? x : 0;
        return x;
      });
    }

    if (!livingDragLock) {
      var _move2 = e.clientX - curX;

      setLivingLeft(function () {
        return _move2 <= 0 ? 375 : 0;
      });
    }

    hoursDragLock = true;
    daysDragLock = true;
    livingDragLock = true;
  };
  /**
   * 小时预报：初始化
   * @param {Object} observe 
   */


  var initHours = function initHours(observe) {
    var keys = Object.keys(observe['forecast_1h']).sort(function (m, n) {
      m = parseInt(m);
      n = parseInt(n);

      if (m > n) {
        return 1;
      } else if (m < n) {
        return -1;
      } else {
        return 0;
      }
    }).slice(0, 25);
    var list = [];
    keys.forEach(function (key) {
      var day = observe['forecast_1h'][key]; // 日期(0点 => 明天)

      var update_time = parseDate(day['update_time']);
      var time = update_time.format("HH") + ":" + update_time.format("mm");

      if (update_time.hour() == 0) {
        time = "明天";
      } // 日出/日落


      var sunrise = undefined;
      var sunset = undefined; // 白天或晚上

      var _dayOrNight = dayOrNight(update_time);

      var vise = getRise(Object.values(observe['rise']), update_time);

      if (vise) {
        // 日出
        if (vise["sunrise"].hour() == update_time.hour()) {
          sunrise = vise["sunrise"].format("HH") + ":" + vise["sunrise"].format("mm");
        }

        if (vise["sunset"].hour() == update_time.hour()) {
          sunset = vise["sunset"].format("HH") + ":" + vise["sunset"].format("mm");
        }
      }

      list.push( /*#__PURE__*/_react["default"].createElement("li", {
        className: "item",
        key: key,
        style: {
          width: "3.84615%"
        }
      }, /*#__PURE__*/_react["default"].createElement("p", {
        className: "txt-time"
      }, time), /*#__PURE__*/_react["default"].createElement("img", {
        src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/".concat(_dayOrNight, "/").concat(day['weather_code'], ".svg"),
        className: "icon"
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "txt-degree positive"
      }, day['degree'])));

      if (sunrise) {
        list.push( /*#__PURE__*/_react["default"].createElement("li", {
          className: "item keypoint",
          key: "100",
          style: {
            width: "3.84615%"
          }
        }, /*#__PURE__*/_react["default"].createElement("p", {
          className: "txt-time"
        }, sunrise), /*#__PURE__*/_react["default"].createElement("img", {
          src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/rise.svg",
          className: "icon"
        }), /*#__PURE__*/_react["default"].createElement("p", {
          className: "txt-key"
        }, "\u65E5\u51FA")));
      }

      if (sunset) {
        list.push( /*#__PURE__*/_react["default"].createElement("li", {
          className: "item keypoint",
          key: "101",
          style: {
            width: "3.84615%"
          }
        }, /*#__PURE__*/_react["default"].createElement("p", {
          className: "txt-time"
        }, sunset), /*#__PURE__*/_react["default"].createElement("img", {
          src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/set.svg",
          className: "icon"
        }), /*#__PURE__*/_react["default"].createElement("p", {
          className: "txt-key"
        }, "\u65E5\u843D")));
      }
    });

    while (list.length > 26) {
      list.pop();
    }

    return /*#__PURE__*/_react["default"].createElement("section", {
      id: "sec-hours",
      className: "container",
      ref: hoursRef
    }, /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-scroll",
      onMouseDown: hoursDragDown,
      style: {
        width: "400%",
        cursor: "grab",
        height: "100%",
        transitionDuration: "500ms",
        transform: "translate(" + hoursLeft + "px, 0px)"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 10,
        height: "100%"
      }
    }), /*#__PURE__*/_react["default"].createElement("ol", {
      id: "ls-hours-weather"
    }, list)));
  };
  /**
   * 小时预报：左右拖动
   * @param {*} e 
   */


  var hoursDragDown = function hoursDragDown(e) {
    curX = e.clientX;
    hoursDragLock = false;
  };

  var changeTip = function changeTip() {
    var c = 0;

    for (var i in observe["tips"]["observe"]) {
      c++;
    }

    var t = (tip + 1) % c;
    setTip(t);
  };
  /**
   * 小时预报：白天或晚上
   * @param {moment} date
   * @returns string
   */


  var dayOrNight = function dayOrNight(date) {
    var vise = getRise(Object.values(observe['rise']), date);

    if (vise) {
      if (vise['sunrise'].isBefore(date) && vise['sunset'].isAfter(date)) {
        return "day";
      } else {
        return "night";
      }
    }

    return "day";
  };
  /**
   * 解析时间
   * @param {moment} source 
   */


  var parseDate = function parseDate(source) {
    var format = ["YYYYMMDDHHmmss", "YYYYMMDD", "YYYYMMDDHHmm"];
    return (0, _moment["default"])(source, format, 'fr');
  };
  /**
   * 日出日落时间
   * @param {array} rise
   * @param {moment} date
   * @returns {"sunrise": {moment}, "sunset": {moment}} 
   */


  var getRise = function getRise(rise, date) {
    if (!(rise instanceof Array)) {
      return undefined;
    }

    for (var i = 0; i < rise.length; i++) {
      var time = parseDate(rise[i]['time']);

      if (time.day() == date.day() && time.month() == date.month()) {
        return {
          'sunrise': parseDate(rise[i]['time'] + rise[i]['sunrise'].replace(":", "")),
          'sunset': parseDate(rise[i]['time'] + rise[i]['sunset'].replace(":", ""))
        };
      }
    }

    return undefined;
  };
  /**
   * 生活指数：初始化
   * @param {object} index 生活指数map
   */


  var initLiving = function initLiving(index) {
    var data = [];
    livingKeys.forEach(function (item) {
      //根据当前穿衣级别修改对应服饰的icon
      if (item.key === "clothes") {
        clothesKeys.forEach(function (item1) {
          if (index[item.key].info === item1.level) {
            item.icon = item1.icon;
          }
        });
      }

      data.push({
        name: index[item.key].name,
        info: index[item.key].info,
        detail: index[item.key].detail,
        icon: item.icon
      });
    });
    return /*#__PURE__*/_react["default"].createElement("section", {
      id: "sec-living",
      className: "container",
      onMouseDown: livingDragDown,
      ref: livingRef
    }, /*#__PURE__*/_react["default"].createElement("div", {
      id: "living-scroll"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "react-swipe-container ",
      style: {
        overflow: "hidden",
        cursor: "grab",
        userSelect: "none",
        visibility: "visible",
        position: "relative"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        overflow: "hidden",
        position: "relative",
        width: livingWidth * 2
      }
    }, /*#__PURE__*/_react["default"].createElement("ul", {
      className: "ls-living",
      "data-index": "0",
      style: {
        cssFloat: "left",
        width: livingWidth,
        position: "relative",
        transitionProperty: "transform",
        left: 0,
        transitionDuration: "300ms",
        transform: "translate(" + (0 - LivingLeft) + "px, 0px) translateZ(0px)"
      }
    }, data.slice(0, 8).map(function (_ref2, key) {
      var icon = _ref2.icon,
          name = _ref2.name,
          info = _ref2.info,
          detail = _ref2.detail;
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "item",
        key: key
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "icon " + icon
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "content"
      }, info), /*#__PURE__*/_react["default"].createElement("p", {
        className: "title"
      }, name));
    })), /*#__PURE__*/_react["default"].createElement("ul", {
      className: "ls-living",
      "data-index": "1",
      style: {
        cssFloat: "left",
        width: livingWidth,
        position: "relative",
        transitionProperty: "transform",
        left: -livingWidth,
        transitionDuration: "300ms",
        transform: "translate(" + (livingWidth - LivingLeft) + "px, 0px) translateZ(0px)"
      }
    }, data.slice(8, 16).map(function (_ref3, key) {
      var icon = _ref3.icon,
          name = _ref3.name,
          info = _ref3.info,
          detail = _ref3.detail;
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "item",
        key: key
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "icon " + icon
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "content"
      }, info), /*#__PURE__*/_react["default"].createElement("p", {
        className: "title"
      }, name));
    }))))));
  };

  var livingDragDown = function livingDragDown(e) {
    curX = e.clientX;
    livingDragLock = false;
  };
  /**
   * 7日天气预报：初始化
   * @param {forecast_24h} data 
   */


  var initDays = function initDays(data) {
    var today = (0, _moment["default"])();
    var formatData = [],
        chartLabelData = [],
        chartMaxData = [],
        chartMinData = [];

    for (var i = 0; i < 8; i++) {
      var item = data[i];

      if (item.day_weather_short && item.night_weather_short && item.max_degree && item.min_degree) {
        if ((0, _moment["default"])(item.time).add(1, 'days').isSame(today, 'day')) {
          item.showText = "昨天";
        } else if ((0, _moment["default"])(item.time).isSame(today, 'day')) {
          item.showText = "今天";
        } else if ((0, _moment["default"])(item.time).subtract(1, 'days').isSame(today, 'day')) {
          item.showText = "明天";
        } else if ((0, _moment["default"])(item.time).subtract(2, 'days').isSame(today, 'day')) {
          item.showText = "后天";
        } else {
          item.showText = (0, _moment["default"])(item.time).format('ddd');
        }

        chartLabelData.push(item.time);
        chartMaxData.push(item.max_degree - 0);
        chartMinData.push(item.min_degree - 0);

        if (item.time) {
          item.formatTime = item.time.substring(5).replace("-", "月") + "日";
        }

        formatData.push(item);
      }
    }

    var option = {
      backgroundColor: "rgba(0,0,0,0.0)",
      color: ["#FCC370", "#94CCF9"],
      animation: false,
      // renderAsImage: true,
      tooltip: {
        show: false
      },
      xAxis: [{
        type: 'category',
        show: false,
        data: chartLabelData
      }],
      yAxis: [{
        type: 'value',
        show: false,
        boundaryGap: ['45%', '45%'],
        scale: true
      }],
      grid: {
        x: 0,
        y: 0,
        y2: 0,
        height: 136,
        width: 500,
        borderWidth: "0px"
      },
      // legend: {
      //     orient: 'horizontal',
      //     x: 'center',
      //     y: 'top',
      //     itemGap: 55
      // },
      series: [{
        type: 'line',
        data: chartMaxData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        clipOverflow: false,
        lineStyle: {
          normal: {
            width: 3
          }
        },
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: '14',
              fontFamily: '微软雅黑',
              color: "#384C78"
            },
            distance: 10,
            formatter: function formatter(val) {
              if (val.dataIndex == 0) {
                return "{first|" + val.data + "°}";
              }

              return val.data + "°";
            },
            rich: {
              first: {
                fontSize: '14',
                fontFamily: '微软雅黑',
                color: "#C2C2C2"
              }
            }
          }
        }
      }, {
        type: 'line',
        data: chartMinData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          normal: {
            width: 3
          }
        },
        label: {
          normal: {
            show: true,
            position: "bottom",
            textStyle: {
              fontSize: '14',
              fontFamily: '微软雅黑',
              color: "#555555"
            },
            distance: 10,
            formatter: function formatter(val) {
              if (val.dataIndex == 0) {
                return "{first|" + val.data + "°}";
              }

              return val.data + "°";
            },
            rich: {
              first: {
                fontSize: '14',
                fontFamily: '微软雅黑',
                color: "#C2C2C2"
              }
            }
          }
        }
      }]
    };
    return /*#__PURE__*/_react["default"].createElement("section", {
      id: "sec-days",
      className: "container",
      onMouseDown: daysDragDown,
      ref: daysRef
    }, /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-scroll",
      style: {
        width: 500,
        cursor: "grab",
        height: "100%",
        userSelect: "none",
        transitionDuration: "500ms",
        transform: "translate(" + daysLeft + "px, 0px)"
      }
    }, /*#__PURE__*/_react["default"].createElement("ol", {
      id: "ls-days"
    }, formatData.map(function (item, key) {
      return /*#__PURE__*/_react["default"].createElement("li", {
        className: "item",
        key: key
      }, /*#__PURE__*/_react["default"].createElement("p", {
        className: "day"
      }, item.showText), /*#__PURE__*/_react["default"].createElement("p", {
        className: "date"
      }, (0, _moment["default"])(item.time).format("MM/DD")), /*#__PURE__*/_react["default"].createElement("div", {
        className: "ct-daytime"
      }, /*#__PURE__*/_react["default"].createElement("p", {
        className: "weather"
      }, item.night_weather), /*#__PURE__*/_react["default"].createElement("img", {
        src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/" + item.day_weather_code + ".svg",
        className: "icon"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "ct-night"
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/" + item.night_weather_code + ".svg",
        className: "icon"
      }), /*#__PURE__*/_react["default"].createElement("p", {
        className: "weather"
      }, item.night_weather_short)), /*#__PURE__*/_react["default"].createElement("p", {
        className: "wind"
      }, item.night_wind_direction), /*#__PURE__*/_react["default"].createElement("p", {
        className: "wind"
      }, item.night_wind_power, "\u7EA7"));
    })), /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-chart-days",
      style: {
        width: 500
      }
    }, /*#__PURE__*/_react["default"].createElement(_core["default"], {
      echarts: _echarts["default"],
      option: option
    }))));
  };

  var daysDragDown = function daysDragDown(e) {
    curX = e.clientX;
    daysDragLock = false;
  };

  if (observe) {
    var current = observe['observe'];
    var tomorrowForecast = observe['forecast_24h'][2];
    var todayForecast = observe['forecast_24h'][1];
    var mainClass = m[current['weather_code']] + " " + dayOrNight((0, _moment["default"])()) + " container";
    return /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "weather-root"
    }, props), /*#__PURE__*/_react["default"].createElement("section", {
      id: "sec-main",
      className: mainClass
    }, /*#__PURE__*/_react["default"].createElement("audio", {
      id: "weather-audio",
      src: ""
    }), /*#__PURE__*/_react["default"].createElement("p", {
      id: "txt-location"
    }, /*#__PURE__*/_react["default"].createElement("span", {
      id: "icon-location"
    }), city), /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-pub"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "txt hide"
    }, "\u4E2D\u592E\u6C14\u8C61\u53F0 ", current['update_time'].substring(8, 10) + ":" + current['update_time'].substring(11, 12), "\u53D1\u5E03")), /*#__PURE__*/_react["default"].createElement("p", {
      id: "txt-temperature",
      className: "positive"
    }, current['degree']), /*#__PURE__*/_react["default"].createElement("p", {
      id: "txt-weather"
    }, [current['weather']]), /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-wind-humidity"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: windOrHumidity ? "show txt" : "txt"
    }, todayForecast['day_wind_direction'], " ", todayForecast['day_wind_power'], "\u7EA7"), /*#__PURE__*/_react["default"].createElement("p", {
      className: !windOrHumidity ? "show txt" : "txt"
    }, "\u6E7F\u5EA6 ", current['humidity'], "%")), /*#__PURE__*/_react["default"].createElement("p", {
      id: "txt-tips",
      onClick: changeTip
    }, observe['tips']['observe'][tip]), /*#__PURE__*/_react["default"].createElement("div", {
      id: "ct-landscape"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer",
      id: "layer1"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer",
      id: "layer2"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "layer",
      id: "layer3",
      style: {
        transform: "translate3d(0px, 0px, 0px)"
      }
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "ct-aqi level2",
      "data-boss": "aqi"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      id: "til"
    }, observe["air"]["aqi"]), /*#__PURE__*/_react["default"].createElement("p", {
      id: "value"
    }, observe["air"]["aqi_name"]))), showTomorrow && /*#__PURE__*/_react["default"].createElement("section", {
      id: "sec-tomorrow",
      className: "container"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "item"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "top"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "date"
    }, "\u4ECA\u5929"), /*#__PURE__*/_react["default"].createElement("p", {
      className: "temperature"
    }, todayForecast['max_degree'], "/", todayForecast['min_degree'], "\xB0")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "bottom"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "weather"
    }, todayForecast['day_weather']), /*#__PURE__*/_react["default"].createElement("img", {
      src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/".concat(todayForecast['day_weather_code'], ".svg"),
      className: "logo"
    }))), /*#__PURE__*/_react["default"].createElement("div", {
      className: "item"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "top"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "date"
    }, "\u660E\u5929"), /*#__PURE__*/_react["default"].createElement("p", {
      className: "temperature"
    }, tomorrowForecast['max_degree'], "/", tomorrowForecast['min_degree'], "\xB0")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "bottom"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "weather"
    }, tomorrowForecast['day_weather']), /*#__PURE__*/_react["default"].createElement("img", {
      src: "//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/".concat(tomorrowForecast['day_weather_code'], ".svg"),
      className: "logo"
    })))), showHours && initHours(observe), showDays && initDays(observe["forecast_24h"]), showLiving && initLiving(observe["index"]));
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", null);
  }
}

var _default = Weather;
exports["default"] = _default;