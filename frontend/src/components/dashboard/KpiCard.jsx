function KpiCard({
    label,
    value,
    subtitle,
    icon,
}) {
    return (
        <div className="kpi-card">
            <div className="kpi-icon">
                {icon}
            </div>

            <div className="kpi-content">
                <span className="kpi-label">
                    {label}
                </span>

                <strong className="kpi-value">
                    {value}
                </strong>

                {subtitle && (
                    <small className="kpi-subtitle">
                        {subtitle}
                    </small>
                )}
            </div>
        </div>
    )
}

export default KpiCard