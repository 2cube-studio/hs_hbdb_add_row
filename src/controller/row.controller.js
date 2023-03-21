import express from 'express';
import dotenv from 'dotenv';

import jobModel from '../models/job.model.js';
import rowModel from '../models/row.model.js';

import hubspot from '@hubspot/api-client';
dotenv.config();

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });


class RowController {

    create = async (req, res) => {
        // const JobData = await jobModel.getJobsData();
        // const rowData = await rowModel.getRowData();
        // const rowData2 = JSON.parse(rowData);

        const userJobData = await jobModel.getJobsData();

        let UserNewRowData = [];

        userJobData.forEach(element => {
            UserNewRowData.push(element.StelleUuid);
        });
        const JobData = await jobModel.getUserJobsData(UserNewRowData);
        //console.log(rowData)
        // res.status(200).send(rowData);
        const rowData = await rowModel.getRowData();
        const rowData2 = JSON.parse(rowData);


        let data = {
            JobData,
            rowData2
        }

        let newRowData = [];
        let updatedRowsData = [];

        for (let i = 0; i < JobData.length; i++) {
            let found = false;

            for (let j = 0; j < rowData2.length; j++) {
                if (JobData[i].StelleUuid === rowData2[j].values.job_id) {
                    updatedRowsData.push({
                        "hs_id": rowData2[j].id,
                        job_title: rowData2[j].values.job_title,
                        bezeichnung: rowData2[j].values.bezeichnung,
                        einsatzortort: rowData2[j].values.einsatzortOrt,
                        stellenziel: rowData2[j].values.stellenziel,
                        // aufgabenheader: rowData2[j].values.aufgabenheader,
                        // aufgaben: rowData2[j].values.aufgaben,
                        // fachlicheanforderungenheader: rowData2[j].values.fachlicheAnforderungenHeader,
                        // fachlicheanforderungen: rowData2[j].values.fachlicheAnforderungen,
                        // arbeitgeberleistungheader: rowData2[j].values.arbeitgeberleistungHeader,
                        // arbeitgeberleistung: rowData2[j].values.arbeitgeberleistung,
                        // arbeitgebervorstellungheader: rowData2[j].values.arbeitgebervorstellungHeader,
                        // arbeitgebervorstellung: rowData2[j].values.arbeitgebervorstellung,
                        ...JobData[i],
                    });
                    found = true;
                    break;
                }
            }

            if (!found) {
                newRowData.push(JobData[i]);
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
                        "job_title": item.Bezeichnung,
                        "bezeichnung": item.Bezeichnung,
                        "einsatzortort": item.EinsatzortOrt,
                        "stellenziel": item.Stellenziel,
                        // "aufgabenheader": item.AufgabenHeader,
                        // "aufgaben": item.Aufgaben,
                        // "fachlicheanforderungenheader": item.FachlicheAnforderungenHeader,
                        // "fachlicheanforderungen": item.FachlicheAnforderungen,
                        // "arbeitgeberleistungheader": item.ArbeitgeberleistungHeader,
                        // "arbeitgeberleistung": item.Arbeitgeberleistung,
                        // "arbeitgebervorstellungheader": item.ArbeitgebervorstellungHeader,
                        // "arbeitgebervorstellung": item.Arbeitgebervorstellung
                    }
                }
                updateRowBatchValue.push(obj);
            })

            const BatchInputJsonNode = {
                inputs: updateRowBatchValue
            };

            try {
                const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchUpdateDraftTableRows(tableIdOrName, BatchInputJsonNode);
                console.log('apiResponse--->', apiResponse);
            } catch (e) {
                e.message === 'HTTP request failed' ?
                    console.error(JSON.stringify(e.response, null, 2)) :
                    console.error(e)
            }

        }

        // Create Row
        if (newRowData.length > 0) {
            let newRowDataValue = [];

            newRowData.map(item => {
                let obj = {
                    "values": {
                        "job_id": item.StelleUuid,
                        "job_title": item.Bezeichnung,
                        "bezeichnung": item.Bezeichnung,
                        "einsatzortort": item.EinsatzortOrt,
                        "stellenziel": item.Stellenziel,
                        // "aufgabenheader": item.AufgabenHeader,
                        // "aufgaben": item.Aufgaben,
                        // "fachlicheanforderungenheader": item.FachlicheAnforderungenHeader,
                        // "fachlicheanforderungen": item.FachlicheAnforderungen,
                        // "arbeitgeberleistungheader": item.ArbeitgeberleistungHeader,
                        // "arbeitgeberleistung": item.Arbeitgeberleistung,
                        // "arbeitgebervorstellungheader": item.ArbeitgebervorstellungHeader,
                        // "arbeitgebervorstellung": item.Arbeitgebervorstellung
                    }
                }
                newRowDataValue.push(obj);
            })

            const BatchInputJsonNodeCreate = {
                inputs: newRowDataValue
            };

            try {
                const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchCreateDraftTableRows(tableIdOrName, BatchInputJsonNodeCreate);
                console.log('apiResponse--->', apiResponse);
            } catch (e) {
                e.message === 'HTTP request failed'
                    ? console.error(JSON.stringify(e.response,
                        null,
                        2))
                    : console.error(e)
            }
        }

    };

    getRow = async (req, res) => {
        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const sort = undefined;
        const after = undefined;
        const limit = undefined;
        const properties = undefined;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.rowsApi.readDraftTableRows(tableIdOrName, sort, after, limit, properties);
            // const apiResponse = await hubspotClient.cms.hubdb.rowsApi.getTableRows(tableIdOrName, sort, after, limit, properties);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed' ?
                console.error(JSON.stringify(e.response, null, 2)) :
                console.error(e)
        }
    };

    update = async (req, res) => {

        const values = {
            "text_column": "this sample text value updated by vikram",
        };
        const HubDbTableRowV3Request = { path: "test_path", name: "test_title", values };
        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const rowId = process.env.ROW_ID;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.rowsApi.updateDraftTableRow(tableIdOrName, rowId, HubDbTableRowV3Request);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed' ?
                console.error(JSON.stringify(e.response, null, 2)) :
                console.error(e)
        }
    };

    BatchUpdate = async (req, res) => {
        const BatchInputJsonNode = {
            // inputs: [{
            //     "properties": {
            //         "id":"100095744267",
            //         "test_column": "this sample text value updated by vikram 1", "test_column": "this sample text value updated by vikram 1"
            //     },
            //     "properties": {
            //         "id":"100174716429",
            //         "test_column": "this sample text value updated by vikram 1", "test_column": "this sample text value updated by vikram 2"
            //     }
            // }]
            inputs: [{
                "job_id": "100178072677",
                "values": {
                    "job_title": "this sample text value updated by vikram 1"
                }
            },
            {
                "job_id": "100401034257",
                "values": {
                    "job_title": "this sample text value updated by vikram 2"
                }
            }
            ]
        };
        const tableIdOrName = process.env.TABLE_NAME_OR_ID;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchUpdateDraftTableRows(tableIdOrName, BatchInputJsonNode);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed' ?
                console.error(JSON.stringify(e.response, null, 2)) :
                console.error(e)
        }
    }

    delete = async (req, res) => {

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const rowId = process.env.ROW_ID;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.rowsApi.purgeDraftTableRow(tableIdOrName, rowId);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed' ?
                console.error(JSON.stringify(e.response, null, 2)) :
                console.error(e)
        }
    }

}

export default new RowController;