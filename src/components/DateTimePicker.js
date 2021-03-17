import { useState, useEffect } from 'react';

import { Space, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const DateTimePicker = ({ value = '', onChange }) => {

    const DAYS_PER_PAGE = 5;
    const HOURS_PER_PAGE = 5;
    const HOURS_STEPS = 30;
    const MIN_HOUR = 8;
    const MAX_HOUR = 16;
    const NOW = new Date();
    const DEFAULT_DATE = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), MIN_HOUR, 0, 0);

    const [choosenDay, setChoosenDate] = useState(new Date(value || DEFAULT_DATE));
    const [choosenHour, setChoosenHour] = useState(new Date(value || DEFAULT_DATE));
    const [hourIsSelected, setHourIsSelected] = useState(true);
    const [startDay, setStartDate] = useState(choosenDay);
    const [startHour, setStartHour] = useState(choosenHour);
    const [dates, setDates] = useState([]);
    const [hours, setHours] = useState([]);

    const getDates = (referenceDate, itemsCount) => {

        let dates = [];

        for (let i = 0; i < Math.abs(itemsCount); i++) {

            const date = new Date(referenceDate);

            date.setDate(referenceDate.getDate() + (itemsCount > 0 ? i : -i));

            dates.push(date);
        }

        if (itemsCount < 0) {

            dates = dates.reverse();
        }

        return dates;
    };

    const prevDate = () => {

        const dates = getDates(startDay, DAYS_PER_PAGE * -1);

        const _startDay = dates[0];

        setStartDate(_startDay);
    };

    const nextDate = () => {

        const dates = getDates(startDay, DAYS_PER_PAGE);

        const _startDay = dates[dates.length - 1];

        setStartDate(_startDay);
    };

    const getHours = (referenceDate, itemsCount) => {

        let dates = [];

        for (let i = 0; i < Math.abs(itemsCount); i++) {

            const date = new Date(referenceDate);

            date.setTime(referenceDate.getTime() + ((itemsCount > 0 ? i : -i) * 60000 * HOURS_STEPS));

            dates.push(date);
        }

        if (itemsCount < 0) {

            dates = dates.reverse();
        }

        return dates;
    };

    const prevHour = () => {

        const dates = getHours(startHour, HOURS_PER_PAGE * -1);

        const _startHour = dates[0];

        setStartHour(_startHour);
    };

    const nextHour = () => {

        const dates = getHours(startHour, HOURS_PER_PAGE);

        const _startHour = dates[dates.length - 1];

        setStartHour(_startHour);
    };

    useEffect(() => {

        const dates = getDates(startDay, DAYS_PER_PAGE);

        setDates(dates);
    }, [
        startDay,
    ]);

    useEffect(() => {

        const newHours = getHours(startHour, HOURS_PER_PAGE);

        setHours(newHours);
    }, [
        startHour,
    ]);

    useEffect(() => {

        if (hourIsSelected) {

            let choosenDate = choosenDay.getFullYear()
                + '-'
                + `${(choosenDay.getMonth() + 1)}`.padStart(2, '0')
                + '-'
                + `${choosenDay.getDate()}`.padStart(2, 0)
                + ' '
                + `${choosenHour.getHours()}`.padStart(2, '0')
                + ':'
                + `${choosenHour.getMinutes()}`.padEnd(2, '0')
                + ':00'
                ;

            onChange?.(choosenDate);
        }
        else {

            onChange?.(value);
        }
    }, [
        choosenDay,
        choosenHour,
    ]);

    useEffect(() => {

        if (!value) {

            setStartHour(DEFAULT_DATE);
            setChoosenHour(DEFAULT_DATE);
        }

        if (choosenDay.getTime() === DEFAULT_DATE.getTime()) {

            setHourIsSelected(false);

            let hour = DEFAULT_DATE;

            while (hour) {

                if (hour.getTime() > (new Date).getTime()) {

                    setStartHour(hour);
                    setChoosenHour(hour);

                    setHourIsSelected(true);

                    break;
                }

                const [, nextHour] = getHours(hour, 2);

                hour = nextHour;

                if (hour.getHours() >= MAX_HOUR) {

                    break;
                }
            }
        }
    }, [
        choosenDay,
    ]);

    useEffect(() => {

        if (NOW.getHours() >= MAX_HOUR) {

            const [, tomorrow] = getDates(DEFAULT_DATE, 2);

            setChoosenDate(tomorrow);
        }
    }, []);

    const MonthNames = () => {

        const [monthsNames, setMonthsNames] = useState([]);

        const getMonthName = (date) => {

            const monthsNamesMap = [];

            monthsNamesMap[0] = "Janeiro";
            monthsNamesMap[1] = "Fevereiro";
            monthsNamesMap[2] = "Março";
            monthsNamesMap[3] = "Abril";
            monthsNamesMap[4] = "Maio";
            monthsNamesMap[5] = "Junho";
            monthsNamesMap[6] = "Julho";
            monthsNamesMap[7] = "Agosto";
            monthsNamesMap[8] = "Setembro";
            monthsNamesMap[9] = "Outubro";
            monthsNamesMap[10] = "Novembro";
            monthsNamesMap[11] = "Dezembro";

            return monthsNamesMap[date.getMonth()];
        };

        useEffect(() => {

            setMonthsNames([]);

            const monthsNames = [];

            dates.forEach((date) => {

                const monthName = getMonthName(date);

                if (!monthsNames.includes(monthName)) {

                    monthsNames.push(monthName);
                }
            });

            setMonthsNames(monthsNames);
        }, [
            startDay,
        ]);

        return <h3>{monthsNames.join(' - ')}</h3>;
    };

    const DaysList = () => {

        const getDayInitials = (date) => {

            const weekdaysInitialsMap = [];

            weekdaysInitialsMap[0] = "Dom";
            weekdaysInitialsMap[1] = "Seg";
            weekdaysInitialsMap[2] = "Ter";
            weekdaysInitialsMap[3] = "Qua";
            weekdaysInitialsMap[4] = "Qui";
            weekdaysInitialsMap[5] = "Sex";
            weekdaysInitialsMap[6] = "Sáb";

            return weekdaysInitialsMap[date.getDay()];
        };

        return (
            <Space>
                {dates.map((day) => (
                    <Space
                        key={day.getTime()}
                        direction="vertical"
                        align="center"
                        style={{paddingInline: 4}}
                    >
                        <span>
                            {getDayInitials(day)}
                        </span>

                        <Button
                            type={day.getTime() === choosenDay.getTime() ? 'primary' : 'default'}
                            size="large"
                            shape="circle"
                            disabled={day.getTime() !== choosenDay.getTime() && day.getTime() < DEFAULT_DATE.getTime()}
                            onClick={() => setChoosenDate(day)}
                        >
                            {day.getDate()}
                        </Button>
                    </Space>
                ))}
            </Space>
        );
    };

    const HoursList = () => {

        return (
            <Space>
                {hours.map((hour) => (
                    <Button
                        key={hour.getTime()}
                        type={hour.getTime() === choosenHour.getTime() ? 'primary' : 'default'}
                        size="small"
                        shape="round"
                        style={{ height: 32 }}
                        disabled={(choosenDay.getTime() === DEFAULT_DATE.getTime() && hour.getTime() < (new Date).getTime()) || (hour.getHours() < MIN_HOUR) || (hour.getHours() > MAX_HOUR)}
                        onClick={() => setChoosenHour(hour)}
                    >
                        {(hour.getHours() + '').padStart(2, '0') + ':' + (hour.getMinutes() + '').padEnd(2, '0')}
                    </Button>
                ))}
            </Space>
        );
    };

    return (
        <Space
            direction="vertical"
            align="center"
        >
            <MonthNames />

            <Space align="end">
                <Button
                    type="text"
                    size="large"
                    shape="circle"
                    onClick={() => prevDate()}
                >
                    <LeftOutlined />
                </Button>

                <DaysList />

                <Button
                    type="text"
                    size="large"
                    shape="circle"
                    onClick={() => nextDate()}
                >
                    <RightOutlined />
                </Button>
            </Space>

            <Space
                align="center"
                style={{ marginTop: 16 }}
            >
                <Button
                    type="text"
                    size="large"
                    shape="circle"
                    onClick={() => prevHour()}
                >
                    <LeftOutlined />
                </Button>

                <HoursList />

                <Button
                    type="text"
                    size="large"
                    shape="circle"
                    onClick={() => nextHour()}
                >
                    <RightOutlined />
                </Button>
            </Space>
        </Space>
    );
};

export default DateTimePicker;