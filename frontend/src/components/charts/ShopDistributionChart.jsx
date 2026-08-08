import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

function ShopDistributionChart({ shops }) {
    const data = shops
        .slice(0, 8)
        .map((shop) => ({
            shop: shop.shop_name,
            count: shop.product_count,
        }))

    return (
        <div className="chart-card">
            <div className="chart-header">
                <div>
                    <p className="page-eyebrow">Competition</p>
                    <h2>Top Shops</h2>
                    <p>
                        Compare the shops with the largest presence in your
                        current market snapshot.
                    </p>
                </div>
            </div>

            <ResponsiveContainer
                width="100%"
                height={340}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 8,
                        right: 24,
                        bottom: 8,
                        left: 20,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="shop"
                        width={110}
                    />

                    <Tooltip />

                    <Bar
                        dataKey="count"
                        fill="var(--color-secondary)"
                        radius={[0, 8, 8, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ShopDistributionChart