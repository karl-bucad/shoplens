function ShopLensScorePanel({
    score,
    factors,
    recommendation,
    confidence,
}) {
    return (
        <section className="score-panel">
            <div className="score-panel-header">
                <div>
                    <p className="page-eyebrow">Intelligence</p>
                    <h3>ShopLens Score</h3>
                </div>

                <div className="score-number">
                    {score}
                    <span>/100</span>
                </div>
            </div>

            <div className="score-track">
                <div
                    className="score-progress"
                    style={{ width: `${score}%` }}
                />
            </div>

            <div className="score-meta">
                <div>
                    <span>Recommendation</span>
                    <strong>{recommendation}</strong>
                </div>

                <div>
                    <span>Confidence</span>
                    <strong>{confidence}</strong>
                </div>
            </div>

            <div className="score-factors">
                <div className="score-factors-header">
                    <div>
                        <p className="score-signals-title">
                            Why this score?
                        </p>

                        <span>
                            Transparent factors from your current market snapshot.
                        </span>
                    </div>
                </div>

                <div className="score-factor-list">
                    {factors.map((factor) => (
                        <div
                            className="score-factor"
                            key={factor.title}
                        >
                            <div className="score-factor-points">
                                +{factor.points}
                            </div>

                            <div className="score-factor-content">
                                <strong>{factor.title}</strong>
                                <p>{factor.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="score-total">
                <span>Base score</span>
                <strong>40</strong>

                <span>Signal points</span>
                <strong>
                    +
                    {factors.reduce(
                        (total, factor) => total + factor.points,
                        0,
                    )}
                </strong>

                <span>Final score</span>
                <strong>{score}/100</strong>
            </div>

            <p className="score-disclaimer">
                ShopLens Score reflects patterns in your imported dataset.
                It does not represent verified TikTok sales performance,
                demand, revenue, or profitability.
            </p>
        </section>
    )
}

export default ShopLensScorePanel