const resource = (data, selector) => {
    if (Array.isArray(data)) {
        return collectionRes(data, selector);
    }
    return objectRes(data, selector);
}

const objectRes = (object, selector) =>{
    return selector(object);
}

const collectionRes = (collection, selector) => {
    return collection.map((elem) => selector(elem));
}

module.exports = { resource };