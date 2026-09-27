export const useCompanyTransferApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  const getEmploymentDetails = async () =>
    fetchWithAuth<any>(`${apiBase}/member-company-transfer/employment-details`)

  const saveCompanyTransfer = async (transferData: any) =>
    fetchWithAuth<any>(`${apiBase}/member-company-transfer/employment-details`, {
      method: 'POST',
      body: transferData
    })

  return {
    getEmploymentDetails,
    saveCompanyTransfer
  }
}
