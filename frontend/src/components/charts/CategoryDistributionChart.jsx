import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

function CategoryDistributionChart({ products }) {
    const categoryCounts = products.reduce((counts, product) => {
        const category = product.category ?? 'Unknown'

        counts[category] = (counts[category] ?? 0) + 1

        return counts
    }, {})

    const data = Object.entries(categoryCounts)
        .map(([category, count]) => ({
            category,
            count,
        }))
        .sort((a, b) => b.count - a.count)

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <p className="page-eyebrow">Analytics</p>
                    <h2>Category Distribution</h2>
                </div>
            </div>

            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="category" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                        dataKey="count"
                        fill="#25F4EE"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CategoryDistributionChart