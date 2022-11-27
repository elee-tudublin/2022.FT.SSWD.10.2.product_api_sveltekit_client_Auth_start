import { writable } from 'svelte/store';


// .env variables starting with VITE_ are accessible client and server side 
const base_url = import.meta.env.VITE_API_BASE_URL

// declare writable stores for products and categories
export let products = writable([]);
export let categories = writable([]);


//
// Used to Initialise  requests
// parameters: http method and body content note default values)
const initRequest = (http_method = 'GET', body_data = '', access_token = '') => {

    let request = {
        method: http_method,
        // credentials: 'include',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        mode: 'cors',
        cache: 'default',
    };

    if (body_data) {
        request.body = body_data;
    }

    return request;
};


// Function to fetch and return data from an API
// Full URI based on base_url + endpoint
const getAPIData = async (endpoint = '', request = initRequest()) => {
    try {
        const response = await fetch(`${base_url}${endpoint}`, request);
        const data = await response.json();
        return data;

    } catch (err) {
        console.log('API error (store) ', err.message);
    } finally {

    }
};

// Function to get all products from the api
// sets the products store
export const getAllProducts = async (token='') => {

    const data = await getAPIData('/product', initRequest('GET', '', token));
    products.set(data);
};

// Function to get all categories from the api
// sets the categories store
export const getAllCategories= async (token='') => {

    const data = await getAPIData('/category', initRequest('GET', '', token));
    categories.set(data);     

};


// Function to get products in a category (by category id)
// sets the products store
export const getProductsByCat= async (cat_id = 0, token='') => {

    // 
    if (cat_id > 0) {
        const data = await getAPIData(`/product/bycat/${cat_id}`, initRequest('GET', '', token));
        categories.set(data);
    } else {
        getAllProducts();
    }

};

// Add a new product by sending a POST request to the API
export const addNewProduct= async (product = '', token='') => {

    if (product) {
        // build the request using the intRequest function
        const request = initRequest('POST', product, token);

        // Make th request via getAPIData() function
        const result = await getAPIData('/product', request);

        // refresh the store
        getAllProducts();

        // return the API result
        return result;

      // In case of error  
    } else {
        console.log('Store: Add new product failed: missing product');
    }
}

// To do - update an existing product
export const updateProduct = async (product = '', token='') => {

    if (product) {
        // build the request using the intRequest function
        const request = initRequest('PUT', product, token);
    }

}

// To do - delete an existing product by id
// id set to 0 by default
export const deleteProductById = async (id = 0, token='') => {

    if (id > 0) {
        // build the request using the intRequest function
        const request = initRequest('DELETE', '', token);
    }

}





  // fill the store
  //await getAllProducts();
  //await getAllCategories();
