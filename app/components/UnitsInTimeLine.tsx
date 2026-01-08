'use client'

import { ResponsiveLine } from '@nivo/line'
import { useEffect, useState } from 'react'

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

    const theme = {
        background: 'transparent',
        text: {
            fontSize: 11,
            fill: isDark ? '#a1a1aa' : '#52525b',
            outlineWidth: 0,
            outlineColor: 'transparent'
        },
        axis: {
            domain: {
                line: {
                    stroke: isDark ? '#27272a' : '#e4e4e7',
                    strokeWidth: 1
                }
            },
            legend: {
                text: {
                    fontSize: 12,
                    fill: isDark ? '#a1a1aa' : '#52525b',
                    fontWeight: 600
                }
            },
            ticks: {
                line: {
                    stroke: isDark ? '#27272a' : '#e4e4e7',
                    strokeWidth: 1
                },
                text: {
                    fontSize: 11,
                    fill: isDark ? '#a1a1aa' : '#71717a'
                }
            }
        },
        grid: {
            line: {
                stroke: isDark ? '#27272a' : '#f4f4f5',
                strokeWidth: 1
            }
        },
        tooltip: {
            container: {
                background: isDark ? '#18181b' : '#ffffff',
                color: isDark ? '#fafafa' : '#09090b',
                fontSize: 12,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`
            }
        }
    };

    return (
        <ResponsiveLine
            data={data}
            theme={theme}
            margin={{ top: 20, right: 20, bottom: 80, left: 70 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
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
                legendOffset: 60,
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
