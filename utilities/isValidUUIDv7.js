export default function isValidUUIDv7(uuid) {
    // Regular expression for UUIDv7
    const uuidv7Regex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv7Regex.test(uuid);
}
