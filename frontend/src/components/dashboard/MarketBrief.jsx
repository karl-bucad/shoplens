function MarketBrief({ insights }) {
    if (insights.length === 0) {
        return null
    }

    return (
        <section className="market-section">
            <div className="section-header">
                <p className="page-eyebrow">Intelligence</p>

                <h2>Today's Market Brief</h2>

                <p>
                    A concise interpretation of your latest market snapshot.
                </p>
            </div>

            <div className="market-brief">
                <div className="market-brief-accent" />

                <div className="market-brief-content">
                    {insights.map((insight) => (
                        <div
                            className="market-brief-item"
                            key={insight.title}
                        >
                            <span>{insight.title}</span>

                            <p>{insight.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MarketBrief