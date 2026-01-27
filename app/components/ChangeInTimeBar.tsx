'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { componentsTheme } from './ComponentsTheme'

interface ChangeInTimeBarProps {
    data: any[];
    indexBy: string;
    keys: string[];
    colors: string[];
}

export default function ChangeInTimeBar({ data, indexBy, keys, colors }: ChangeInTimeBarProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check for dark mode
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDark(darkModeMediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <ResponsiveBar
            data={data}
            indexBy={indexBy}
            keys={keys}
            padding={0.3}
            groupMode="grouped"
            enableLabel={false}
            enableTotals={true}
            valueScale={{ type: 'linear',  min: 'auto', max: 'auto' }}
            theme={componentsTheme(isDark)}
            enableGridX={true}
            enableGridY={false}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 20,
                    symbolSize: 11,
                }
            ]}
            colors={colors}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendOffset: 70,
                legendPosition: 'middle',
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Deposits',
                legendOffset: -60,
                legendPosition: 'middle',
                format: (value) => `${(value / 1000).toFixed(0)}K`
            }}
            margin={{ top: 20, right: 70, bottom: 80, left: 70 }}
            borderRadius={4}
            animate={true}
            motionConfig="gentle"
        />
    )
}
