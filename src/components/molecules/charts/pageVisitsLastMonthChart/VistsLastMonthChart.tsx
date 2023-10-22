import { Flex } from '@chakra-ui/react';
import { getPageVisitsLastMonth } from 'api';
import { IPageStats } from 'models/apiModels';
import { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const VisitLastMonthChart = () => {
  const [siteStats, setSiteStats] = useState<IPageStats[] | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const fetchPageVisits = async () => {
    try {
      const res = await getPageVisitsLastMonth();
      setSiteStats(res);
    } catch (error) {
      setErrorMessage('En feil skjedde ved henting av data');
    }
  };

  useEffect(() => {
    fetchPageVisits();
  }, []);

  return (
    <Flex w="100%" h="100%" flexDir="column" textAlign="center">
      {errorMessage === undefined ? (
        <ReactEcharts
          option={{
            xAxis: {
              name: 'Besøk',
              type: 'value',
              show: false,
              axisLine: {
                show: false,
              },
              z: 2,
              axisTick: {
                show: false,
              },
            },
            yAxis: {
              type: 'category',
              show: true,
              position: 'left',
              axisLine: {
                show: false,
              },
              z: 3,
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: '#FFF',
                inside: true,
                show: true,
              },
              nameLocation: 'start',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'none',
              },
            },
            grid: {
              containLable: true,
              left: '4%',
              top: '2.5%',
              bottom: '2.5%',
            },
            series: [
              {
                type: 'bar',
                // do not handle if the text and count number overflow i.e when the page has few visits
                label: {
                  show: true,
                  align: 'right',
                  verticalAlign: 'middle',
                  position: 'insideRight',
                  overflow: 'break',
                  color: '#FFF',
                },
                datasetIndex: 1,
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#008D8E', // --histogram-item-gradient-background
                      },
                      {
                        offset: 1,
                        color: '#24C1C3', // color at 100%
                      },
                    ],
                    global: false, // default is false
                  },
                  borderRadius: 6,
                },
              },
            ],
            dataset: [
              {
                // sets the name of keys in dict
                dimensions: ['title', 'count'],
                source: siteStats ?? [],
              },
              {
                transform: {
                  type: 'sort',
                  config: { dimension: 'count', order: 'asc' },
                },
              },
            ],
            barWidth: '80%',
            barGap: '80%',
            barCategoryGap: '50%',
          }}
          style={{ display: 'flex', width: '100%' }}
        />
      ) : (
        <p>{errorMessage}</p>
      )}
    </Flex>
  );
};

export default VisitLastMonthChart;
