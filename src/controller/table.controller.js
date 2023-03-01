import express from 'express';
import dotenv from 'dotenv';

import hubspot from '@hubspot/api-client';
dotenv.config();

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });


class TableController {

    create = async (req, res) => {

        const dynamicMetaTags = {};
        const HubDbTableV3Request = { name: "food", label: "Food Table", useForPages: true, allowPublicApiAccess: false, allowChildTables: true, enableChildTablePages: false, columns: [{ "name": "text_column", "label": "Text Column", "id": "1", "type": "TEXT" }], dynamicMetaTags };

        try {
            const apiResponse = await hubspotClient.cms.hubdb.tablesApi.createTable(HubDbTableV3Request);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }

    };

    getTable = async (req, res) => {

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const archived = undefined;
        const includeForeignIds = undefined;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.tablesApi.getTableDetails(tableIdOrName, archived, includeForeignIds);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    };

    update = async (req, res) => {

        const dynamicMetaTags = {};
        const HubDbTableV3Request = { name: "food", label: "Foods Table", useForPages: true, allowPublicApiAccess: false, allowChildTables: true, enableChildTablePages: false, columns: [{ "name": "text_column", "label": "Text Column", "id": "1", "type": "TEXT" }], dynamicMetaTags };
        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const archived = undefined;
        const includeForeignIds = undefined;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.tablesApi.updateDraftTable(tableIdOrName, HubDbTableV3Request, archived, includeForeignIds);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    };

    delete = async (req, res) => {

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.tablesApi.archiveTable(tableIdOrName);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            res.status(200).send(apiResponse);
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    };

    publish = async (req, res) => {

        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const includeForeignIds = undefined;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.tablesApi.publishDraftTable(tableIdOrName, includeForeignIds);
            console.log(JSON.stringify(apiResponse.body, null, 2));
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    }

}

export default new TableController;