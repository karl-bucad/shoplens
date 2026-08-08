function InsightCard({
    title,
    description,
    status = 'neutral',
}) {
    return (
        <div className={`insight-card ${status}`}>
            <div className="insight-card-header">
                <h3>{title}</h3>
            </div>

            <p>{description}</p>
        </div>
    )
}

export default InsightCard