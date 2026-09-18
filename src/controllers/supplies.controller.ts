import { Request, Response } from "express";
import { CreateItemService } from "../services/supplies.service";

export class SuppliesController {
    static async createItem(req: Request, res: Response) {
        try {
            await CreateItemService.createItem(req.body);
            return res.status(200).json({ success: true, message: "Create item success" })
        }
        catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getItemByID(req: Request, res: Response) {
        try {
            const item = await CreateItemService.getItemByID(Number(req.params.id));
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
            return res.status(200).json({ success: true, message: "Get item success", data: item });
        }
        catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async index(req: Request, res: Response) {
        try {
            const data = await CreateItemService.index(req.query);
            return res.status(200).json({ success: true, message: "Get item success", ...data });
        }
        catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    static async updateItem(req: Request, res: Response) {
        try {
            const item = await CreateItemService.updateItem(Number(req.params.id), req.body);
            if (!item) {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
            return res.status(200).json({ success: true, message: "Update item success" });
        }
        catch (error: any) {
            if (error.message === "Item not found") {
                return res.status(404).json({ success: false, message: "Item not found" });
            }
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
