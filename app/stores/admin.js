// app/stores/admin.ts
export const useAdminStore = defineStore("adminReports", () => {
  // 1. Use useState for hydration safety (Syncs Server and Client)
  const reports = useState('admin_reports', () => [])
  const analytics = useState('admin_analytics', () => ({}))

  /**
   * Helper to forward cookies so the Nuxt Server can act on your behalf
   */
  const getHeaders = () => useRequestHeaders(['cookie'])

  const fetchAllReports = async () => {
    try {
      const response = await api('/api/admin/get/reports', {
        headers: getHeaders()
      })
      reports.value = response.reports
      return response.reports
    } catch (error) {
      throw error
    }
  }

  const fetchAdminAnalytics = async () => {
    try {
      const response = await api('/api/admin/get/analytics', {
        headers: getHeaders()
      })
      analytics.value = response
      return response
    } catch (error) {
      throw error
    }
  }

  const fetchSingleReport = async (reportId) => {
    try {
      return await api('/api/admin/get/report', {
        query: { reportId }, // Standard way to handle ?key=value
        headers: getHeaders()
      })
    } catch (error) {
      throw error
    }
  }

  const downloadReportInPDF = async (reportId) => {
    try {
      const response = await api(`/api/admin/download-pdf`, {
        query: { report_id: reportId },
        headers: getHeaders(),
        responseType: 'blob',
      })

      // 2. Wrap browser-specific code to prevent SSR crashes
      if (import.meta.client) {
        const blob = response
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `Report-${reportId}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      throw error
    }
  }

  const getAllAdminsInfo = async () => {
    try {
      return await api('/api/admin/get/admins', {
        headers: getHeaders()
      })
    } catch (error) {
      throw error
    }
  }

  const inviteAdminToTheSystem = async (cnic) => {
    try {
      // Nuxt $fetch POST syntax: path + options.body
      return await api('/api/admin/invite/admin', {
        method: 'POST',
        body: { cnic },
        headers: getHeaders()
      })
    } catch (error) {
      throw error
    }
  }

  const modifyReport = async (payload) => {
    try {
      // Nuxt $fetch PUT syntax
      return await api('/api/admin/update/report', {
        method: 'PUT',
        body: payload,
        headers: getHeaders()
      })
    } catch (err) {
      throw err
    }
  }

  return {
    fetchAllReports,
    reports,
    fetchAdminAnalytics,
    analytics,
    fetchSingleReport,
    downloadReportInPDF,
    getAllAdminsInfo,
    inviteAdminToTheSystem,
    modifyReport
  }
})
