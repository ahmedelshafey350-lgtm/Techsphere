export const publicAsset = (path) =>
    `${import.meta.env.BASE_URL}${encodeURI(path.replace(/^\/+/, ''))}`;
