export function handleApiError(err: any): string | null {
    const detail = err?.response?.data?.detail;

    if (!detail) return "Unknown error. Please retry.";

    if (typeof detail === "string") {
        if (detail.startsWith("[hide]")) return null;
        return detail;
    }

    if (typeof detail === "object" && detail.message) {
        return detail.show === false ? null : detail.message;
    }

    if (Array.isArray(detail) && detail[0]?.msg) {
        return detail[0].msg;
    }

    return "An error occured.";
}
