import dotenv from 'dotenv';

import employeeModel from '../models/employee.row.model.js';

import hubspot from '@hubspot/api-client';
dotenv.config();

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });


class EmployeeController {

    create = async (req, res) => {
        // const JobData = await jobModel.getJobsData();
        // const rowData = await rowModel.getRowData();

        const employeeData = await employeeModel.getEmployeeData();
        const rowData2 = await employeeModel.getRowEmployeData();
        // const rowData2 = JSON.parse(rowData);

        // console.log('test', rowData)

        let data = {
            employeeData,
            rowData2
        }

        let newRowData = [];
        let updatedRowsData = [];

        for (let i = 0; i < employeeData.length; i++) {
            let found = false;

            for (let j = 0; j < rowData2.length; j++) {
                if (employeeData[i].id === rowData2[j].values.job_id) {
                    updatedRowsData.push({
                        "hs_id": rowData2[j].id,
                        job_title: rowData2[j].values.job_title,
                        ...employeeData[i],
                    });
                    found = true;
                    break;
                }
            }

            if (!found) {
                newRowData.push(employeeData[i]);
            }
        }

        data['newRowData'] = newRowData;
        data['updatedRowsData'] = updatedRowsData;
        // res.status(200).send(data);

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;

        // Update Row
        if (updatedRowsData.length > 0) {
            let updateRowBatchValue = [];

            updatedRowsData.map(item => {
                let obj = {
                    "id": item.hs_id,
                    "values": {
                        "job_id": item.StelleUuid,
                        "job_title": item.Bezeichnung
                    }
                }
                updateRowBatchValue.push(obj);
            })

            const BatchInputJsonNode = {
                inputs: updateRowBatchValue
            };

            // try {
            //     const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchUpdateDraftTableRows(tableIdOrName, BatchInputJsonNode);
            //     console.log('apiResponse--->', apiResponse);
            // } catch (e) {
            //     e.message === 'HTTP request failed' ?
            //         console.error(JSON.stringify(e.response, null, 2)) :
            //         console.error(e)
            // }

        }

        // Create Row
        if (newRowData.length > 0) {
            let newRowDataValue = [];

            newRowData.map(item => {
                let obj = {
                    "values": {
                        "job_id": item.StelleUuid,
                        "job_title": item.Bezeichnung
                    }
                }
                newRowDataValue.push(obj);
            })

            const BatchInputJsonNodeCreate = {
                inputs: newRowDataValue
            };

            // try {
            //     const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchCreateDraftTableRows(tableIdOrName, BatchInputJsonNodeCreate);
            //     console.log('apiResponse--->', apiResponse);
            // } catch (e) {
            //     e.message === 'HTTP request failed'
            //         ? console.error(JSON.stringify(e.response,
            //             null,
            //             2))
            //         : console.error(e)
            // }
        }
    };

}

export default new EmployeeController;