function CsvPreviewCard({
    file,
    rows,
    issues,
}) {
    if (!file) {
        return null
    }

    const errorCount = issues.filter(
        (issue) => issue.type === 'error',
    ).length

    const warningCount = issues.filter(
        (issue) => issue.type === 'warning',
    ).length

    const previewRows = rows.slice(0, 5)

    const columns =
        previewRows.length > 0
            ? Object.keys(previewRows[0])
            : []

    const isReady =
        rows.length > 0 &&
        errorCount === 0

    return (
        <section className="csv-preview-card">
            <div className="csv-preview-heading">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Step 2
                    </p>

                    <h2>Review Snapshot</h2>

                    <p>
                        Confirm the file contents and validation results
                        before creating a new market snapshot.
                    </p>
                </div>

                <span
                    className={`csv-readiness-badge ${isReady
                            ? 'csv-ready'
                            : 'csv-not-ready'
                        }`}
                >
                    {isReady
                        ? 'Ready to import'
                        : 'Needs attention'}
                </span>
            </div>

            <div className="csv-preview-summary">
                <div>
                    <span>File</span>
                    <strong>{file.name}</strong>
                </div>

                <div>
                    <span>Products</span>
                    <strong>{rows.length}</strong>
                </div>

                <div>
                    <span>Errors</span>
                    <strong>{errorCount}</strong>
                </div>

                <div>
                    <span>Warnings</span>
                    <strong>{warningCount}</strong>
                </div>
            </div>

            {issues.length > 0 && (
                <div className="csv-issues">
                    {issues.map((issue, index) => (
                        <div
                            className={`csv-issue csv-issue-${issue.type}`}
                            key={`${issue.type}-${issue.message}-${index}`}
                        >
                            <strong>
                                {issue.type === 'error'
                                    ? 'Error'
                                    : 'Warning'}
                            </strong>

                            <span>{issue.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {issues.length === 0 && (
                <div className="csv-validation-success">
                    <strong>Validation passed</strong>

                    <span>
                        This file is ready to become the next
                        ShopLens market snapshot.
                    </span>
                </div>
            )}

            {previewRows.length > 0 && (
                <>
                    <div className="csv-preview-table-header">
                        <div>
                            <span className="trend-label">
                                Data Preview
                            </span>

                            <h3>Products</h3>
                        </div>

                        <span>
                            First {Math.min(5, rows.length)} rows
                        </span>
                    </div>

                    <div className="csv-preview-table-wrapper">
                        <table className="csv-preview-table">
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column}>
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {previewRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((column) => (
                                            <td key={column}>
                                                {row[column] || '—'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {rows.length > 5 && (
                <p className="csv-preview-note">
                    Showing the first 5 of {rows.length} products.
                </p>
            )}
        </section>
    )
}

export default CsvPreviewCard