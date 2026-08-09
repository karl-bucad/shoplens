function MarketBrief({ brief }) {
    if (
        !brief ||
        !brief.summary ||
        !Array.isArray(brief.insights) ||
        brief.insights.length === 0
    ) {
        return null
    }

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
                        {brief.summary}
                    </p>
                </div>

                <div className="market-brief-insights">
                    <div className="market-brief-insights-header">
                        <span className="market-brief-label">
                            Key Insights
                        </span>
                    </div>

                    <div className="market-brief-insight-list">
                        {brief.insights.map((insight) => (
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
                        {brief.opportunity}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default MarketBrief