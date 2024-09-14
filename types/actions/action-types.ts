export type ActionState = {
    status: "success" | "error" | "loading",
    message: string,
    data?: any,
}

