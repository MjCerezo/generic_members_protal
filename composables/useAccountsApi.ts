export const useAccountsApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  const getStatus = async (page: number = 1, limit: number = 10) =>
    fetchWithAuth<any>(`${apiBase}/accounts/status?page=${page}&limit=${limit}`)

  return {
    getStatus
  }
}
