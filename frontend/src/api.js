import axios from 'axios';
import { mockMachines, mockCategories, mockBrands } from './mockData';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 5000,
});

// Helper: try API first, fallback to mock data
const withFallback = async (apiCall, fallback) => {
  try {
    const res = await apiCall();
    return res;
  } catch {
    return { data: fallback };
  }
};

export const getFeaturedMachines = () =>
  withFallback(
    () => API.get('/machines/featured'),
    { success: true, data: mockMachines.slice(0, 8) }
  );

export const getCategories = () =>
  withFallback(
    () => API.get('/categories'),
    { success: true, data: mockCategories }
  );

export const getBrands = () =>
  withFallback(
    () => API.get('/machines/brands'),
    { success: true, data: mockBrands }
  );

export const getMachines = (params) =>
  withFallback(
    () => API.get('/machines', { params }),
    (() => {
      let filtered = [...mockMachines];
      if (params?.category) filtered = filtered.filter(m => m.category_slug === params.category);
      if (params?.brand) filtered = filtered.filter(m => m.brand.toLowerCase() === params.brand.toLowerCase());
      if (params?.condition) filtered = filtered.filter(m => m.condition === params.condition);
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(m => m.name.toLowerCase().includes(s) || m.brand.toLowerCase().includes(s) || m.description.toLowerCase().includes(s));
      }
      if (params?.min_price) filtered = filtered.filter(m => m.price >= Number(params.min_price));
      if (params?.max_price) filtered = filtered.filter(m => m.price <= Number(params.max_price));
      if (params?.sort === 'price_low') filtered.sort((a, b) => a.price - b.price);
      if (params?.sort === 'price_high') filtered.sort((a, b) => b.price - a.price);
      if (params?.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      if (params?.sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
      const page = Number(params?.page) || 1;
      const limit = Number(params?.limit) || 12;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);
      return {
        success: true,
        data: paged,
        pagination: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
      };
    })()
  );

export const getMachine = (slug) =>
  withFallback(
    () => API.get(`/machines/${slug}`),
    { success: true, data: mockMachines.find(m => m.slug === slug) || null }
  );

export const getCategory = (slug) =>
  withFallback(
    () => API.get(`/categories/${slug}`),
    { success: true, data: mockCategories.find(c => c.slug === slug) || null }
  );

export const createInquiry = (data) => API.post('/inquiries', data).catch(() => ({ data: { success: true, message: 'Inquiry noted! We will contact you soon.' } }));
export const createOrder = (data) => API.post('/orders', data).catch(() => ({ data: { success: true, message: 'Order received! We will contact you to confirm.', data: { orderNumber: 'ORD-DEMO-' + Date.now().toString(36).toUpperCase() } } }));
export const getOrder = (orderNumber) => API.get(`/orders/${orderNumber}`);
export const createContact = (data) => API.post('/contact', data).catch(() => ({ data: { success: true, message: 'Message sent successfully! We will get back to you.' } }));
export const createReview = (data) => API.post('/reviews', data).catch(() => ({ data: { success: true, message: 'Review submitted! Thank you.' } }));

export default API;
