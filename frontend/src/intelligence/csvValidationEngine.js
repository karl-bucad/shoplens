export function validateCsvRows(rows) {
    const issues = []

    if (rows.length === 0) {
        issues.push({
            type: 'error',
            message: 'The CSV file contains no rows.',
        })
    }

    const requiredColumns = [
        'name',
        'shop_name',
        'category',
    ]

    const firstRow = rows[0] ?? {}

    requiredColumns.forEach((column) => {
        if (!(column in firstRow)) {
            issues.push({
                type: 'error',
                message: `Missing required column: ${column}`,
            })
        }
    })

    const duplicateNames = new Set()
    const seenNames = new Set()

    rows.forEach((row) => {
        const name = row.name?.trim()

        if (!name) {
            return
        }

        if (seenNames.has(name)) {
            duplicateNames.add(name)
        }

        seenNames.add(name)
    })

    duplicateNames.forEach((name) => {
        issues.push({
            type: 'warning',
            message: `Duplicate product: ${name}`,
        })
    })

    return issues
}