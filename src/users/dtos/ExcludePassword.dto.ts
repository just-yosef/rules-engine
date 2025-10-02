import { Exclude, Expose } from "class-transformer";
import type { UserRole, UserStatus } from "../constants/users";
import { IUserRequiredProperties } from "../types";


@Exclude()
export class ExcludePassword implements Partial<IUserRequiredProperties> {
    @Expose()
    name?: string | undefined;
    @Expose()
    email?: string | undefined;
    @Expose()
    status?: UserStatus;
    @Expose()
    roles?: UserRole[]
}