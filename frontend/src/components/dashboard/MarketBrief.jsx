function MarketBrief({ insights }) {
    if (insights.length === 0) {
        return null
    }

    const summary = insights
        .map((insight) => insight.text)
        .join(' ')

    const opportunityInsight =
        insights.find((insight) =>
            insight.title.toLowerCase().includes('competition')
        ) ?? insights[insights.length - 1]

    return (
        <section className="market-section">
            <div className="section-header">
                <p className="page-eyebrow">
                    Intelligence
                </p>

                <h2>Today's Market Brief</h2>

                <p>
                    A concise interpretation of your latest market snapshot.
                </p>
            </div>

            <div className="market-brief market-brief-v2">
                <div className="market-brief-accent" />

                <div className="market-brief-summary">
                    <span className="market-brief-label">
                        Executive Summary
                    </span>

                    <p>
                        {summary}
                    </p>
                </div>

                <div className="market-brief-insights">
                    <div className="market-brief-insights-header">
                        <span className="market-brief-label">
                            Key Insights
                        </span>
                    </div>

                    <div className="market-brief-insight-list">
                        {insights.map((insight) => (
                            <div
                                className="market-brief-insight"
                                key={insight.title}
                            >
                                <div className="market-brief-insight-marker" />

                                <div>
                                    <strong>
                                        {insight.title}
                                    </strong>

                                    <p>
                                        {insight.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="market-brief-opportunity">
                    <span className="market-brief-label">
                        Opportunity
                    </span>

                    <p>
                        {opportunityInsight.text}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default MarketBrief