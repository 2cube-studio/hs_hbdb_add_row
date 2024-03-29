import fetch from "node-fetch";

class JobModel {

    getJobsData = async () => {
        // let data = await fetch(`https://comanos.europersonal.com/api/public/v1/Stelle/Read?searchterm=1`, {
        let data = await fetch(`https://comanos.europersonal.com/api/public/v1/Stelle/Read`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'charset': 'utf-8',
                'X-ApiKey': `${process.env.API_KEY}`
            }
        })

        let JsonData = await data.json();

        return JsonData;
    };

    getUserJobsData = async (UserNewRowData) => {

        let jobId = UserNewRowData;

        let allJobData = [];
        for (const file of jobId) {

            let data = await fetch(`https://comanos.europersonal.com/api/public/v1/Stelle/GetStelleById?stelleUuid=${file}`, {
                method: "GET",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'charset': 'utf-8',
                    'X-ApiKey': `${process.env.API_KEY}`
                }
            })
            let JsonData = await data.json();
            allJobData.push(JsonData);
        }
        return allJobData;
    }

}

export default new JobModel;