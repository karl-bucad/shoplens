function OpportunityBadge({ score }) {
    let label = 'Watch List'
    let className = 'opportunity-badge watch'

    if (score >= 90) {
        label = 'High Opportunity'
        className = 'opportunity-badge high'
    } else if (score >= 75) {
        label = 'Worth Investigating'
        className = 'opportunity-badge medium'
    }

    return (
        <span className={className}>
            {label}
        </span>
    )
}

export default OpportunityBadge