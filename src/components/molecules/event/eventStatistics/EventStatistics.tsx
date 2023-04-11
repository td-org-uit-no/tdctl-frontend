import React, { useState, useEffect } from 'react';
import { Event, Participant } from 'models/apiModels';
import { getAllMembers } from 'api';
import { useToast } from 'hooks/useToast';
import ReactEcharts from 'echarts-for-react';
import styles from './EventStatistics.module.scss';
import Table, { ColumnDefinitionType } from 'components/atoms/table/Table';
import { RegisterTheme } from '../../../../styles/registerTheme';
import { sortNumber, sortString } from 'utils/sorting';

RegisterTheme();

const EventStatistics: React.FC<{
  event: Event;
  setFetchUpdateHook: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ event }) => {
  const [classDistribution, setClassDistribution] = useState<
    any[] | undefined
  >();
  const { addToast } = useToast();
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [submitTime, setSubmitTime] = useState<string[]>([]);
  const [submitNumber, setSubmitNumber] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Participant[]>([]);

  // CHART OPTIONS
  const optionSubmissionGaugeData = [
    {
      value: Math.round((submissions.length / totalMembers) * 100).toFixed(2),

      name: `TD memebrs submitted / ${totalMembers}`,

      title: {
        offsetCenter: ['0%', '-30%'],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%'],
      },
    },
  ];
  const optionSubmissions = {
    series: [
      {
        type: 'gauge',

        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#464646',
          },
        },
        axisLine: {
          lineStyle: {
            width: 15,
            opacity: 0.1,
          },
        },
        splitLine: {
          show: false,
          distance: 20,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: optionSubmissionGaugeData,
        title: {
          fontSize: 10,
        },
        detail: {
          width: 30,
          height: 14,
          fontSize: 14,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          formatter: '{value}%',
        },
      },
    ],

    tooltip: {
      trigger: 'item',
    },
  };
  const optionFoodGaugeData = [
    {
      value: participants.filter((participant) => participant.food).length,

      name: `Participants need food`,

      title: {
        offsetCenter: ['0%', '-30%'],
      },

      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%'],
      },
    },
  ];
  const optionFood = {
    series: [
      {
        type: 'gauge',
        max: participants.length,
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
          },
        },
        axisLine: {
          lineStyle: {
            width: 15,
            opacity: 0.1,
          },
        },

        splitLine: {
          show: false,
          distance: 20,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: optionFoodGaugeData,
        title: {
          fontSize: 10,
        },
        detail: {
          width: 30,
          height: 14,
          fontSize: 14,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,

          formatter: '{value}',
        },
      },
    ],

    tooltip: {
      trigger: 'item',
    },
  };
  const optionClassDistribution = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },

    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Class/year',
        type: 'pie',
        radius: ['75%', '60%'],
        data: classDistribution,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
  const optionTimeSubmit = {
    xAxis: {
      type: 'category',
      data: submitTime,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: submitNumber,
        type: 'line',
        // areaStyle: {},
        // smooth: true,
        smooth: 0.6,
        lineStyle: {
          width: 2,
        },
        areaStyle: {
          opacity: 0.5,
        },
      },
    ],
  };
  const optiontransportationGaugeData = [
    {
      value: participants.filter((participant) => participant.transportation)
        .length,
      name: `Participants need transportation`,
      title: {
        offsetCenter: ['0%', '-30%'],
      },

      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%'],
      },
    },
  ];
  const optiontransportation = {
    series: [
      {
        type: 'gauge',
        max: participants.length,
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
          },
        },
        axisLine: {
          lineStyle: {
            width: 15,
            opacity: 0.1,
          },
        },

        splitLine: {
          show: false,
          distance: 20,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: optiontransportationGaugeData,
        title: {
          fontSize: 10,
        },
        detail: {
          width: 30,
          height: 14,
          fontSize: 14,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          formatter: '{value}',
        },
      },
    ],

    tooltip: {
      trigger: 'item',
    },
  };

  const dieataryRestrictionsColumns: ColumnDefinitionType<
    Participant,
    keyof Participant
  >[] = [
    { cell: 'realName', header: 'Name', type: 'string' },
    {
      cell: 'dietaryRestrictions',
      header: 'DietaryRestrictions',
      type: 'string',
    },
  ];

  const fetchMembers = async () => {
    try {
      const res = await getAllMembers();
      setTotalMembers(res.length);
      // setParticipants(event.participants || []);
      setSubmissions(event.participants || []);
      // initializeParticipants();
    } catch (error) {
      addToast({
        title: 'Error',
        status: 'error',
        description: 'Error fetching members',
      });
    }
  };

  const initializeSubmitDates = () => {
    const dict: Record<string, number> = {};
    event.participants?.forEach((participant, idx) => {
      const date = new Date(participant.submitDate).setMinutes(0, 0, 0);
      const day = new Date(date).getDate();
      const hour = new Date(date).getHours();
      const timeOfDay = `${day}-${hour}`;
      dict[timeOfDay] = idx;
    });
    const timeArray = Object.keys(dict).sort((a, b) => sortString(a, b));
    const numberArray = Object.values(dict).sort((a, b) => sortNumber(a, b));

    setSubmitTime(timeArray);
    setSubmitNumber(numberArray);
  };

  type classDistributionType = {
    value: number;
    name: string;
  };

  // Groups an array of objects by a given key into an object of the keys
  function groupBy<T>(collection: T[], key: keyof T) {
    const groupedResult = collection.reduce((previous, current) => {
      if (!previous[current[key]]) {
        previous[current[key]] = [] as T[];
      }
      previous[current[key]].push(current);
      return previous;
    }, {} as any);
    return groupedResult;
  }

  // Sorts +filtering participants within maxParticipants
  const initializeParticipants = () => {
    const parts = event.participants?.sort((a, b) =>
      sortString(a.submitDate, b.submitDate)
    );
    setParticipants(parts?.slice(0, event.maxParticipants) || []);
  };

  useEffect(() => {
    const initializeMembersByClass = () => {
      const data: classDistributionType[] = [];

      const membersGroupedByClass = groupBy<Participant>(
        participants || [],
        'classof'
      );
      Object.entries(membersGroupedByClass).forEach(([key]) => {
        data.push({ value: membersGroupedByClass[key].length, name: key });
      });
      setClassDistribution(data);
    };

    initializeMembersByClass();
  }, [participants]);

  useEffect(() => {
    fetchMembers();
    initializeSubmitDates();
    initializeParticipants();
  }, [event]);

  return (
    <div className={styles.content}>
      <div className={styles.chart_grid}>
        <div className={styles.grid_item}>
          <h5 className={styles.text_center}>Members submitted</h5>
          <ReactEcharts option={optionSubmissions} theme="TD_theme" />
        </div>
        <div className={styles.grid_item}>
          <h5 className={styles.text_center}>Food distribution</h5>
          <ReactEcharts option={optionFood} theme="TD_theme" />
        </div>
        <div className={styles.grid_item}>
          <h5 className={styles.text_center}>Class distribution</h5>
          <ReactEcharts option={optionClassDistribution} theme="TD_theme" />
        </div>
        <div className={styles.grid_item}>
          <h5 className={styles.text_center}>transportation distribution</h5>
          <ReactEcharts option={optiontransportation} theme="TD_theme" />
        </div>
      </div>
      <div className={styles.timeline}>
        <h5 className={styles.text_center}>Submit timeline</h5>
        <ReactEcharts option={optionTimeSubmit} theme="TD_theme" />
      </div>

      <h5>Dietary restrictions</h5>
      <Table
        columns={dieataryRestrictionsColumns}
        data={participants.filter(
          (part) => part.dietaryRestrictions !== '' && part.food === true
        )}></Table>
    </div>
  );
};

export default EventStatistics;
