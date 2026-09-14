import bcrypt from "bcrypt";
export default class PasswordService {
    static async hash(password: string) {
        return await bcrypt.hash(password, 10);
    }
    static async verify(hash: string, password: string) {
        return await bcrypt.compare(password, hash)
    }
}