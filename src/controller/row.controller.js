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
        const rowData = await rowModel.getRowData();
        // const rowData = await jobModel.getJobsData();
        // const str = JSON.stringify(rowData);
        // const a = JSON.parse(str)
        // console.log(a)

        let newRowData = [];
        let updatedRowsData = [];

        JobData.map((item1) => {

            rowData.map((item2) => {

                if (item1.StelleUuid == item2.StelleUuid) {
                    updatedRowsData = item1;
                } else {
                    newRowData = item2;
                }

            });

        });

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;

        if (newRowData != '') {
            const values = {
                "job_title": newRowData.Bezeichnung,
                "job_id": newRowData.StelleUuid
            };
            // console.log(values)
            const HubDbTableRowV3Request = { path: "", name: "zvoove_jobs", values };

            try {
                const apiResponse = await hubspotClient.cms.hubdb.rowsApi.createTableRow(tableIdOrName, HubDbTableRowV3Request);
                // console.log(JSON.stringify(apiResponse.body, null, 2));
                res.status(200).send(apiResponse);
            } catch (e) {
                e.message === 'HTTP request failed'
                    ? console.error(JSON.stringify(e.response, null, 2))
                    : console.error(e)
            }

        } else if (updatedRowsData != '') {
            const BatchInputJsonNode = {
                inputs: [
                    {
                        "id": "62703432947",
                        "values": {
                            // "job_title": newRowData.Bezeichnung,
                            "job_title": "Testposition zur Einrichtung von Zvoove - CX Test",
                            "job_id": newRowData.StelleUuid
                        }
                    },
                ]
            };
            console.log(BatchInputJsonNode)
            try {
                const apiResponse = await hubspotClient.cms.hubdb.rowsBatchApi.batchUpdateDraftTableRows(tableIdOrName, BatchInputJsonNode);
                // console.log(JSON.stringify(apiResponse.body, null, 2));
                res.status(200).send(apiResponse);
            } catch (e) {
                e.message === 'HTTP request failed'
                    ? console.error(JSON.stringify(e.response, null, 2))
                    : console.error(e)
            }

        } else {
            console.log('Somthing went wrong!')
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
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
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
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
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
            inputs: [
                {
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
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
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
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    }

}

export default new RowController;