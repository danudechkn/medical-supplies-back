import dbppk from "../../models/ppkhosp";
import jwt from "jsonwebtoken";

export class AuthService {
    static async getMe(userid: number) {
        if (!userid) {
            throw new Error("User ID is required");
        }

        const person = await dbppk.AppPerson.findOne({
            subQuery: false,
            include: [
                {
                    model: dbppk.AppPersonFunctionalUnit,
                    as: "FuncUnit",
                    required: false,
                    attributes: ["FuncunitName"],
                },
                {
                    model: dbppk.AppUser,
                    as: "Users",
                    required: true,
                    where: {
                        userid,
                    },
                },
                {
                    model: dbppk.DoctorName,
                    as: "DoctorNameInfo",
                    required: false,
                },
            ],
        });

        // 1. ตรวจสอบว่าพบผู้ใช้งานหรือไม่
        if (!person) {
            throw new Error("ไม่พบข้อมูลผู้ใช้งานในระบบ");
        }

        // 2. จัดการชื่อ (ถ้าเป็นแพทย์ใช้ DoctorNameInfo ถ้าไม่ใช่ใช้ ชื่อ-สกุล ใน AppPerson)
        const doctor_name = person.DoctorNameInfo
            ? [
                person.DoctorNameInfo.doctorsalutation,
                person.DoctorNameInfo.doctorname,
                person.DoctorNameInfo.doctorlastname,
            ]
                .filter(Boolean)
                .join(" ")
            : null;

        const person_name = [person.firstname, person.lastname].filter(Boolean).join(" ");
        const fullName = doctor_name || person_name || "ไม่ระบุชื่อ";
        const funcUnitName = person.FuncUnit?.FuncunitName ?? null;

        // 3. เตรียม Payload ที่จะฝังไว้ใน Token
        const data = {
            userid: Number(userid),
            name: fullName,
            FuncUnitName: funcUnitName,
        };

        // 4. ออก Token (Sign JWT)
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) throw new Error("JWT_SECRET is not configured");
        const token = jwt.sign(data, secretKey, {
            expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
        });

        // 5. ส่งทั้ง token และข้อมูลผู้ใช้กลับไปให้ Frontend
        return {
            token,
            data,
        };
    }

    static async checkPersonLogin(userid: number) {
        const person = await dbppk.AppPerson.findOne({
            subQuery: false,
            // attributes: ["userid", "Funcunitcode"],
            include: [
                {
                    model: dbppk.AppPersonFunctionalUnit,
                    as: "FuncUnit",
                    required: false,
                    attributes: ["FuncunitName"],
                },
                {
                    model: dbppk.AppUser,
                    as: "Users",
                    required: true,
                    where: {
                        userid,
                    },
                },
                {
                    model: dbppk.DoctorName,
                    as: "DoctorNameInfo",
                    required: false,
                },
            ],
        });
        if (!person) {
            throw new Error("ไม่พบข้อมูลผู้ใช้งานในระบบ");
        }

        // 2. จัดการชื่อ (ถ้าเป็นแพทย์ใช้ DoctorNameInfo ถ้าไม่ใช่ใช้ ชื่อ-สกุล ใน AppPerson)
        const doctor_name = person.DoctorNameInfo
            ? [
                person.DoctorNameInfo.doctorsalutation,
                person.DoctorNameInfo.doctorname,
                person.DoctorNameInfo.doctorlastname,
            ]
                .filter(Boolean)
                .join(" ")
            : null;

        const person_name = [person.firstname, person.lastname].filter(Boolean).join(" ");
        const fullName = doctor_name || person_name || "ไม่ระบุชื่อ";
        const funcUnitName = person.FuncUnit?.FuncunitName ?? null;

        // 3. เตรียม Payload ที่จะฝังไว้ใน Token
        const data = {
            userid: Number(userid),
            // Funcun
            name: fullName,
            FuncUnitName: funcUnitName,
        };

        // 4. ออก Token (Sign JWT)
        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) throw new Error("JWT_SECRET is not configured");
        const token = jwt.sign(data, secretKey, {
            expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as any,
        });

        // 5. ส่งทั้ง token และข้อมูลผู้ใช้กลับไปให้ Frontend
        return {
            token,
            // data,
        };
    }
}
