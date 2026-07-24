import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import categoriesRouter from "./categories";
import businessesRouter from "./businesses";
import productsRouter from "./products";
import offersRouter from "./offers";
import reviewsRouter from "./reviews";
import loyaltyRouter from "./loyalty";
import giftCardsRouter from "./giftcards";
import blogRouter from "./blog";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import favoritesRouter from "./favorites";
import profileRouter from "./profile";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(categoriesRouter);
router.use(businessesRouter);
router.use(productsRouter);
router.use(offersRouter);
router.use(reviewsRouter);
router.use(loyaltyRouter);
router.use(giftCardsRouter);
router.use(blogRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(favoritesRouter);
router.use(profileRouter);
router.use(aiRouter);

export default router;
