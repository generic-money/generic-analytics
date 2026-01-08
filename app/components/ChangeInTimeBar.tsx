'use client'

import { ResponsiveBar } from '@nivo/bar'
import { useEffect, useState } from 'react'

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

    const maxValue = Math.max(
        ...data.flatMap((item: any) =>
            keys.map((key: string) => Math.abs(item[key] || 0))
        )
    );

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
        legends: {
            title: {
                text: {
                    fontSize: 11,
                    fill: isDark ? '#a1a1aa' : '#52525b'
                }
            },
            text: {
                fontSize: 11,
                fill: isDark ? '#a1a1aa' : '#52525b',
                fontWeight: 500
            },
            ticks: {
                line: {},
                text: {
                    fontSize: 10,
                    fill: isDark ? '#a1a1aa' : '#52525b'
                }
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
        <ResponsiveBar
            data={data}
            indexBy={indexBy}
            keys={keys}
            padding={0.3}
            groupMode="grouped"
            enableLabel={false}
            enableTotals={false}
            valueScale={{ type: 'linear',  min: -maxValue, max: maxValue }}
            theme={theme}
            enableGridX={true}
            enableGridY={false}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    translateX: 120,
                    itemsSpacing: 8,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemTextColor: isDark ? '#a1a1aa' : '#52525b',
                    symbolSize: 12,
                }
            ]}
            colors={colors}
            axisBottom={{
                legend: 'Date',
                legendOffset: 40,
                legendPosition: 'middle',
                tickRotation: -45
            }}
            axisLeft={{
                legend: 'Deposits',
                legendOffset: -50,
                legendPosition: 'middle',
                // format: (value) => `${(value / 1000).toFixed(0)}K`
            }}
            margin={{ top: 20, right: 70, bottom: 70, left: 70 }}
            borderRadius={4}
            animate={true}
            motionConfig="gentle"
        />
    )
}
