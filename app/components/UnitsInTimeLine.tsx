'use client'

import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react'
import { componentsTheme } from './ComponentsTheme'

interface UnitsInTimeLineProps {
    data: any[];
}

export default function UnitsInTimeLine({ data }: UnitsInTimeLineProps) {
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
        <ResponsiveLine
            data={data}
            theme={componentsTheme(isDark)}
            margin={{ top: 20, right: 20, bottom: 80, left: 70 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendOffset: 70,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Unit Tokens',
                legendOffset: -60,
                legendPosition: 'middle',
                // format: (value: number) => `${(value / 1000).toFixed(0)}K`
            }}
            enableGridX={true}
            enableGridY={false}
            colors={{ scheme: 'category10' }}
            lineWidth={3}
            pointSize={8}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableArea={true}
            areaOpacity={0.1}
            useMesh={true}
            animate={true}
            motionConfig="gentle"
        />
    )
}
