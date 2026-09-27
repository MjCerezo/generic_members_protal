export const useEmploymentApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  const getEmploymentStatusOptions = async () =>
    fetchWithAuth<any[]>(`${apiBase}/system-parameters/code-name?codeName=EMPLOYMENTSTATUS`)

  const getEmploymentStatus = async () =>
    fetchWithAuth<any>(`${apiBase}/employment-update/status`)

  const submitEmploymentStatus = async (employmentStatusCode: string) =>
    fetchWithAuth<any>(`${apiBase}/employment-update/status`, {
      method: 'POST',
      body: { employmentStatusCode }
    })

  return {
    getEmploymentStatusOptions,
    getEmploymentStatus,
    submitEmploymentStatus
  }
}
