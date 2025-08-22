import * as XLSX from 'xlsx'

export interface ExcelData {
  sheets: SheetData[]
  metadata: {
    totalSheets: number
    totalRows: number
    totalColumns: number
    fileSize: number
  }
}

export interface SheetData {
  name: string
  data: any[][]
  headers: string[]
  rowCount: number
  columnCount: number
}

export function parseExcelBuffer(buffer: Buffer): ExcelData {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  
  const sheets: SheetData[] = []
  let totalRows = 0
  let totalColumns = 0
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    
    if (jsonData.length > 0) {
      const headers = jsonData[0].map((h: any) => String(h || ''))
      const data = jsonData.slice(1)
      
      sheets.push({
        name: sheetName,
        data,
        headers,
        rowCount: data.length,
        columnCount: headers.length,
      })
      
      totalRows += data.length
      totalColumns = Math.max(totalColumns, headers.length)
    }
  }
  
  return {
    sheets,
    metadata: {
      totalSheets: sheets.length,
      totalRows,
      totalColumns,
      fileSize: buffer.length,
    },
  }
}

export function transformData(data: any[][], rules: TransformRule[]): any[][] {
  return data.map(row => {
    const newRow = [...row]
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'uppercase':
          if (rule.column !== undefined && newRow[rule.column]) {
            newRow[rule.column] = String(newRow[rule.column]).toUpperCase()
          }
          break
        case 'lowercase':
          if (rule.column !== undefined && newRow[rule.column]) {
            newRow[rule.column] = String(newRow[rule.column]).toLowerCase()
          }
          break
        case 'trim':
          if (rule.column !== undefined && newRow[rule.column]) {
            newRow[rule.column] = String(newRow[rule.column]).trim()
          }
          break
        case 'replace':
          if (rule.column !== undefined && newRow[rule.column] && rule.find && rule.replace !== undefined) {
            newRow[rule.column] = String(newRow[rule.column]).replace(rule.find, rule.replace)
          }
          break
      }
    }
    
    return newRow
  })
}

export interface TransformRule {
  type: 'uppercase' | 'lowercase' | 'trim' | 'replace'
  column?: number
  find?: string
  replace?: string
}

export function validateData(data: any[][], schema: ValidationSchema): ValidationResult {
  const errors: ValidationError[] = []
  let validRows = 0
  
  data.forEach((row, rowIndex) => {
    let rowValid = true
    
    schema.columns.forEach((colSchema, colIndex) => {
      const value = row[colIndex]
      
      if (colSchema.required && (value === null || value === undefined || value === '')) {
        errors.push({
          row: rowIndex + 2,
          column: colIndex,
          message: `Column ${colIndex + 1} is required`,
        })
        rowValid = false
      }
      
      if (value && colSchema.type) {
        switch (colSchema.type) {
          case 'number':
            if (isNaN(Number(value))) {
              errors.push({
                row: rowIndex + 2,
                column: colIndex,
                message: `Column ${colIndex + 1} must be a number`,
              })
              rowValid = false
            }
            break
          case 'email':
            if (!isValidEmail(String(value))) {
              errors.push({
                row: rowIndex + 2,
                column: colIndex,
                message: `Column ${colIndex + 1} must be a valid email`,
              })
              rowValid = false
            }
            break
        }
      }
    })
    
    if (rowValid) validRows++
  })
  
  return {
    valid: errors.length === 0,
    errors,
    totalRows: data.length,
    validRows,
    invalidRows: data.length - validRows,
  }
}

export interface ValidationSchema {
  columns: ColumnSchema[]
}

export interface ColumnSchema {
  required?: boolean
  type?: 'string' | 'number' | 'email' | 'date'
  pattern?: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  totalRows: number
  validRows: number
  invalidRows: number
}

export interface ValidationError {
  row: number
  column: number
  message: string
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function extractData(data: any[][], patterns: ExtractPattern[]): ExtractResult[] {
  const results: ExtractResult[] = []
  
  for (const pattern of patterns) {
    const matches: any[] = []
    
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellValue = String(cell || '')
        
        if (pattern.type === 'regex' && pattern.regex) {
          const regex = new RegExp(pattern.regex, 'g')
          const cellMatches = cellValue.match(regex)
          
          if (cellMatches) {
            matches.push({
              row: rowIndex + 2,
              column: colIndex,
              value: cellValue,
              matches: cellMatches,
            })
          }
        } else if (pattern.type === 'contains' && pattern.text) {
          if (cellValue.toLowerCase().includes(pattern.text.toLowerCase())) {
            matches.push({
              row: rowIndex + 2,
              column: colIndex,
              value: cellValue,
            })
          }
        }
      })
    })
    
    results.push({
      pattern: pattern.name,
      matchCount: matches.length,
      matches: matches.slice(0, 10),
    })
  }
  
  return results
}

export interface ExtractPattern {
  name: string
  type: 'regex' | 'contains'
  regex?: string
  text?: string
}

export interface ExtractResult {
  pattern: string
  matchCount: number
  matches: any[]
}