export const ACTIVATION_CODE_PLACEHOLDER = "TXH-XXXX-XXXX-XXXX";
export const ACTIVATION_CODE_MAX_LENGTH = 18;

const activationCodeBodyPattern = /^[A-Z2-9]{12}$/;

// Customers paste the code from WhatsApp or copy it from an RTL admin panel, which
// often carries bidi marks, spaces, or Arabic-keyboard dashes. Reducing the value to
// its 15 meaningful characters keeps what we send identical to what was issued.
function compactActivationCode(value) {
    if (typeof value !== "string") return "";
    return value
        .normalize("NFKC")
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 15);
}

export function formatActivationCodeInput(value) {
    const compact = compactActivationCode(value);
    return [compact.slice(0, 3), compact.slice(3, 7), compact.slice(7, 11), compact.slice(11, 15)]
        .filter(Boolean)
        .join("-");
}

export function normalizeActivationCode(value) {
    const compact = compactActivationCode(value);
    if (compact.length !== 15 || !compact.startsWith("TXH")) return "";
    const body = compact.slice(3);
    if (!activationCodeBodyPattern.test(body)) return "";
    return formatActivationCodeInput(compact);
}

export function isValidActivationCode(value) {
    return normalizeActivationCode(value).length > 0;
}
