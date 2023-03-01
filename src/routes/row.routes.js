import exppress from 'express';

import rowController from '../controller/row.controller.js';

const router = exppress.Router();

router.post('/create', (rowController.create));
router.get('/get', (rowController.getRow));
router.patch('/update', (rowController.update));
router.patch('/batchupdate', (rowController.BatchUpdate));
router.delete('/delete', (rowController.delete));


export default router;
