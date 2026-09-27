export const useMembershipApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const validateApplication = async (formData: any) => {
    return await $fetch(`${apiBase}/member-application/validate`, {
      method: 'POST',
      body: formData
    })
  }

  const submitApplication = async (formData: any) => {
    return await $fetch<any>(`${apiBase}/member-application/create`, {
      method: 'POST',
      body: formData
    })
  }

  const saveEmployment = async (employmentData: any) => {
    return await $fetch(`${apiBase}/member-application/employment`, {
      method: 'POST',
      body: employmentData
    })
  }

  const saveCapitalPledge = async (pledgeData: any) => {
    return await $fetch(`${apiBase}/member-application/capital-pledge`, {
      method: 'POST',
      body: pledgeData
    })
  }

  const uploadDocument = async (docData: any) => {
    return await $fetch(`${apiBase}/member-application/upload-documents`, {
      method: 'POST',
      body: docData
    })
  }

  const getCapitalPledgeLimits = async () => {
    return await $fetch<any>(`${apiBase}/member-application/capital-pledge-minimum-maximum-amount`)
  }

  const sendEmail = async (emailData: any) => {
    return await $fetch<any>(`${apiBase}/member-application/send-email`, {
      method: 'POST',
      body: emailData
    })
  }

  const getRequirements = async () => {
    const res = await $fetch<any>(`${apiBase}/member-application/required-documents`)
    const list = res?.requiredDocuments || []
    return list.map((d: any) => ({
      code: d.documentCode,
      name: d.documentName,
      description: d.documentName // Using name as description if not provided
    }))
  }

  const generateOTP = async (email: string, mobile: string, type: 'email' | 'mobile', actionMessage?: string) => {
    const queryParams: any = { email, mobile, type }
    if (actionMessage) {
      queryParams.actionMessage = actionMessage
    }
    return await $fetch(`${apiBase}/otpm/application/generate`, {
      method: 'POST',
      query: queryParams   // $fetch encodes + as %2B automatically
    })
  }

  const verifyOTP = async (target: string, otp: string) => {
    return await $fetch(`${apiBase}/otpm/application/validate`, {
      method: 'POST',
      query: { target, otp }   // encodes + as %2B so email key matches stored record
    })
  }

  const loginWithOtp = async (memberId: string, otp: string) => {
    return await $fetch<any>(`${apiBase}/auth/login-with-otp`, {
      method: 'POST',
      body: { memberId, otp }
    })
  }

  // System Parameters — returns a plain array
  const getParametersByCode = async (codeName: string, opts = {}) => {
    return await $fetch<any[]>(`${apiBase}/system-parameters/code-name?codeName=${codeName}`, opts)
  }

  const getCountries = async (opts = {}) => {
    return await $fetch<any[]>(`${apiBase}/system-parameters/country`, opts)
  }

  const getNationalities = async (opts = {}) => {
    return await $fetch<any[]>(`${apiBase}/system-parameters/nationality`, opts)
  }

  const getStates = async (country: string = 'PH', opts = {}) => {
    return await $fetch<string[]>(`${apiBase}/system-parameters/state-province`, { ...opts, query: { country } })
  }

  const getCities = async (stateProvince: string, opts = {}) => {
    return await $fetch<string[]>(`${apiBase}/system-parameters/city`, { ...opts, query: { stateprovince: stateProvince } })
  }

  const getBarangays = async (city: string, opts = {}) => {
    return await $fetch<string[]>(`${apiBase}/system-parameters/barangay`, { ...opts, query: { city } })
  }

  const getPostalCodes = async (city: string, barangay: string, opts = {}) => {
    return await $fetch<string[]>(`${apiBase}/system-parameters/postal-code`, { ...opts, query: { city, barangay } })
  }

  // Employment lookups — backend returns { data: [...], message: '...' } wrapper
  const getEmploymentStatuses = async (opts = {}) => {
    const res = await $fetch<any>(`${apiBase}/member-application/employment-statuses`, opts)
    return Array.isArray(res) ? res : (res?.data ?? [])
  }

  const getEmploymentTypes = async (opts = {}) => {
    const res = await $fetch<any>(`${apiBase}/member-application/employment-types`, opts)
    return Array.isArray(res) ? res : (res?.data ?? [])
  }

  const getCompanyAccredited = async (opts = {}) => {
    const res = await $fetch<any>(`${apiBase}/member-application/company-accredited`, opts)
    return Array.isArray(res) ? res : (res?.companies ?? [])
  }

  return {
    validateApplication,
    submitApplication,
    getRequirements,
    generateOTP,
    verifyOTP,
    getParametersByCode,
    getCountries,
    getNationalities,
    getStates,
    getCities,
    getBarangays,
    getPostalCodes,
    getEmploymentStatuses,
    getEmploymentTypes,
    getCompanyAccredited,
    saveEmployment,
    saveCapitalPledge,
    uploadDocument,
    getCapitalPledgeLimits,
    sendEmail,
    loginWithOtp
  }
}
