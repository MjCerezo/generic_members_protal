export const useProfileUpdateApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { fetchWithAuth } = useAuthRefresh()

  // ── GET current values ──────────────────────────────────────────────────────
  const getPresentAddress = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/present-address`)

  const getPermanentAddress = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/permanent-address`)

  const getOfficeAddress = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/office-address`)

  const getCivilStatus = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/civil-status`)

  const getEmailAddress = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/email-address`)

  const getMobileNumber = async () =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/mobile-number`)

  // ── POST updates ────────────────────────────────────────────────────────────
  const updatePresentAddress = async (payload: {
    roomNo?: string; houseNo?: string; streetNo?: string; subDivision?: string
    barangay?: string; city?: string; province?: string; country?: string; postalCode?: string
  }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/present-address`, {
      method: 'POST', body: payload
    })

  const updatePermanentAddress = async (payload: {
    roomNo?: string; houseNo?: string; streetNo?: string; subDivision?: string
    barangay?: string; city?: string; province?: string; country?: string; postalCode?: string
  }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/permanent-address`, {
      method: 'POST', body: payload
    })

  const updateOfficeAddress = async (payload: { officeAddress: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/office-address`, {
      method: 'POST', body: payload
    })

  const updateCivilStatus = async (payload: { civilStatus: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/civil-status`, {
      method: 'POST', body: payload
    })

  const updateEmailAddress = async (payload: { emailAddress: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/email-address`, {
      method: 'POST', body: payload
    })

  const updateMobileNumber = async (payload: {
    countryCodeMobile: string; areaCodeMobile: string; mobileNumber: string
  }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/mobile-number`, {
      method: 'POST', body: payload
    })

  const validateEmailAddress = async (payload: { emailAddress: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/validate-email-address`, {
      method: 'POST', body: payload
    })

  const validateMobileNumber = async (payload: {
    countryCodeMobile: string; areaCodeMobile: string; mobileNumber: string
  }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/validate-mobile-number`, {
      method: 'POST', body: payload
    })

  const approvePresentAddress = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/present-address-approve`, { method: 'POST', body: payload })

  const approvePermanentAddress = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/permanent-address-approve`, { method: 'POST', body: payload })

  const approveOfficeAddress = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/office-address-approve`, { method: 'POST', body: payload })

  const approveCivilStatus = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/civil-status-approve`, { method: 'POST', body: payload })

  const approveEmailAddress = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/email-address-approve`, { method: 'POST', body: payload })

  const approveMobileNumber = async (payload: { trn: string; otp: string }) =>
    fetchWithAuth<any>(`${apiBase}/member-profile-update/mobile-number-approve`, { method: 'POST', body: payload })

  return {
    getPresentAddress,
    getPermanentAddress,
    getOfficeAddress,
    getCivilStatus,
    getEmailAddress,
    getMobileNumber,
    updatePresentAddress,
    updatePermanentAddress,
    updateOfficeAddress,
    updateCivilStatus,
    updateEmailAddress,
    updateMobileNumber,
    approvePresentAddress,
    approvePermanentAddress,
    approveOfficeAddress,
    approveCivilStatus,
    approveEmailAddress,
    approveMobileNumber,
    validateEmailAddress,
    validateMobileNumber
  }
}
