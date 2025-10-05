import { Exclude, Expose } from "class-transformer";
import type { UserRole, UserStatus } from "../constants/users";
import { IUserRequiredProperties } from "../types";


@Exclude()
export class ExcludePassword implements Partial<IUserRequiredProperties> {
    @Expose()
    _id: string
    @Expose()
    name?: string | undefined;
    @Expose()
    email?: string | undefined;
    @Expose()
    status?: UserStatus;
    @Expose()
    roles?: UserRole[]
    @Expose()
    isVerify?: boolean | undefined;
    @Expose()
    otp: string
}