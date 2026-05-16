export const useReportStore = defineStore('report', () => {
    const reports = useState('reports', () => []);

    const getHeaders = () => useRequestHeaders(['cookie']);

    const addReport = async (payload) => {
        console.log(payload);

        try {
            const response = await api('/api/user/post/report', {
                method: 'POST',
                body: payload,
                headers: getHeaders()
            })
            return response
        } catch (error) {
            throw error;
        }
    };

    const fetchReports = async () => {
        const response = await api('/api/user/get/reports', {
            method: 'GET',
        })
        reports.value = response
        return response
    }

    return { addReport, reports, fetchReports }
})