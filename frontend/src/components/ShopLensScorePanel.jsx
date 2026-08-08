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
                            Each factor contributes to a fixed 100-point model.
                        </span>
                    </div>
                </div>

                <div className="score-factor-list">
                    {factors.map((factor) => {
                        const percentage =
                            (factor.points / factor.maxPoints) * 100

                        return (
                            <div
                                className="score-factor"
                                key={factor.title}
                            >
                                <div className="score-factor-points">
                                    {factor.points}/{factor.maxPoints}
                                </div>

                                <div className="score-factor-content">
                                    <div className="score-factor-heading">
                                        <strong>{factor.title}</strong>

                                        <span>
                                            {Math.round(percentage)}%
                                        </span>
                                    </div>

                                    <div className="factor-track">
                                        <div
                                            className="factor-progress"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>

                                    <p>{factor.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="score-total">
                <span>Total</span>
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