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
            const newImport = await uploadProductCsv(
                selectedFile,
            )

            setImportJobs((currentJobs) => [
                {
                    id: newImport.import_job_id,
                    filename: newImport.filename,
                    status: newImport.status,
                    total_rows: newImport.total_rows,
                    successful_rows:
                        newImport.successful_rows,
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

            toast.success('Market snapshot created', {
                description: `${newImport.successful_rows} products were imported into the new snapshot.`,
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
                        Upload, validate, and create structured
                        market snapshots for ShopLens analytics.
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
                        Select your own CSV or download the ShopLens sample
                        dataset to try the full market research workflow.
                    </p>
                </div>

                <div className="import-source-actions">
                    <div className="upload-form">
                        <input
                            type="file"
                            accept=".csv,text/csv"
                            onChange={handleFileChange}
                        />
                    </div>

                    <a
                        className="sample-csv-button"
                        href="/samples/shoplens_sample.csv"
                        download
                    >
                        Download Sample CSV
                    </a>
                </div>

                {selectedFile ? (
                    <div className="selected-file">
                        <strong>Selected file</strong>
                        <span>{selectedFile.name}</span>
                    </div>
                ) : (
                    <p className="upload-helper">
                        New to ShopLens? Download the sample CSV, then upload it here
                        to generate your first market snapshot.
                    </p>
                )}
            </section>

            <CsvPreviewCard
                file={selectedFile}
                rows={rows}
                issues={issues}
            />

            {selectedFile && (
                <section className="snapshot-action-card">
                    <div>
                        <p className="page-eyebrow">
                            Step 3
                        </p>

                        <h2>Create Market Snapshot</h2>

                        <p>
                            Import the reviewed CSV as the newest
                            ShopLens snapshot. Dashboard analytics
                            will use this snapshot as the current
                            market.
                        </p>
                    </div>

                    <form onSubmit={handleUpload}>
                        <button
                            className="snapshot-import-button"
                            type="submit"
                            disabled={
                                !canImport || isUploading
                            }
                        >
                            {isUploading
                                ? 'Creating snapshot...'
                                : canImport
                                    ? 'Create Market Snapshot'
                                    : 'Resolve Validation Issues'}
                        </button>
                    </form>
                </section>
            )}

            <section className="analytics-section import-history-section">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Snapshot History
                    </p>

                    <h2>Previous Imports</h2>

                    <p>
                        Review previous market snapshots and
                        their import results.
                    </p>
                </div>

                <div className="table-card">
                    {importJobs.length === 0 ? (
                        <p className="empty-state">
                            No market snapshots have been created yet.
                        </p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Status</th>
                                        <th>Products</th>
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
                                                    {getStatusLabel(
                                                        job.status,
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {job.total_rows}
                                            </td>

                                            <td>
                                                {job.successful_rows}
                                            </td>

                                            <td>
                                                {job.failed_rows}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    job.created_at,
                                                )}
                                            </td>
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