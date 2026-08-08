import { useState } from 'react'
import Papa from 'papaparse'

import { validateCsvRows } from '../intelligence/csvValidationEngine'

export default function useImportWizard() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [rows, setRows] = useState([])
    const [issues, setIssues] = useState([])

    async function handleFileChange(event) {
        const file = event.target.files?.[0] ?? null

        setSelectedFile(file)

        if (!file) {
            setRows([])
            setIssues([])
            return
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete(results) {
                setRows(results.data)

                setIssues(
                    validateCsvRows(results.data),
                )
            },
        })
    }

    function clearSelection() {
        setSelectedFile(null)
        setRows([])
        setIssues([])
    }

    return {
        selectedFile,
        rows,
        issues,
        handleFileChange,
        clearSelection,
    }
}