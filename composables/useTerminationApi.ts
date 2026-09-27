export const useTerminationApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  const submitTermination = async (payload: any) => {
    return await fetchWithAuth<any>(`${apiBase}/termination/submit`, {
      method: 'POST',
      body: payload
    })
  }

  const getTerminationDocuments = async () => {
    return await fetchWithAuth<any>(`${apiBase}/termination/documents`)
  }

  const uploadTerminationDocument = async (payload: {
    doccategory: string
    doctype: string
    name: string
    base64Content: string
    docfilename: string
  }) => {
    return await fetchWithAuth<any>(`${apiBase}/termination/upload-document`, {
      method: 'POST',
      body: payload
    })
  }

  return {
    submitTermination,
    getTerminationDocuments,
    uploadTerminationDocument
  }
}
