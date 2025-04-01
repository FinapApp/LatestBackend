
import Stripe from "stripe";
import { config } from "../generalconfig";

export const stripe = new Stripe(config.STRIPE_PRIVATE_KEY, {
    apiVersion: "2025-02-24.acacia",
});