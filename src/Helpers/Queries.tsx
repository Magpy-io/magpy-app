import * as ServerQueries from '~/Helpers/serverImportedQueries';

export * from '~/Helpers/serverImportedQueries';

async function getPhotoWithProgress(id: string, f?: (progess: number, total: number) => void) {
    const response = await ServerQueries.GetPhotoPartByIdPost({id: id, part: 0});

    if (!response.ok) {
        return response;
    }

    const totalNbParts = response.data.totalNbOfParts;

    const image64Parts = [response.data.photo.image64];

    let responseI: ServerQueries.GetPhotoPartByIdResponseType;
    for (let i = 1; i < totalNbParts; i++) {
        responseI = await ServerQueries.GetPhotoPartByIdPost({id: id, part: i});

        if (!responseI.ok) {
            return responseI;
        }

        image64Parts.push(responseI.data.photo.image64);

        f?.(i, totalNbParts);
    }
    response.data.photo.image64 = image64Parts.join('');
    return response;
}

async function addPhotoWithProgress(
    photo: ServerQueries.AddPhotoRequestData,
    f?: (progess: number, total: number) => void
) {
    const base64Image = photo.image64;

    const base64ImageSplit = splitString(base64Image);

    const response = await ServerQueries.AddPhotoInitPost({
        name: photo.name,
        fileSize: photo.fileSize,
        width: photo.width,
        height: photo.height,
        date: photo.date,
        path: photo.path,
        image64Len: base64Image.length,
    });

    if (!response.ok) {
        return response;
    }

    const id = response.data.id;

    let responseI;
    for (let i = 0; i < base64ImageSplit.length; i++) {
        responseI = await ServerQueries.AddPhotoPartPost({
            id: id,
            partNumber: i,
            partSize: base64ImageSplit[i].length,
            photoPart: base64ImageSplit[i],
        });

        if (!responseI.ok) {
            return responseI;
        }

        f?.(i, base64ImageSplit.length);
    }
    return responseI as ServerQueries.AddPhotoPartResponseType;
}

function splitString(str: string) {
    const partSize = 100000;
    const len = str.length;
    const numberOfParts = Math.floor(len / partSize);
    const parts = [];

    for (let i = 0; i < numberOfParts; i++) {
        parts.push(str.substring(i * partSize, (i + 1) * partSize));
    }
    if (len % partSize != 0) {
        parts.push(str.substring(partSize * numberOfParts, len));
    }

    return parts;
}

export {getPhotoWithProgress, addPhotoWithProgress};
