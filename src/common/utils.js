export function extractPaginationToParams(pagination) {
    return {
        page: pagination.current - 1,
        pageSize: pagination.pageSize,
        searchData: convertSearchObjectToSearchString(pagination.search),
        sortData: 1
    }
}


function convertSearchObjectToSearchString(searchObject) {
    if(!searchObject) return null;
    let s = "";
    Object.keys(searchObject).forEach(key => {
        s += `${key}=${searchObject[key]}&`
    })
    return s;
}