export const useLoanApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  // ── Public endpoints (no auth required) ──────────────────────────────────────
  const getLoanProducts = async (opts = {}) => {
    const res = await $fetch<any>(`${apiBase}/loan-application/products`, opts)
    return Array.isArray(res) ? res : (res?.data ?? res ?? [])
  }

  const getLoanProductDetails = async (productCode: string, opts = {}) => {
    return await $fetch<any>(`${apiBase}/loan-application/product-details`, {
      ...opts,
      query: { productCode }
    })
  }

  const checkProcessingApplication = async (productCode: string, opts = {}) => {
    return await fetchWithAuth(`${apiBase}/loan-application/check-processing`, {
      ...opts,
      query: { productCode }
    })
  }

  const getLoanDocuments = async (productCode: string, opts = {}) => {
    const res = await fetchWithAuth(`${apiBase}/loan-application/documents`, {
      ...opts,
      query: { productCode }
    })
    const list = res?.requiredDocuments ?? res ?? []
    return list.map((d: any) => ({
      code: d.documentCode ?? d.code,
      name: d.documentName ?? d.name,
      description: d.documentName ?? d.description ?? d.name
    }))
  }

  // ── Secured endpoints (Bearer token required) ─────────────────────────────────

  const getLoanOffsets = async (productCode: string) => {
    const res = await fetchWithAuth(`${apiBase}/loan-application/offsets`, {
      query: { productCode }
    })
    return Array.isArray(res) ? res : (res?.data ?? [])
  }

  const getPreTerminationLoans = async (productCode: string) => {
    const res = await fetchWithAuth(`${apiBase}/loan-application/pre-termination`, {
      query: { productCode }
    })
    return Array.isArray(res) ? res : (res?.data ?? [])
  }

  const computeMonthlyNetPay = async (payload: {
    monthlyNetPay: number
    amortizationOfThisLoan: number
    amortizationsOfLoanOffset: number
  }) => {
    const res = await fetchWithAuth(`${apiBase}/loan-application/monthly-net-pay/compute`, {
      method: 'POST',
      body: payload
    })
    return res?.data ?? res
  }

  const computeLoan = async (payload: {
    productCode: string
    loanAmount: number
    termPeriod: number
    monthlyNetPay?: number
    offsets?: any[]
  }) => {
    const res = await fetchWithAuth(`${apiBase}/loan-application/compute`, {
      method: 'POST',
      body: { ...payload, saveLoan: false }
    })
    return res?.loanDetails ?? res
  }

  const createLoan = async (payload: {
    productCode: string
    loanAmount: number
    termPeriod: number
    monthlyNetPay?: number
    offsets?: any[]
  }) => {
    return await fetchWithAuth(`${apiBase}/loan-application/create`, {
      method: 'POST',
      body: { ...payload, saveLoan: true }
    })
  }

  const uploadLoanDocument = async (docData: {
    accountNumber: string
    documentCode: string
    documentName: string
    base64: string
    fileName: string
  }) => {
    return await fetchWithAuth(`${apiBase}/loan-application/upload-documents`, {
      method: 'POST',
      body: docData
    })
  }

  return {
    getLoanProducts,
    getLoanProductDetails,
    checkProcessingApplication,
    getLoanDocuments,
    getLoanOffsets,
    getPreTerminationLoans,
    computeMonthlyNetPay,
    computeLoan,
    createLoan,
    uploadLoanDocument
  }
}
