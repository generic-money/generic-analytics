
export const componentsTheme = (isDark: boolean) => ({
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
});
