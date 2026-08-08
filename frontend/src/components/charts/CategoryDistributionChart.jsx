import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

function CategoryDistributionChart({ categories }) {
    const data = categories.map((category) => ({
        category: category.category,
        count: category.product_count,
    }))

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
                        fill="var(--color-primary)"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CategoryDistributionChart