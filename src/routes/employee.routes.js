import exppress from 'express';

import employeeController from '../controller/employee.row.controller.js';

const router = exppress.Router();

router.post('/create', (employeeController.create));
// router.get('/get', (employeeController.getRow));


export default router;