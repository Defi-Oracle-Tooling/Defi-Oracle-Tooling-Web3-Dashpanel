import { Router, Request, Response, NextFunction } from 'express';
import tatumIntegration from '../integrations/tatum';
import dodoexIntegration from '../integrations/dodoex';
import aaveSpecialLeverIntegration from '../integrations/aave_special_lever';

const router = Router();

// Tatum Integration Endpoint
router.get("/tatum", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await tatumIntegration();
        res.json(result);
    } catch (error) {
        next(error); // Pass error to global handler
    }
});

// Dodoex Integration Endpoint
router.get("/dodoex", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await dodoexIntegration();
        res.json(result);
    } catch (error) {
        next(error); // Pass error to global handler
    }
});

// Aave Special Lever Integration Endpoint
router.get("/aave", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await aaveSpecialLeverIntegration();
        res.json(result);
    } catch (error) {
        next(error); // Pass error to global handler
    }
});

export default router;
