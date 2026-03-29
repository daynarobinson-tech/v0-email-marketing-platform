"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react"

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export default function ImportSubscribersPage() {
  const [csvText, setCsvText] = useState("")
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const supabase = createClient()

  const parseCSV = (text: string) => {
    const lines = text.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].toLowerCase().split(",").map((h) => h.trim())
    const emailIndex = headers.findIndex((h) => h.includes("email"))
    const nameIndex = headers.findIndex((h) => h.includes("name") || h.includes("first"))

    if (emailIndex === -1) return []

    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
      return {
        email: values[emailIndex] || "",
        first_name: nameIndex !== -1 ? values[nameIndex] : "",
      }
    }).filter((row) => row.email && row.email.includes("@"))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    setImporting(true)
    setResult(null)

    const subscribers = parseCSV(csvText)
    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const subscriber of subscribers) {
      const { error } = await supabase.from("subscribers").insert({
        email: subscriber.email,
        first_name: subscriber.first_name || "Subscriber",
        consent: true,
        token_balance: 10,
      })

      if (error) {
        failed++
        if (error.code === "23505") {
          errors.push(`${subscriber.email}: Already exists`)
        } else {
          errors.push(`${subscriber.email}: ${error.message}`)
        }
      } else {
        success++
        // Add welcome event
        const { data: newSubscriber } = await supabase
          .from("subscribers")
          .select("id")
          .eq("email", subscriber.email)
          .single()

        if (newSubscriber) {
          await supabase.from("events").insert({
            subscriber_id: newSubscriber.id,
            event_type: "joined",
            points_earned: 10,
          })
        }
      }
    }

    setResult({ success, failed, errors: errors.slice(0, 10) })
    setImporting(false)
    setCsvText("")
  }

  const downloadTemplate = () => {
    const template = "email,first_name\njohn@example.com,John\njane@example.com,Jane"
    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "subscriber_template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C1C1A]">Import Subscribers</h1>
        <p className="text-[#6B6B67] mt-1">Upload a CSV file to bulk import subscribers</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border border-[#E8E6E0] bg-white">
            <CardHeader>
              <CardTitle className="text-[#1C1C1A]">Upload CSV</CardTitle>
              <CardDescription className="text-[#6B6B67]">
                Your CSV should have columns for email and first_name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-[#E8E6E0] rounded-lg p-8 text-center hover:border-[#C45C26] transition-colors">
                <Upload className="w-10 h-10 text-[#6B6B67] mx-auto mb-4" />
                <Label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-[#C45C26] font-medium hover:text-[#A34D20]">
                    Click to upload
                  </span>
                  <span className="text-[#6B6B67]"> or drag and drop</span>
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-[#6B6B67] mt-2">CSV files only</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#E8E6E0]" />
                <span className="text-xs text-[#6B6B67]">OR</span>
                <div className="flex-1 h-px bg-[#E8E6E0]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="csv-text" className="text-[#1C1C1A]">Paste CSV Data</Label>
                <Textarea
                  id="csv-text"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={`email,first_name
john@example.com,John
jane@example.com,Jane`}
                  className="min-h-[150px] font-mono text-sm border-[#E8E6E0] focus:ring-[#C45C26]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleImport}
                  disabled={!csvText || importing}
                  className="flex-1 bg-[#C45C26] hover:bg-[#A34D20] text-white"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import Subscribers
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="border-[#E8E6E0] text-[#1C1C1A]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card className="border border-[#E8E6E0] bg-white">
              <CardHeader>
                <CardTitle className="text-[#1C1C1A] flex items-center gap-2">
                  {result.failed === 0 ? (
                    <CheckCircle className="w-5 h-5 text-[#4A7C59]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#C45C26]" />
                  )}
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="text-2xl font-semibold text-[#4A7C59]">{result.success}</div>
                    <div className="text-sm text-[#6B6B67]">Imported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#C45C26]">{result.failed}</div>
                    <div className="text-sm text-[#6B6B67]">Failed</div>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="bg-[#FAFAF8] rounded-lg p-3">
                    <p className="text-xs font-medium text-[#1C1C1A] mb-2">Errors:</p>
                    <ul className="text-xs text-[#6B6B67] space-y-1">
                      {result.errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="border border-[#E8E6E0] bg-white h-fit">
          <CardHeader>
            <CardTitle className="text-[#1C1C1A] flex items-center gap-2">
              <FileText className="w-5 h-5" />
              CSV Format Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-[#6B6B67] mb-3">
                Your CSV file should include at minimum an email column. The first_name column is optional but recommended.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#1C1C1A] mb-2">Required columns:</h4>
              <ul className="text-sm text-[#6B6B67] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C45C26] rounded-full" />
                  email - Subscriber email address
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#1C1C1A] mb-2">Optional columns:</h4>
              <ul className="text-sm text-[#6B6B67] space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#4A7C59] rounded-full" />
                  first_name - Subscriber first name
                </li>
              </ul>
            </div>

            <div className="bg-[#FAFAF8] rounded-lg p-4">
              <h4 className="text-sm font-medium text-[#1C1C1A] mb-2">Example:</h4>
              <pre className="text-xs text-[#6B6B67] font-mono">
{`email,first_name
john@example.com,John
jane@example.com,Jane
alex@company.com,Alex`}
              </pre>
            </div>

            <div className="bg-[#4A7C59]/10 rounded-lg p-4">
              <p className="text-sm text-[#4A7C59]">
                Imported subscribers automatically receive 10 welcome tokens and are marked as having given consent.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
