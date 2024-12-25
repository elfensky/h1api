export function timeDiffInMiliseconds(start, end) {
    const diff = end - start;
    return diff;
}

export function timeDiffInSeconds(start, end) {
    const diff = end - start;
    return diff / 1e3;
}

export function timeDiffHumanReadable(start, end) {
    const diff = end - start;
    const seconds = Math.floor(diff / 1e3);
    const milliseconds = diff - seconds * 1e3;
    return `${seconds}.${milliseconds} seconds`;
}
