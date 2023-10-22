import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { getUniqueVisits } from 'api';
import { IVisits } from 'models/apiModels';
import { TooltipComponentFormatterCallbackParams, graphic } from 'echarts';
import { DateOptions, manipulateDate } from 'utils/date';
import { Select, Flex, useMediaQuery } from '@chakra-ui/react';

type IntervalOptions = 'day' | 'week' | 'month' | 'year' | 'all-time';

type IntervalDict = {
  [key in IntervalOptions]: DateOptions;
};

export interface StringDict {
  [key: string]: string;
}

const UniqueVisitsCharts = () => {
  const [siteStats, setSiteStats] = useState<IVisits[] | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [interval, setInterval] = useState<IntervalOptions>('month');
  const [isLargerThan800] = useMediaQuery('(min-width: 768px)');
  // dict containing the date manipulation
  let dateInterval: IntervalDict = {
    day: { day: -1 },
    week: { day: -7 },
    month: { month: -1 },
    year: { year: -1 },
    'all-time': {},
  };

  // dict to convert key to chart display in Norwegian
  let keyToDisplayName: StringDict = {
    date: 'Dato',
    coun: 'Besøk',
  };

  const fetchUniqueVisits = async (period: IntervalOptions) => {
    // removes millisecond
    const currentDate = new Date();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const startDate = manipulateDate(currentDate, dateInterval[period]);
    // to get the desired format
    const start = startDate.toLocaleString('sv-SE', { timeZone: tz });
    try {
      const res = await getUniqueVisits(
        period === 'all-time' ? undefined : start
      );
      setSiteStats(res);
    } catch (error) {
      setErrorMessage('En feil skjedde ved henting av data');
    }
  };

  const changeInterval = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(event.target.value as IntervalOptions);
  };

  useEffect(() => {
    fetchUniqueVisits(interval);
  }, [interval]);

  return (
    <Flex w="100%" height="100%" flexDir="column">
      {errorMessage === undefined ? (
        <>
          <Flex w="100%">
            <Flex w={`${isLargerThan800 ? 'auto' : '100%'}`}>
              <Select
                onChange={changeInterval}
                value={interval}
                alignSelf="flex-start">
                <option value="day">I dag</option>
                <option value="week">Siste 7 dagene</option>
                <option value="month">Siste måned</option>
                <option value="year">Siste år</option>
                <option value="all-time">Hele historikken</option>
              </Select>
            </Flex>
          </Flex>
          <Flex width="100%" height="100%">
            <ReactEcharts
              option={{
                xAxis: {
                  name: 'Dato',
                  // type of field in dict
                  type: 'time',
                  axisLabel: {
                    formatter:
                      interval === 'day'
                        ? '{MM}-{dd} kl {HH}'
                        : '{yyyy}-{MM}-{dd}',
                    hideOverlap: true,
                  },
                },
                yAxis: {
                  name: 'Besøk',
                  type: 'value',
                  // removes vertical lines in background
                  splitLine: {
                    show: false,
                  },
                },
                grid: {
                  containLable: true,
                  // handle mobile view
                  left: `${isLargerThan800 ? '3%' : '10%'}`,
                  right: `${isLargerThan800 ? '4%' : '15%'}`,
                },
                // allows data display on hover
                tooltip: {
                  trigger: 'axis',
                  type: 'item',
                  padding: 0,
                  formatter: (
                    params: TooltipComponentFormatterCallbackParams
                  ): string => {
                    // formatter can be either single value or array
                    const param = Array.isArray(params) ? params[0] : params;
                    // closet to a type safe tooltip as dimensionNames is not type as keyof data
                    let string = '';
                    Object.entries(param.data).forEach(([k, v]) => {
                      // use display name if defined in dict
                      string += `${keyToDisplayName[k] ?? k}: ${
                        keyToDisplayName[v] ?? v
                      } <br />`;
                    });
                    return string;
                  },
                },
                series: [
                  {
                    type: 'line',
                    smooth: 0.25,
                    showSymbol: false,
                    areaStyle: {
                      color: new graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: 'rgb(155, 175, 217)',
                        },
                        {
                          offset: 1,
                          color: 'rgb(16, 55, 131)',
                        },
                      ]),
                    },
                  },
                ],
                dataset: {
                  // sets the name of keys in dict
                  dimensions: ['date', 'count'],
                  source: siteStats ?? [],
                },
              }}
              style={{ display: 'flex', width: '100%' }}
            />
          </Flex>
        </>
      ) : (
        <p>{errorMessage}</p>
      )}
    </Flex>
  );
};

export default UniqueVisitsCharts;
