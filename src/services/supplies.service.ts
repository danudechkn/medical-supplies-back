import { Op, where } from "sequelize";
import db from "../models/supplies/index";

export class CreateItemService {
    static async createItem(body: any) {
        // รองรับทั้งแบบส่ง { items: [...] }, แบบส่ง [...] หรือ Object เดี่ยว
        const itemsToProcess = Array.isArray(body)
            ? body
            : Array.isArray(body?.items)
                ? body.items
                : [body];

        // จำกัดให้เพิ่มได้สูงสุด 10 รายการต่อครั้ง
        if (itemsToProcess.length > 10) {
            throw new Error("You can add up to 10 items");
        }

        const results = [];

        for (const itemInput of itemsToProcess) {
            // 1. บันทึก Item หลัก
            const item = await db.Item.create({
                itemname: itemInput.itemname,
                active: itemInput.active ? String(itemInput.active).toUpperCase() : "Y",
                created_by: itemInput.created_by || null,
                inv_code: itemInput.inv_code || itemInput.stockcode || null,
            });

            // 2. วนลูปบันทึก item_data ที่เกี่ยวข้อง
            let item_data: any[] = [];
            if (Array.isArray(itemInput.item_data) && itemInput.item_data.length > 0) {
                const dataList = itemInput.item_data.map((d: any) => ({
                    item_id: item.id,
                    coverage_group: d.coverage_group || null,
                    price: d.price || 0,
                    reimburse: d.reimburse ?? d.reiburse ?? 0,
                    noreimburse: d.noreimburse ?? d.noreiburse ?? 0,
                    stockcode: d.stockcode || null,
                    opd: (d.opd || d.OPD || "N").toUpperCase(),
                    ipd: (d.ipd || d.IPD || "N").toUpperCase(),
                    hm: (d.hm || d.HM || "N").toUpperCase(),
                }));

                item_data = await db.ItemData.bulkCreate(dataList);
            }

            results.push({ item, item_data });
        }

        return Array.isArray(body?.items) || Array.isArray(body)
            ? results
            : results[0];
    }
    static async getItemByID(id: number) {
        const item = await db.Item.findOne({
            where: {
                id,
                active: "Y",
            },
            include: [
                {
                    model: db.ItemData,
                    as: "item_data",
                },
            ],
        });

        if (!item) {
            return null;
        }

        const raw = item.toJSON();

        // ส่งข้อมูลกลับในโครงสร้างที่นำไปใช้ในหน้า Edit Form ได้ทันที
        return {
            id: raw.id,
            itemname: raw.itemname,
            stockcode: raw.inv_code || "",
            inv_code: raw.inv_code || "",
            active: raw.active,
            item_data: (raw.item_data || []).map((d: any) => ({
                id: d.id,
                item_id: d.item_id,
                coverage_group: d.coverage_group,
                price: Number(d.price) || 0,
                reiburse: Number(d.reimburse ?? d.reiburse ?? 0),
                noreiburse: Number(d.noreimburse ?? d.noreiburse ?? 0),
                stockcode: d.stockcode || "",
                OPD: d.opd || d.OPD || "N",
                IPD: d.ipd || d.IPD || "N",
                HM: d.hm || d.HM || "N",
            })),
        };
    }
    // static async updateItem(id: number, body: any) {
    //     const item = await db.Item.update({
    //         itemname: body.itemname,
    //         active: body.active,
    //         updated_by: body.updated_by,
    //     }, { where: { id } });
    //     const item_data = await db.ItemData.update({
    //         coverage_group: body.coverage_group,
    //         price: body.price,
    //         reiburse: body.reiburse,
    //         noreiburse: body.noreiburse,
    //         stockcode: body.stockcode,
    //         opd: body.opd || body.OPD,
    //         ipd: body.ipd || body.IPD,
    //         hm: body.hm || body.HM,
    //     }, { where: { item_id: id } });
    //     return { item, item_data };
    // }
    static async index(query: any) {
        const page = parseInt(query?.page) || 1;
        const limit = query?.limit ? parseInt(query.limit) : 10;
        const offset = (page - 1) * limit;
        const search = (query?.search || query?.keyword || query?.q || "").trim();

        // เงื่อนไขค้นหา
        const whereCondition: any = {
            active: "Y",
        };

        if (search) {
            whereCondition[Op.or] = [
                { itemname: { [Op.like]: `%${search}%` } },
                { inv_code: { [Op.like]: `%${search}%` } },
            ];
        }

        // ดึงข้อมูล Item พร้อม ItemData
        const { count, rows } = await db.Item.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: db.ItemData,
                    as: "item_data",
                },
            ],
            distinct: true,
            order: [["id", "DESC"]],
            limit,
            offset,
        });

        // จัดโครงสร้างให้ตรงกับหัวตารางใน Frontend
        const data = rows.map((item: any, idx: number) => {
            const raw = item.toJSON();
            const list = raw.item_data || [];

            // จับคู่สิทธิ์การรักษา: 10 = ต้นสังกัด, 40 = ประกันสังคม, 01 = UC, 90 = ชำระเอง
            const edc = list.find((d: any) => d.coverage_group === "10");
            const sso = list.find((d: any) => d.coverage_group === "40");
            const uc = list.find((d: any) => d.coverage_group === "01");
            const self = list.find((d: any) => d.coverage_group === "90");

            return {
                no: offset + idx + 1, // ลำดับ
                ...raw,
                // ราคาขาย
                price_edc: edc?.price ?? "-",
                price_sso: sso?.price ?? "-",
                price_uc: uc?.price ?? "-",
                price_self: self?.price ?? "-",
                // เบิกได้ / ใช้สิทธิ์ได้
                reiburse_edc: edc?.reimburse ?? edc?.reiburse ?? "-",
                reiburse_sso: sso?.reimburse ?? sso?.reiburse ?? "-",
                reiburse_uc: uc?.reimburse ?? uc?.reiburse ?? "-",
                reiburse_pay: self?.reimburse ?? self?.reiburse ?? "-",
                // รหัสเบิก (stockcode)
                stockcode: edc?.stockcode || sso?.stockcode || uc?.stockcode || self?.stockcode || "-",
            };
        });

        return {
            data,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }
}
