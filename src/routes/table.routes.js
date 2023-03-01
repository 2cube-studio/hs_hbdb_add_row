import exppress from 'express';

import tableController from '../controller/table.controller.js';

const router = exppress.Router();


router.post('/create', (tableController.create));
router.get('/get', (tableController.getTable));
router.patch('/update', (tableController.update));
router.delete('/delete', (tableController.delete));





export default router;
