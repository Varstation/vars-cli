import fs from 'fs';

export const getJson = (path) => {
    const data = fs.existsSync(path) ? fs.readFileSync(path) : undefined;
    try {
        return JSON.parse(data);
    } catch (e) {
        return undefined;
    }
};

export const saveJson = (path, data) =>
    fs.writeFileSync(path, JSON.stringify(data, null, '\t'));
