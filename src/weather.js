import React, { useState, useEffect } from 'react';
import jsonp from 'jsonp';
import moment from 'moment';
import "./weather.css";

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

function Weather({ province, city }) {
    const [observe, setObserve] = useState(undefined)
    const [windOrHumidity, setWindOrHumidity] = useState(true)
    const [hoursScrollLeft, setHoursScrollLeft] = useState(0)
    const [LivingLeft, setLivingLeft] = useState(true)
    const [tip, setTip] = useState(0)
    useEffect(() => {
        jsonp(`https://wis.qq.com/weather/common?source=pc&weather_type=forecast_1h|forecast_24h|alarm|limit|tips|rise|observe|index&province=${province}&city=${city}&county=`, {}, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                setObserve(data.data)
            }
        })
        let tick = setInterval(() => {
            setWindOrHumidity((v) => {
                return !v
            })
        }, 5000);
        return () => {
            clearInterval(tick)
        }
    }, [])
    /**
     * 渲染小时预报
     * @param {Object} observe 
     */
    const hoursForecast = (observe) => {
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
        while (list.length > 25) {
            list.pop()
        }
        return list
    }
    /**
     * 白天或晚上
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
    const hoursWheel = (e) => {
        const step = 15
        if (e.deltaY > 0) {
            if (hoursScrollLeft >= -1115) {
                setHoursScrollLeft(hoursScrollLeft - step)
            }
        } else {
            if (hoursScrollLeft < 0) {
                setHoursScrollLeft(hoursScrollLeft + step)
            }
        }
    }
    const LivingWheel = (e) => {
        if (e.deltaY > 0) {
            setLivingLeft(false);
        } else {
            setLivingLeft(true);
        }
    }
    const changeTip = () => {
        let c = 0
        for (let i in observe["tips"]["observe"]) {
            c++
        }
        let t = (tip + 1) % c
        setTip(t)
    }

    if (observe) {
        let current = observe['observe']
        let tomorrowForecast = observe['forecast_24h'][2]
        let todayForecast = observe['forecast_24h'][1]
        let mainClass = m[current['weather_code']] + " " + dayOrNight(moment())
        let carLimit = observe["limit"]["tail_number"] !== ""
        return (
            <div className="weather-root">
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
                        <p id="til">72</p>
                        <p id="value">良</p>
                    </div>
                    <div className="ct-pop-window">
                        <div className="bg-cover"></div>
                        <div className="ct-window">
                            <h3 className="title"></h3>
                            <p className="txt-info"></p>
                            <button className="btn-close">我知道了</button>
                        </div>
                    </div>
                    <div className="ct-pop-window">
                        <div className="bg-cover"></div>
                        <div id="ct-air-pop" className="ct-window levelundefined full">
                            <div id="ct-main">
                                <a id="icon-close"></a>
                                <p id="titl">空气质量指数</p>
                                <p id="val"></p>
                                <p id="level"></p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="sec-tomorrow" className="container">
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
                </section>
                <section id="sec-hours" className="container">
                    <div id="ct-scroll" onWheel={hoursWheel} style={{ width: "400%", transform: "translate(" + hoursScrollLeft + "px, 0px)" }}>
                        <ol id="ls-hours-weather">
                            {hoursForecast(observe)}
                        </ol>
                    </div>
                </section>
                {/* <section id="sec-days" className="container">
                    <div id="ct-scroll" style={{ width: 500 }}>
                        <ol id="ls-days">
                            <li className="item" ><p className="day">昨天</p><p className="date">01/03</p>
                                <div className="ct-daytime">
                                    <p className="weather">阴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/02.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/02.svg" className="icon" />
                                    <p className="weather">阴</p>
                                </div><p className="wind">东风</p><p className="wind">4级</p></li>
                            <li className="item" ><p className="day">今天</p><p className="date">01/04</p>
                                <div className="ct-daytime">
                                    <p className="weather">阴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/02.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/02.svg" className="icon" />
                                    <p className="weather">阴</p>
                                </div><p className="wind">东北风</p><p className="wind">4级</p></li>
                            <li className="item" ><p className="day">明天</p><p className="date">01/05</p>
                                <div className="ct-daytime">
                                    <p className="weather">阴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/02.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/01.svg" className="icon" />
                                    <p className="weather">多云</p>
                                </div><p className="wind">北风</p><p className="wind">4级</p></li>
                            <li className="item" ><p className="day">后天</p><p className="date">01/06</p>
                                <div className="ct-daytime">
                                    <p className="weather">阴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/02.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/02.svg" className="icon" />
                                    <p className="weather">阴</p>
                                </div><p className="wind">北风</p><p className="wind">5级</p></li>
                            <li className="item" ><p className="day">周四</p><p className="date">01/07</p>
                                <div className="ct-daytime">
                                    <p className="weather">阴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/02.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/01.svg" className="icon" />
                                    <p className="weather">多云</p>
                                </div><p className="wind">西北风</p><p className="wind">4级</p></li>
                            <li className="item" ><p className="day">周五</p><p className="date">01/08</p>
                                <div className="ct-daytime">
                                    <p className="weather">晴</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/00.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/01.svg" className="icon" />
                                    <p className="weather">多云</p>
                                </div><p className="wind">西北风</p><p className="wind">3级</p></li>
                            <li className="item" ><p className="day">周六</p><p className="date">01/09</p>
                                <div className="ct-daytime">
                                    <p className="weather">多云</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/01.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/02.svg" className="icon" />
                                    <p className="weather">阴</p>
                                </div><p className="wind">西南风</p><p className="wind">3级</p></li>
                            <li className="item" ><p className="day">周日</p><p className="date">01/10</p>
                                <div className="ct-daytime">
                                    <p className="weather">多云</p>
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/day/01.svg" className="icon" />
                                </div>
                                <div className="ct-night">
                                    <img src="//mat1.gtimg.com/pingjs/ext2020/weather/mobile2.0/assets/weather/night/00.svg" className="icon" />
                                    <p className="weather">晴</p>
                                </div><p className="wind">西风</p><p className="wind">3级</p></li>
                        </ol>
                        <div id="ct-chart-days" style={{ width: 500 }}>
                            <div className="chartjs-size-monitor" style={{position: "absolute",inset: "0px",overflow: "hidden",pointerEvents: "none",visibility: "hidden",zIndex: -1}}>
                                <div className="chartjs-size-monitor-expand" style={{ position: "absolute", left: "0", top: "0", right: "0", bottom: "0", overflow: "hidden", pointerEvents: "none", visibility: "hidden", zIndex: -1 }}>
                                    <div style={{ position: "absolute", width: "1000000px", height: "1000000px", left: "0", top: "0" }}></div>
                                </div>
                                <div className="chartjs-size-monitor-shrink" style={{ position: "absolute", left: "0", top: "0", right: "0", bottom: "0", overflow: "hidden", pointerEvents: "none", visibility: "hidden", zIndex: -1 }}>
                                    <div style={{ position: "absolute", width: "200%", height: "200%", left: "0", top: "0" }}></div>
                                </div>
                            </div>
                            <canvas height="272" width="1000" className="chartjs-render-monitor" style={{ display: "block", height: "136px", width: "500px" }}></canvas>
                        </div>
                    </div>
                </section>
                 */}
                <section id="sec-living" className="container">
                    <div id="living-scroll" onWheel={LivingWheel}>
                        <div className="react-swipe-container " style={{ overflow: "hidden", visibility: "visible", position: "relative" }}>
                            <div style={{ overflow: "hidden", position: "relative", width: "750px" }}>
                                <ul className="ls-living" data-index="0" style={{ cssFloat: "left", width: "375px", position: "relative", transitionProperty: "transform", left: "0px", transitionDuration: "300ms", transform: "translate(" + (LivingLeft ? "0" : "-375") + "px, 0px) translateZ(0px)" }}>
                                    {
                                        carLimit ?
                                            (<li className="item" data-boss="shzs"><span className="icon icon_xianhao"></span><p className="content">{observe["limit"]["tail_number"]}</p><p className="title">{observe["limit"]["time"]}</p></li>) :
                                            ""
                                    }
                                    <li className="item" data-boss="shzs"><span className="icon icon_chuanyi_cool"></span><p className="content">{observe["index"]["clothes"]["info"]}</p><p className="title">{observe["index"]["clothes"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_yusan"></span><p className="content">{observe["index"]["umbrella"]["info"]}</p><p className="title">{observe["index"]["umbrella"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_ganmao"></span><p className="content">{observe["index"]["cold"]["info"]}</p><p className="title">{observe["index"]["cold"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_xiche"></span><p className="content">{observe["index"]["carwash"]["info"]}</p><p className="title">{observe["index"]["carwash"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_yundong"></span><p className="content">{observe["index"]["sports"]["info"]}</p><p className="title">{observe["index"]["sports"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_fangsai"></span><p className="content">{observe["index"]["sunscreen"]["info"]}</p><p className="title">{observe["index"]["sunscreen"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_diaoyu"></span><p className="content">{observe["index"]["fish"]["info"]}</p><p className="title">{observe["index"]["fish"]["name"]}</p></li>
                                    {
                                        !carLimit ?
                                            (<li className="item" data-boss="shzs"><span className="icon icon_lvyou"></span><p className="content">{observe["index"]["tourism"]["info"]}</p><p className="title">{observe["index"]["tourism"]["name"]}</p></li>)
                                            : ""
                                    }
                                </ul>
                                <ul className="ls-living" data-index="1" style={{ cssFloat: "left", width: "375px", position: "relative", transitionProperty: "transform", left: "-375px", transitionDuration: "300ms", transform: "translate(" + (LivingLeft ? "375" : "0") + "px, 0px) translateZ(0px)" }}>
                                    {
                                        carLimit ?
                                            (<li className="item" data-boss="shzs"><span className="icon icon_lvyou"></span><p className="content">{observe["index"]["tourism"]["info"]}</p><p className="title">{observe["index"]["tourism"]["name"]}</p></li>)
                                            : ""
                                    }
                                    <li className="item" data-boss="shzs"><span className="icon icon_jiaotong"></span><p className="content">{observe["index"]["traffic"]["info"]}</p><p className="title">{observe["index"]["traffic"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_wurankuosan"></span><p className="content">{observe["index"]["diffusion"]["info"]}</p><p className="title_wurankuosan">{observe["index"]["diffusion"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_shushidu"></span><p className="content">{observe["index"]["comfort"]["info"]}</p><p className="title">{observe["index"]["comfort"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_liangshai"></span><p className="content">{observe["index"]["drying"]["info"]}</p><p className="title">{observe["index"]["drying"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_huazhuang"></span><p className="content">{observe["index"]["makeup"]["info"]}</p><p className="title">{observe["index"]["makeup"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_chenlian"></span><p className="content">{observe["index"]["morning"]["info"]}</p><p className="title">{observe["index"]["morning"]["name"]}</p></li>
                                    <li className="item" data-boss="shzs"><span className="icon icon_guomin"></span><p className="content">{observe["index"]["chill"]["info"]}</p><p className="title">{observe["index"]["chill"]["name"]}</p></li>
                                    {
                                        !carLimit ?
                                            (<li className="item" data-boss="shzs"><span className="icon icon icon_zhongshu"></span><p className="content">{observe["index"]["heatstroke"]["info"]}</p><p className="title">{observe["index"]["heatstroke"]["name"]}</p></li>)
                                            : ""
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    } else {
        return (<div></div>)
    }

}

export default Weather