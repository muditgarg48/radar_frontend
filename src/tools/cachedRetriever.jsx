export default async function cachedRetriever(cacheKey, dataKey, deployment, endpoint, payload=null) {
    let cache = JSON.parse(localStorage.getItem(cacheKey));
    // if cache is not null, check for our data using dataKey
    if (cache != null) {
        if (dataKey in cache) {
            // if dataKey is in the cache, data already cached, retrieve it and return it
            // console.log("Using cached "+dataKey+" within "+cacheKey+" cache");
            // console.log(cache);
            return cache[dataKey];
        } else {
            // else it will be fetched from backend, cached and then returned
            // console.log("Couldn't find cached "+dataKey+" within "+cacheKey+ " cache");
        }
    } else {
        // else initialise the cache to update later on
        // console.log("Couldn't find "+cacheKey+" cache.");
        cache = {};
        // console.log("Creating a empty cache for "+cacheKey);
        localStorage.setItem(cacheKey, JSON.stringify(cache));
    }
    // update the cache using newly fetched data since we haven't returned till now
    const response = await fetch(deployment + endpoint, payload);
    if (response.ok) {
        const data = await response.json();
        cache[dataKey] = data;
        // console.log("Cached the newly fetched data for "+dataKey+" within "+cacheKey+" cache with the following:");
        // console.log(data);
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        return data;
    } else {
        console.alert("Fetching data for "+dataKey+" within "+cacheKey+" cache, got a weird response. Check console logs.");
        console.log(response);
        return response;
    }
}