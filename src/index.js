import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsonp from 'jsonp';
import moment from 'moment';
import echarts from 'echarts/lib/echarts';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import "./index.css";

const m = {
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
};

//黄历、穿衣、雨伞、感冒、洗车、运动、防晒、钓鱼、旅游、交通、空气污染扩散条件、舒适度、晾晒指数
var livingKeys = [
    // { key: "huangli", icon: "icon_huangli" },
    { key: "clothes", icon: "icon_chuanyi" },
    { key: "umbrella", icon: "icon_yusan" },
    { key: "cold", icon: "icon_ganmao" },
    { key: "carwash", icon: "icon_xiche" },
    { key: "sports", icon: "icon_yundong" },
    { key: "sunscreen", icon: "icon_fangsai" },
    { key: "fish", icon: "icon_diaoyu" },
    { key: "tourism", icon: "icon_lvyou" },
    { key: "traffic", icon: "icon_jiaotong" },
    { key: "diffusion", icon: "icon_wurankuosan" },
    { key: "comfort", icon: "icon_shushidu" },
    { key: "drying", icon: "icon_liangshai" },
    { key: "makeup", icon: "icon_huazhuang" },
    { key: "morning", icon: "icon_chenlian" },
    { key: "chill", icon: "icon_guomin" },
    { key: "heatstroke", icon: "icon_zhongshu" },
];

//配置穿衣指数的信息
//key:序号，level：穿衣级别，icon：对应服饰的icon
//1，炎热;2，热，短袖
//3，舒适;4，较舒适，长袖，衬衫，薄外套
//5，较冷，厚外套，毛衣
//6，冷;7，寒冷，棉服，羽绒服
var clothesKeys = [
    { key: 1, level: "炎热", icon: "icon_chuanyi_hot" },
    { key: 2, level: "热", icon: "icon_chuanyi_hot" },
    { key: 3, level: "舒适", icon: "icon_chuanyi_shushi" },
    { key: 4, level: "较舒适", icon: "icon_chuanyi_shushi" },
    { key: 5, level: "较冷", icon: "icon_chuanyi_jiaoleng" },
    { key: 6, level: "冷", icon: "icon_chuanyi_cool" },
    { key: 7, level: "寒冷", icon: "icon_chuanyi_cool" }
]

moment.locale('zh-cn', {
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_')
});

let curX = 0,
    hoursDragLock = true, // 小时预报 加锁
    daysDragLock = true, // 7天预报 加锁
    livingDragLock = true; // 生活指数 加锁

function Weather({ province, city, props = {}, showDays = true, showHours = true, showLiving = true, showTomorrow = true }) {
    if (city == "") {
        province = "上海"
        city = "上海"
    }
    const [observe, setObserve] = useState(undefined)
    const [windOrHumidity, setWindOrHumidity] = useState(true)
    const [LivingLeft, setLivingLeft] = useState(true)
    const [livingWidth, setLivingWidth] = useState(500)
    const [hoursLeft, setHousrLeft] = useState(0) // 小时预报
    const [daysLeft, setDaysLeft] = useState(0) // 7天预报
    const [tip, setTip] = useState(0) // tip：切换
    const hoursRef = useRef(null);
    const daysRef = useRef(null);
    // https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    const livingRef = useCallback(node => {
        if (node !== null) {
            setLivingWidth(() => {
                return node.getBoundingClientRect().width
            })
        }
    }, []);
    // const [hoursCurX, setHoursCurX] = useState(0) // 鼠标位置
    useEffect(() => {
        jsonp(`https://wis.qq.com/weather/common?source=pc&weather_type=forecast_1h|forecast_24h|alarm|limit|tips|rise|observe|index|air&province=${province}&city=${city}&county=`, {}, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                setObserve(data.data)
            }
        })

        // tip 轮换
        let tick = setInterval(() => {
            setWindOrHumidity((v) => {
                return !v
            })
        }, 5000);
        // 拖动
        if(typeof window !== 'undefined') {
            document.addEventListener("mouseup", dragUp)
        }
        return () => {
            clearInterval(tick)
            if(typeof window !== 'undefined') {
                document.removeEventListener("mouseup", dragUp)
            }
        }
    }, [])
    // useEffect(() => {
    //     livingWidth = livingRef.current.clientWidth
    // }, [livingRef.current])
    const dragUp = (e) => {
        if (!hoursDragLock) {
            let move = e.clientX - curX
            setHousrLeft((hoursLeft) => {
                let x = move <= 0 ? hoursLeft - hoursRef.current.clientWidth : hoursLeft + hoursRef.current.clientWidth
                x = x >= 0 ? 0 : x;
                x = Math.abs(x) <= hoursRef.current.clientWidth * 3 ? x : - hoursRef.current.clientWidth * 3;
                return x
            });
        }
        if (!daysDragLock) {
            let move = e.clientX - curX
            setDaysLeft(() => {
                let x = move <= 0 ? daysRef.current.clientWidth - 500 : 0
                x = x >= 0 ? 0 : x;
                x = Math.abs(x) <= 500 ? x : 0;
                return x
            });
        }
        if (!livingDragLock) {
            let move = e.clientX - curX
            setLivingLeft(() => {
                return move <= 0 ? 375 : 0
            });
        }
        hoursDragLock = true;
        daysDragLock = true;
        livingDragLock = true;
    }
    /**
     * 小时预报：初始化
     * @param {Object} observe 
     */
    const initHours = (observe) => {
        let keys = Object.keys(observe['forecast_1h']).sort((m, n) => {
            m = parseInt(m)
            n = parseInt(n)
            if (m > n) {
                return 1
            } else if (m < n) {
                return -1
            } else {
                return 0
            }
        }).slice(0, 25)
        let list = []
        keys.forEach((key) => {
            let day = observe['forecast_1h'][key]
            // 日期(0点 => 明天)
            let update_time = parseDate(day['update_time'])
            let time = update_time.format("HH") + ":" + update_time.format("mm")
            if (update_time.hour() == 0) {
                time = "明天"
            }
            // 日出/日落
            let sunrise = undefined
            let sunset = undefined
            // 白天或晚上
            let _dayOrNight = dayOrNight(update_time)
            let vise = getRise(Object.values(observe['rise']), update_time)
            if (vise) {
                // 日出
                if (vise["sunrise"].hour() == update_time.hour()) {
                    sunrise = vise["sunrise"].format("HH") + ":" + vise["sunrise"].format("mm")
                }
                if (vise["sunset"].hour() == update_time.hour()) {
                    sunset = vise["sunset"].format("HH") + ":" + vise["sunset"].format("mm")
                }
            }
            list.push(
                <li className="item" key={key} style={{ width: "3.84615%" }}>
                    <p className="txt-time">{time}</p>
                    <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/${_dayOrNight}/${day['weather_code']}.svg`} className="icon" />
                    <p className="txt-degree positive">{day['degree']}</p>
                </li>
            )
            if (sunrise) {
                list.push(
                    <li className="item keypoint" key="100" style={{ width: "3.84615%" }}><p className="txt-time">{sunrise}</p><img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/rise.svg" className="icon" /><p className="txt-key">日出</p></li>
                )
            }
            if (sunset) {
                list.push(
                    <li className="item keypoint" key="101" style={{ width: "3.84615%" }}><p className="txt-time">{sunset}</p><img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/set.svg" className="icon" /><p className="txt-key">日落</p></li>
                )
            }
        })
        while (list.length > 26) {
            list.pop()
        }
        return (
            <section id="sec-hours" className="container" ref={hoursRef}>
                <div id="ct-scroll" onMouseDown={hoursDragDown} style={{ width: "400%", cursor: "grab", height: "100%", transitionDuration: "500ms", transform: "translate(" + hoursLeft + "px, 0px)" }}>
                    <div style={{ position: "absolute", inset: 0, zIndex: 10, height: "100%" }}></div>
                    <ol id="ls-hours-weather">
                        {list}
                    </ol>
                </div>
            </section>
        )
    }
    /**
     * 小时预报：左右拖动
     * @param {*} e 
     */
    const hoursDragDown = (e) => {
        curX = e.clientX
        hoursDragLock = false
    }
    const changeTip = () => {
        let c = 0
        for (let i in observe["tips"]["observe"]) {
            c++
        }
        let t = (tip + 1) % c
        setTip(t)
    }
    /**
     * 小时预报：白天或晚上
     * @param {moment} date
     * @returns string
     */
    const dayOrNight = (date) => {
        let vise = getRise(Object.values(observe['rise']), date)
        if (vise) {
            if (vise['sunrise'].isBefore(date) && vise['sunset'].isAfter(date)) {
                return "day"
            } else {
                return "night"
            }
        }
        return "day"
    }
    /**
     * 解析时间
     * @param {moment} source 
     */
    const parseDate = (source) => {
        let format = ["YYYYMMDDHHmmss", "YYYYMMDD", "YYYYMMDDHHmm"];
        return moment(source, format, 'fr')
    }
    /**
     * 日出日落时间
     * @param {array} rise
     * @param {moment} date
     * @returns {"sunrise": {moment}, "sunset": {moment}} 
     */
    const getRise = (rise, date) => {
        if (!(rise instanceof Array)) {
            return undefined
        }
        for (let i = 0; i < rise.length; i++) {
            let time = parseDate(rise[i]['time'])
            if (time.day() == date.day() && time.month() == date.month()) {
                return {
                    'sunrise': parseDate(rise[i]['time'] + rise[i]['sunrise'].replace(":", "")),
                    'sunset': parseDate(rise[i]['time'] + rise[i]['sunset'].replace(":", ""))
                }
            }
        }
        return undefined
    }
    /**
     * 生活指数：初始化
     * @param {object} index 生活指数map
     */
    const initLiving = (index) => {
        let data = [];
        livingKeys.forEach(function (item) {
            //根据当前穿衣级别修改对应服饰的icon
            if (item.key === "clothes") {
                clothesKeys.forEach(function (item1) {
                    if (index[item.key].info === item1.level) {
                        item.icon = item1.icon;
                    }
                })
            }
            data.push({
                name: index[item.key].name,
                info: index[item.key].info,
                detail: index[item.key].detail,
                icon: item.icon
            })
        });
        return (
            <section id="sec-living" className="container" onMouseDown={livingDragDown} ref={livingRef}>
                <div id="living-scroll">
                    <div className="react-swipe-container " style={{ overflow: "hidden", cursor: "grab", userSelect: "none", visibility: "visible", position: "relative" }}>
                        <div style={{ overflow: "hidden", position: "relative", width: livingWidth * 2 }}>
                            <ul className="ls-living" data-index="0" style={{ cssFloat: "left", width: livingWidth, position: "relative", transitionProperty: "transform", left: 0, transitionDuration: "300ms", transform: "translate(" + (0 - LivingLeft) + "px, 0px) translateZ(0px)" }}>
                                {
                                    data.slice(0, 8).map(({ icon, name, info, detail }, key) => (
                                        <li className="item" key={key}><span className={"icon " + icon}></span><p className="content">{info}</p><p className="title">{name}</p></li>
                                    ))
                                }
                            </ul>
                            <ul className="ls-living" data-index="1" style={{ cssFloat: "left", width: livingWidth, position: "relative", transitionProperty: "transform", left: -livingWidth, transitionDuration: "300ms", transform: "translate(" + (livingWidth - LivingLeft) + "px, 0px) translateZ(0px)" }}>
                                {
                                    data.slice(8, 16).map(({ icon, name, info, detail }, key) => (
                                        <li className="item" key={key}><span className={"icon " + icon}></span><p className="content">{info}</p><p className="title">{name}</p></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
    const livingDragDown = (e) => {
        curX = e.clientX
        livingDragLock = false
    }
    /**
     * 7日天气预报：初始化
     * @param {forecast_24h} data 
     */
    const initDays = (data) => {
        let today = moment();
        let formatData = [],
            chartLabelData = [],
            chartMaxData = [],
            chartMinData = [];

        for (var i = 0; i < 8; i++) {
            var item = data[i];
            if (item.day_weather_short && item.night_weather_short && item.max_degree && item.min_degree) {
                if (moment(item.time).add(1, 'days').isSame(today, 'day')) {
                    item.showText = "昨天";
                } else if (moment(item.time).isSame(today, 'day')) {
                    item.showText = "今天";
                } else if (moment(item.time).subtract(1, 'days').isSame(today, 'day')) {
                    item.showText = "明天";
                } else if (moment(item.time).subtract(2, 'days').isSame(today, 'day')) {
                    item.showText = "后天";
                } else {
                    item.showText = moment(item.time).format('ddd');
                }
                chartLabelData.push(item.time)
                chartMaxData.push(item.max_degree - 0);
                chartMinData.push(item.min_degree - 0);
                if (item.time) {
                    item.formatTime = item.time.substring(5).replace("-", "月") + "日";
                }
                formatData.push(item)
            }
        }

        let option = {
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
                        formatter: function (val) {
                            if (val.dataIndex == 0) {
                                return "{first|" + val.data + "°}"
                            }
                            return val.data + "°"
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
            },
            {
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
                        formatter: function (val) {
                            if (val.dataIndex == 0) {
                                return "{first|" + val.data + "°}"
                            }
                            return val.data + "°"
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
            }
            ]
        };
        return (
            <section id="sec-days" className="container" onMouseDown={daysDragDown} ref={daysRef}>
                <div id="ct-scroll" style={{ width: 500, cursor: "grab", height: "100%", userSelect: "none", transitionDuration: "500ms", transform: "translate(" + daysLeft + "px, 0px)" }}>
                    <ol id="ls-days">
                        {
                            formatData.map((item, key) => (
                                <li className="item" key={key}><p className="day">{item.showText}</p><p className="date">{moment(item.time).format("MM/DD")}</p>
                                    <div className="ct-daytime">
                                        <p className="weather">{item.night_weather}</p>
                                        <img src={"//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/" + item.day_weather_code + ".svg"} className="icon" />
                                    </div>
                                    <div className="ct-night">
                                        <img src={"//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/" + item.night_weather_code + ".svg"} className="icon" />
                                        <p className="weather">{item.night_weather_short}</p>
                                    </div><p className="wind">{item.night_wind_direction}</p><p className="wind">{item.night_wind_power}级</p>
                                </li>
                            ))
                        }
                    </ol>
                    <div id="ct-chart-days" style={{ width: 500 }}>
                        <ReactEchartsCore
                            echarts={echarts}
                            option={option}
                        />
                    </div>
                </div>
            </section>
        )
    }
    const daysDragDown = (e) => {
        curX = e.clientX
        daysDragLock = false
    }
    if (observe) {
        let current = observe['observe']
        let tomorrowForecast = observe['forecast_24h'][2]
        let todayForecast = observe['forecast_24h'][1]
        let mainClass = m[current['weather_code']] + " " + dayOrNight(moment()) + " container"
        return (
            <div className="weather-root" {...props}>
                <section id="sec-main" className={mainClass}>
                    <audio id="weather-audio" src=""></audio>
                    <p id="txt-location"><span id="icon-location"></span>{city}</p>
                    <div id="ct-pub">
                        <p className="txt hide">中央气象台 {current['update_time'].substring(8, 10) + ":" + current['update_time'].substring(11, 12)}发布</p>
                    </div>
                    <p id="txt-temperature" className="positive">{current['degree']}</p>
                    <p id="txt-weather">{[current['weather']]}</p>
                    <div id="ct-wind-humidity">
                        <p className={windOrHumidity ? "show txt" : "txt"}>{todayForecast['day_wind_direction']} {todayForecast['day_wind_power']}级</p>
                        <p className={!windOrHumidity ? "show txt" : "txt"}>湿度 {current['humidity']}%</p>
                    </div>
                    <p id="txt-tips" onClick={changeTip}>{observe['tips']['observe'][tip]}</p>
                    <div id="ct-landscape">
                        <div className="layer" id="layer1"></div>
                        <div className="layer" id="layer2"></div>
                        <div className="layer" id="layer3" style={{ transform: "translate3d(0px, 0px, 0px)" }}></div>
                    </div>
                    <div className="ct-aqi level2" data-boss="aqi">
                        <p id="til">{observe["air"]["aqi"]}</p>
                        <p id="value">{observe["air"]["aqi_name"]}</p>
                    </div>
                </section>
                {
                    showTomorrow && (<section id="sec-tomorrow" className="container">
                        <div className="item">
                            <div className="top">
                                <p className="date">今天</p>
                                <p className="temperature">{todayForecast['max_degree']}/{todayForecast['min_degree']}&deg;</p>
                            </div>
                            <div className="bottom">
                                <p className="weather">{todayForecast['day_weather']}</p>
                                <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${todayForecast['day_weather_code']}.svg`} className="logo" />
                            </div>
                        </div>
                        <div className="item">
                            <div className="top">
                                <p className="date">明天</p>
                                <p className="temperature">{tomorrowForecast['max_degree']}/{tomorrowForecast['min_degree']}&deg;</p>
                            </div>
                            <div className="bottom">
                                <p className="weather">{tomorrowForecast['day_weather']}</p>
                                <img src={`//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/${tomorrowForecast['day_weather_code']}.svg`} className="logo" />
                            </div>
                        </div>
                    </section>)
                }
                {showHours && initHours(observe)}
                {showDays && initDays(observe["forecast_24h"])}
                {showLiving && initLiving(observe["index"])}
            </div>
        )
    } else {
        return (<div></div>)
    }

}

export default Weather