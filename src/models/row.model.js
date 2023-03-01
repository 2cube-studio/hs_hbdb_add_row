import express from 'express';
import dotenv from 'dotenv';


import hubspot from '@hubspot/api-client';
dotenv.config();

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });

class RowModel {

    getRowData = async (req, res) => {
        const tableIdOrName = process.env.TABLE_NAME_OR_ID;
        const sort = undefined;
        const after = undefined;
        const limit = undefined;
        const properties = undefined;

        try {
            const apiResponse = await hubspotClient.cms.hubdb.rowsApi.readDraftTableRows(tableIdOrName, sort, after, limit, properties);
            // const apiResponse = await hubspotClient.cms.hubdb.rowsApi.getTableRows(tableIdOrName, sort, after, limit, properties);
            // console.log(JSON.stringify(apiResponse.body, null, 2));
            // return res.status(200).send(apiResponse);
            // return apiResponse;

            // res.json = {data: [res, apiResponse]};
            console.log(apiResponse)
        } catch (e) {
            e.message === 'HTTP request failed'
                ? console.error(JSON.stringify(e.response, null, 2))
                : console.error(e)
        }
    };

}

export default new RowModel;