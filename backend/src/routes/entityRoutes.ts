import { Router } from 'express';
import { 
  listDoctors, detailDoctor, 
  listPharmacies, detailPharmacy, 
  listLaboratories, detailLaboratory 
} from '../controllers/entityController.js';

const router = Router();

router.get('/doctors', listDoctors);
router.get('/doctors/:id', detailDoctor);

router.get('/pharmacies', listPharmacies);
router.get('/pharmacies/:id', detailPharmacy);

router.get('/laboratories', listLaboratories);
router.get('/laboratories/:id', detailLaboratory);

export default router;
