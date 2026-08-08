import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import CsvPreviewCard from '../components/imports/CsvPreviewCard'

import {
    getImportJobs,
    uploadProductCsv,
} from '../api/imports'

import useImportWizard from '../hooks/useImportWizard'

function formatDate(dateString) {
    if (!dateString) {
        return '—'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(dateString))
}

function getStatusLabel(status) {
    if (status === 'completed') {
        return 'Completed'
    }

    if (status === 'failed') {
        return 'Failed'
    }

    return 'Pending'
}

function ImportsPage() {
    const [importJobs, setImportJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

    const {
        selectedFile,
        rows,
        issues,
        handleFileChange,
        clearSelection,
    } = useImportWizard()

    const validationErrors = issues.filter(
        (issue) => issue.type === 'error',
    )

    const canImport =
        selectedFile !== null &&
        rows.length > 0 &&
        validationErrors.length === 0

    useEffect(() => {
        async function loadImportJobs() {
            try {
                const data = await getImportJobs()
                setImportJobs(data)
            } catch {
                setError('Unable to load import history.')
            } finally {
                setIsLoading(false)
            }
        }

        loadImportJobs()
    }, [])

    async function handleUpload(event) {
        event.preventDefault()

        if (!selectedFile) {
            toast.error('No file selected', {
                description: 'Choose a CSV file before importing.',
            })
            return
        }

        if (validationErrors.length > 0) {
            toast.error('CSV validation failed', {
                description:
                    'Fix the validation errors before importing this file.',
            })
            return
        }

        if (rows.length === 0) {
            toast.error('CSV is empty', {
                description:
                    'Choose a CSV file containing at least one product row.',
            })
            return
        }

        setIsUploading(true)

        try {
            const newImport = await uploadProductCsv(selectedFile)

            setImportJobs((currentJobs) => [
                {
                    id: newImport.import_job_id,
                    filename: newImport.filename,
                    status: newImport.status,
                    total_rows: newImport.total_rows,
                    successful_rows: newImport.successful_rows,
                    failed_rows: newImport.failed_rows,
                    created_at: new Date().toISOString(),
                    completed_at:
                        newImport.status === 'completed'
                            ? new Date().toISOString()
                            : null,
                },
                ...currentJobs,
            ])

            clearSelection()
            event.target.reset()

            toast.success('CSV imported', {
                description: `${newImport.successful_rows} products were imported successfully.`,
            })
        } catch (requestError) {
            const message =
                requestError.response?.data?.detail ??
                'Unable to upload CSV file.'

            toast.error('Import failed', {
                description: message,
            })
        } finally {
            setIsUploading(false)
        }
    }

    if (isLoading) {
        return <p>Loading import history...</p>
    }

    if (error) {
        return (
            <div className="error-state">
                <h2>Unable to load imports</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <p className="page-eyebrow">
                        Market Snapshots
                    </p>

                    <h1>Imports</h1>

                    <p>
                        Review and validate CSV market data before importing it
                        into ShopLens.
                    </p>
                </div>
            </div>

            <section className="upload-card">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Step 1
                    </p>

                    <h2>Choose Product CSV</h2>

                    <p>
                        Select a CSV containing product name, shop, and category
                        data.
                    </p>
                </div>

                <form
                    className="upload-form"
                    onSubmit={handleUpload}
                >
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                    />

                    <button
                        type="submit"
                        disabled={!canImport || isUploading}
                    >
                        {isUploading
                            ? 'Importing...'
                            : selectedFile
                                ? 'Import Reviewed CSV'
                                : 'Choose CSV First'}
                    </button>
                </form>

                {selectedFile && (
                    <p className="selected-file">
                        Selected: {selectedFile.name}
                    </p>
                )}
            </section>

            <CsvPreviewCard
                file={selectedFile}
                rows={rows}
                issues={issues}
            />

            <section className="analytics-section">
                <div className="section-header">
                    <p className="page-eyebrow">
                        History
                    </p>

                    <h2>Import History</h2>

                    <p>
                        Review previous market snapshot uploads and their
                        results.
                    </p>
                </div>

                <div className="table-card">
                    {importJobs.length === 0 ? (
                        <p className="empty-state">
                            No imports have been completed yet.
                        </p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Status</th>
                                        <th>Total Rows</th>
                                        <th>Successful</th>
                                        <th>Failed</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {importJobs.map((job) => (
                                        <tr key={job.id}>
                                            <td className="product-name">
                                                {job.filename}
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge status-${job.status}`}
                                                >
                                                    {getStatusLabel(job.status)}
                                                </span>
                                            </td>

                                            <td>{job.total_rows}</td>
                                            <td>{job.successful_rows}</td>
                                            <td>{job.failed_rows}</td>
                                            <td>{formatDate(job.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default ImportsPage