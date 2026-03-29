"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react"

export default function DemoImportPage() {
  const [csvData, setCsvData] = useState("")
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCsvData(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const handleImport = async () => {
    if (!csvData.trim()) return
    
    setImporting(true)
    setResults(null)
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const lines = csvData.trim().split("\n")
    const dataLines = lines.slice(1) // Skip header
    
    // Simulate some successes and failures
    const success = Math.max(0, dataLines.length - 1)
    const failed = dataLines.length > 3 ? 1 : 0
    const errors = failed > 0 ? ["Row 4: Invalid email format (demo error)"] : []
    
    setResults({ success, failed, errors })
    setImporting(false)
  }

  const downloadTemplate = () => {
    const template = "email,first_name\njohn@example.com,John\njane@example.com,Jane\n"
    const blob = new Blob([template], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bloom-import-template.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Import Subscribers</h1>
        <p className="text-muted-foreground mt-1">Upload a CSV file to import subscribers in bulk</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Upload Card */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Upload CSV File</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your CSV should have columns: email, first_name
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">CSV files only</p>
            </div>

            <Button variant="outline" onClick={downloadTemplate} className="w-full border-border">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        {/* Paste CSV Card */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Or Paste CSV Data
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Paste your CSV data directly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder={`email,first_name
john@example.com,John
jane@example.com,Jane
bob@example.com,Bob`}
              className="min-h-[200px] font-mono text-sm border-border"
            />
            
            <Button
              onClick={handleImport}
              disabled={!csvData.trim() || importing}
              className="w-full bg-primary hover:bg-[#A34D20] text-primary-foreground"
            >
              {importing ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Subscribers
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                {results.failed === 0 ? (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-primary" />
                )}
                Import Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-secondary/10 text-center">
                  <p className="text-2xl font-semibold text-secondary">{results.success}</p>
                  <p className="text-sm text-muted-foreground">Imported</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 text-center">
                  <p className="text-2xl font-semibold text-destructive">{results.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
              
              {results.errors.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-foreground mb-2">Errors:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-4 text-center">
                This is demo mode - no actual subscribers were imported.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
