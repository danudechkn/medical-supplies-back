import { Request, Response } from "express"
import { AuthService } from "../../services/auth/auth.service";
import dbppk from "../../models/ppkhosp";

// helper fucntion 
function decryptXor(hexStr: string, secretKey: string): string {
    const bytes = Buffer.from(hexStr, 'hex');
    let result = '';
    for (let i = 0; i < bytes.length; i++) {
        const keyChar = secretKey.charCodeAt(i % secretKey.length);
        result += String.fromCharCode(bytes[i] ^ keyChar);
    }
    return result;
}

export class AuthController {
    static async login(req: Request, res: Response) {
        try {

            const auth = req.headers["x-ppk11-auth"] as string | undefined;
            if (!auth) {
                throw new Error("ไม่พบข้อมูล auth")
            }
            const configRecord = await dbppk.AppConfig.findOne({
                where: {
                    configname: "URL_Browse_MedSupply_Key"
                }
            });

            const secretKey = configRecord?.configvalue;
            if (!secretKey) {
                throw new Error("ไม่พบข้อมูล secret key ในฐานข้อมูล");
            }

            const decrypted = decryptXor(auth, secretKey);
            const parts = decrypted.split("|");
            const userid = parts[1];    // ได้ "1234" ตัวจริง
            console.log('🚀 ~ AuthController ~ login ~ userid:', userid)

            const timestampStr = parts[2]; // ได้เวลาที่กดปุ่ม รูปแบบ YYYYMMDDHHmmss เช่น "20260918090930"
            console.log('🚀 ~ AuthController ~ login ~ timestamp:', timestampStr)

            // แปลงรูปแบบ YYYYMMDDHHmmss เป็นเวลาในหน่วยมิลลิวินาที
            const year = Number(timestampStr.slice(0, 4));
            const month = Number(timestampStr.slice(4, 6)) - 1; // JS เดือนเริ่มที่ 0
            const day = Number(timestampStr.slice(6, 8));
            const hour = Number(timestampStr.slice(8, 10));
            const minute = Number(timestampStr.slice(10, 12));
            const second = Number(timestampStr.slice(12, 14));

            const timestampMs = new Date(year, month, day, hour, minute, second).getTime();

            // check timestamp not more 5 minute
            if (Date.now() - timestampMs > 300000) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    data: null,
                    message: "Unauthorized: รหัสผ่านหมดอายุ",
                });
            }

            const token = await AuthService.checkPersonLogin(Number(userid));
            return res.status(200).json({
                status: 200,
                success: true,
                ...token,
                message: "Login สำเร็จ",
            });

        } catch (error: any) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: null,
                message: error.message || "เกิดข้อผิดพลาดในการ Login",
            });
        }

    }
    static async getMe(req: Request, res: Response) {
        try {
            // 1. ดึง userid จาก Header (รองรับทั้ง x-user-id หรือ Authorization Bearer)
            // let userid = (req.headers["x-user-id"] || req.body?.userid) as string | undefined;

            // const authHeader = req.headers["authorization"];
            // if (!userid && authHeader) {
            //     const token = authHeader.startsWith("Bearer")
            //         ? authHeader.slice(7).trim()
            //         : authHeader.trim();

            //     if (/^\d+$/.test(token)) {
            //         userid = token;
            //     } else {
            //         // ถอดรหัสกรณีเป็น JWT (header.payload.signature)
            //         const parts = token.split(".");
            //         if (parts.length === 3) {
            //             try {
            //                 const decoded = JSON.parse(
            //                     Buffer.from(parts[1], "base64").toString("utf-8")
            //                 );
            //                 userid = decoded.userid ?? decoded.userId ?? decoded.id ?? decoded.sub;
            //             } catch {
            //                 // ignore parse error
            //             }
            //         }
            //     }
            // }
            let userid = req.user?.userid;
            if (!userid) {
                return res.status(401).json({
                    status: 401,
                    success: false,
                    data: null,
                    message: "Unauthorized: ไม่พบข้อมูลผู้ใช้ใน Token",
                });
            }

            const data = await AuthService.getMe(Number(userid));
            return res.status(200).json({
                status: 200,
                success: true,
                ...data,
                message: "ดึงข้อมูลผู้ใช้งานสำเร็จ",
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: null,
                message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน",
            });
        }
    }
}
