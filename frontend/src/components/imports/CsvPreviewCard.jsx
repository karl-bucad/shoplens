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

    return (
        <section className="csv-preview-card">
            <div className="section-header">
                <p className="page-eyebrow">Review</p>

                <h2>CSV Preview</h2>

                <p>
                    Review the selected file before importing it into
                    ShopLens.
                </p>
            </div>

            <div className="csv-preview-summary">
                <div>
                    <span>File</span>
                    <strong>{file.name}</strong>
                </div>

                <div>
                    <span>Rows</span>
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

            {previewRows.length > 0 && (
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
            )}

            {rows.length > 5 && (
                <p className="csv-preview-note">
                    Showing the first 5 of {rows.length} rows.
                </p>
            )}
        </section>
    )
}

export default CsvPreviewCard