export const useShareApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  const getCapitalPledge = async () => {
    return await fetchWithAuth<any>(`${apiBase}/capital-share-pledge-update/capital-pledge`)
  }

  const updateCapitalPledge = async (payload: {
    capitalPledge: number
    effectiveDate: string
  }) => {
    return await fetchWithAuth<any>(`${apiBase}/capital-share-pledge-update/capital-pledge`, {
      method: 'POST',
      body: payload
    })
  }

  const approveCapitalPledge = async (trn: string) => {
    return await fetchWithAuth<any>(`${apiBase}/capital-share-pledge-update/capital-pledge-approve`, {
      method: 'POST',
      body: { trn }
    })
  }

  const getEffectivityDate = async () => {
    return await fetchWithAuth<any>(`${apiBase}/capital-share-pledge-update/effectivity-date`)
  }

  return {
    getCapitalPledge,
    updateCapitalPledge,
    approveCapitalPledge,
    getEffectivityDate
  }
}
