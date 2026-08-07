import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
    getImportJobs,
    uploadProductCsv,
} from '../api/imports'

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
    const [selectedFile, setSelectedFile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

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

    function handleFileChange(event) {
        const file = event.target.files?.[0] ?? null
        setSelectedFile(file)
    }

    async function handleUpload(event) {
        event.preventDefault()

        if (!selectedFile) {
            toast.error('No file selected', {
                description: 'Choose a CSV file before uploading.',
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

            setSelectedFile(null)
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
        return <p>{error}</p>
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Imports</h1>
                    <p>Upload CSV files and review previous import jobs.</p>
                </div>
            </div>

            <section className="upload-card">
                <div className="section-header">
                    <h2>Upload Product CSV</h2>
                    <p>Select a CSV file containing product data.</p>
                </div>

                <form className="upload-form" onSubmit={handleUpload}>
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleFileChange}
                    />

                    <button
                        type="submit"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>

                {selectedFile && (
                    <p className="selected-file">
                        Selected: {selectedFile.name}
                    </p>
                )}
            </section>

            <section className="analytics-section">
                <div className="section-header">
                    <h2>Import History</h2>
                    <p>Review past uploads and their results.</p>
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