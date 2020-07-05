import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import PriceCard from './PriceCard';

ReactFC.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const ClientTimezone = () => {
    let dateTime = new Date();
    let currentHour = dateTime.getHours();
    let zeroAddedCurrentHour = addLeadingZero(currentHour);
    let currentMin = dateTime.getMinutes();
    let currentSec = dateTime.getSeconds();
    let currentTime = zeroAddedCurrentHour + ':' + currentMin + ':' + currentSec;
    return currentTime
};

const addLeadingZero = (num) => {
    return (num <= 9) ? `0${num}` : num;
};


const ChartPage = () => {

    let chartRef = null;
    const [btc, setBtc] = useState('-');
    const [showChart, setShowChart] = useState(false);
    const [initialVal, setInitialVal] = useState(0);
    const [start, setStart] = useState(false);
    const [dataSource, setDataSource] = useState({
        "chart": {
            "caption": "Live Bitcoin Ticker",
            "subCaption": "",
            "xAxisName": "Local Time",
            "yAxisName": "USD",
            "numberPrefix": "$",
            "refreshinterval": "3",
            "slantLabels": "1",
            "numdisplaysets": "10",
            "labeldisplay": "rotate",
            "showValues": "0",
            "showRealTimeValue": "0",
            "theme": "fusion"
        },
        "catgories": [{
            "category": [{
                "label": ClientTimezone().toString()
            }]
        }],
        "dataset": [{
            "data": [{
                "value": 0
            }]
        }]
    });

    let chartConfig = {
        id: 'liveBTCTicker',
        type: 'realtimeline',
        renderAt: 'container',
        width: '100%',
        height: '350',
        dataFormat: 'json'
    };


    const getData = async () => {
        const response = await axios.get('https://api.cryptonator.com/api/ticker/btc-usd');
        const value = response.data;
        const sourceData = dataSource;
        sourceData.chart.yAxisMaxValue = parseFloat(value.ticker.price) + 5
        sourceData.chart.yAxisMinValue = parseFloat(value.ticker.price) - 5;
        setShowChart(true); setDataSource(sourceData); setInitialVal(value.ticker.price);
        setStart(true);

    };

    const upgradeData = () => {
        setInterval(async () => {
            const response = await axios.get('https://api.cryptonator.com/api/ticker/btc-usd');
            const value = response.data;
            setBtc(value.ticker.price);
            let xAxis = ClientTimezone();
            let yAxis = value.ticker.price;
            chartRef = FusionCharts('liveBTCTicker');
            chartRef.feedData(`&label= ${xAxis} &value= ${yAxis}`);

        }, 3000);
    };


    if (start) {
        upgradeData();
        setStart(false)
    }


    useEffect(() => {
        getData();
    }, [])

    return (
        <div className="row mt-5 mt-xs-4">
            <div className="col-2 mb-3">
                <div className="card-deck custom-card-deck">
                    <PriceCard header="Bitcoin(BTC)" label="(Price in USD)" value={btc} />
                </div>
            </div>
            <div className="col-12">
                <div className="card custom-card mb-5 mb-xs-4">
                    <div className="card-body">
                        {
                            showChart ?
                                <ReactFC
                                    {...chartConfig}
                                    dataSource={dataSource}
                                    onRender={chartRef} /> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartPage;