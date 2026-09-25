import { properties as initialProperties, Property } from '../data/sampleData';
import { compressFile } from './compressor';
import { normalizeAmenities } from './propertyContent';
import { API_URL } from './apiUrl';

export interface Blog {
  id: number;
  title: string;
  category: 'Engineering' | 'Design' | 'Planning' | string;
  date?: string;
  author: string;
  excerpt: string;
  image: string;
  content: string;
  featured: boolean;
  publishStatus?: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  created_at?: string;
  galleryImages?: string[];
  pdfAttachment?: string;
  slug?: string;
}

export interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  projectInterest: string;
  status: 'pending' | 'contacted' | 'resolved';
  notes?: string;
  created_at?: string;
}

export interface Consultation {
  id: number;
  name: string;
  phone: string;
  email: string;
  preferredDate?: string;
  projectType: string;
  budget: string;
  status: 'pending' | 'contacted' | 'resolved';
  created_at?: string;
}

export interface SiteVisit {
  id: number;
  name: string;
  phone: string;
  email: string;
  projectId?: number;
  projectName?: string;
  visitDate: string;
  message?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Job {
  id: number;
  title: string;
  department?: string;
  location?: string;
  description: string;
  requirements: string[];
  experience?: string;
  type: string;
  status: 'open' | 'closed';
  created_at?: string;
}

export interface JobApplication {
  id: number;
  jobId?: number;
  jobTitle?: string;
  name: string;
  email: string;
  phone: string;
  resumePath: string;
  position: string;
  created_at?: string;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface DashboardStats {
  totalProperties: number;
  ongoingProjects: number;
  completedProjects: number;
  newEnquiries: number;
  consultations: number;
  siteVisits: number;
  blogs: number;
  activityLogs: any[];
}

// API_URL is imported from './apiUrl' — see that file for the guard logic that
// prevents GoDaddy from injecting the wrong (frontend preview) URL at build time.

// Initial sample blogs fallback
const initialBlogs: Blog[] = [
  {
    id: 1,
    title: 'Structural Durability in Coastal Real Estate',
    category: 'Engineering',
    date: 'June 28, 2026',
    author: 'Lead Engineer',
    excerpt: 'Analyzing material selection and moisture-barrier specification for premium coastal developments in Kerala.',
    image: '/images/blog/blog-1.jpg',
    featured: true,
    publishStatus: 'published',
    content: `### Technical Analysis on Coastal Building Durability\n\nBuilding near the sea in Kerala poses severe structural challenges...`
  },
  {
    id: 2,
    title: 'Timeless Luxury: Book-Matched Marble Aesthetics',
    category: 'Design',
    date: 'May 14, 2026',
    author: 'Interior Architect',
    excerpt: 'How careful selection and layout of natural Italian marble veins establish premium home atmospheres.',
    image: '/images/services/interior-exterior.jpg',
    featured: false,
    publishStatus: 'published',
    content: `### Designing with Natural Italian Marble\n\nBook-matching is the practice...`
  }
];

// Helper: build fetch options with credentials + correct Content-Type
const buildOptions = (options: RequestInit = {}): RequestInit => {
  const headers: Record<string, string> = {};

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((val, key) => {
        headers[key] = val;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, val]) => {
        headers[key] = val;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  return {
    ...options,
    credentials: 'include',
    headers,
  };
};

// Deduplicated silent token refresh: multiple concurrent 401s share a single refresh call
let refreshPromise: Promise<boolean> | null = null;

const doTokenRefresh = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        return refreshRes.ok;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

// Helper: Central Fetch with Credentials (HttpOnly cookies)
// Automatically retries once after a silent token-refresh on 401 responses
// so that access-token expiry is transparent to callers.
const request = async <T = any>(url: string, options: RequestInit = {}, _isRetry = false): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, buildOptions(options));

  // Only attempt silent refresh on protected business endpoints, not auth endpoints themselves
  const isAuthEndpoint = url.startsWith('/auth/login') || url.startsWith('/auth/refresh') || url.startsWith('/auth/logout');
  if (response.status === 401 && !_isRetry && !isAuthEndpoint) {
    const refreshed = await doTokenRefresh();
    if (refreshed) {
      return request<T>(url, options, true);
    }
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
};

/* ============================================================================
   AUTHENTICATION APIs
   ============================================================================ */
export const loginAdmin = async (email: string, password: string): Promise<{ admin: Admin }> => {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const logoutAdmin = async (): Promise<void> => {
  return request('/auth/logout', { method: 'POST' });
};

export const checkAdminSession = async (): Promise<{ admin: Admin }> => {
  return request('/auth/me', { method: 'GET' });
};

export const refreshAdminSession = async (): Promise<void> => {
  return request('/auth/refresh', { method: 'POST' });
};

export const changeAdminPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  return request('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

export const requestPasswordReset = async (email: string): Promise<{ message: string }> => {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetAdminPassword = async (token: string, newPassword: string): Promise<{ message: string }> => {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};

/* ============================================================================
   ADMIN MANAGEMENT APIs (Superadmin functions)
   ============================================================================ */
export const getAdminsList = async (): Promise<Admin[]> => {
  return request('/auth/admins', { method: 'GET' });
};

export const createAdminAccount = async (adminData: any): Promise<Admin> => {
  return request('/auth/admins', {
    method: 'POST',
    body: JSON.stringify(adminData),
  });
};

export const removeAdminAccount = async (id: number): Promise<void> => {
  return request(`/auth/admins/${id}`, { method: 'DELETE' });
};

/* ============================================================================
   PROPERTIES APIs (CRUD)
   ============================================================================ */
export const resolveUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const backendBase = API_URL.replace(/\/api\/?$/, '');

  // If already a Cloudinary or external cloud CDN URL, return as-is
  if (trimmed.startsWith('https://res.cloudinary.com') || trimmed.startsWith('http://res.cloudinary.com')) {
    return trimmed;
  }

  // If pointing to any backend host or localhost with an /uploads/ path
  const uploadsIdx = trimmed.indexOf('/uploads/');
  if (uploadsIdx !== -1) {
    return `${backendBase}${trimmed.substring(uploadsIdx)}`;
  }
  if (trimmed.startsWith('uploads/')) {
    return `${backendBase}/${trimmed}`;
  }

  return trimmed;
};

/**
 * Normalizes URLs before saving to backend so that MySQL never stores hardcoded hostnames.
 * Cloudinary/CDN URLs are preserved; local/backend URLs are stripped down to relative /uploads/... paths.
 */
export const normalizeStorageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Cloudinary / external cloud assets remain absolute
  if (trimmed.startsWith('https://res.cloudinary.com') || trimmed.startsWith('http://res.cloudinary.com')) {
    return trimmed;
  }

  // Strip backend host / localhost / airoapp and store clean relative path
  const uploadsIdx = trimmed.indexOf('/uploads/');
  if (uploadsIdx !== -1) {
    return trimmed.substring(uploadsIdx);
  }

  return trimmed;
};


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * compressImage — shrinks an image File before storing it locally.
 *
 * HOW IT WORKS (plain English):
 *  1. We draw the image onto an invisible HTML <canvas> element.
 *  2. We scale it down so neither side exceeds `maxDimension` pixels.
 *  3. We export the canvas as a JPEG at `quality` (0–1, where 0.55 ≈ 55% quality).
 *  4. The result is a base64 string — much smaller than the original file.
 *
 * For reference: a 4MB phone photo typically compresses to ~80–150KB this way,
 * which is 25–50x smaller and safe to store in localStorage's 5MB limit.
 *
 * Non-image files (PDFs etc.) are returned as plain base64 without compression
 * since Canvas can only process images.
 */
export const compressImage = (
  file: File,
  maxDimension = 1280,
  quality = 0.55
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // PDFs and non-images: fall back to plain base64 (no canvas needed)
    if (!file.type.startsWith('image/')) {
      return fileToBase64(file).then(resolve).catch(reject);
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        // Calculate scaled dimensions, preserving aspect ratio
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // Draw onto canvas at the new size
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG (smaller than PNG for photos)
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const formatPriceINR = (price: number): string => {
  if (!price || isNaN(price)) return 'Price on Request';
  if (price >= 10000000) {
    const cr = price / 10000000;
    return `₹${Number(cr.toFixed(2))} Cr`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `₹${Number(lakhs.toFixed(2))} Lakhs`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
};

export const getProperties = async (): Promise<Property[]> => {
  try {
    const rawProps = await request('/properties');
    return rawProps.map((p: any) => {
      const name = p.name || p.title || 'Untitled Property';
      
      let rawImages: string[] = [];
      if (Array.isArray(p.images) && p.images.length > 0) {
        rawImages = p.images;
      } else if (typeof p.images === 'string' && p.images.trim()) {
        try {
          const parsed = JSON.parse(p.images);
          if (Array.isArray(parsed)) rawImages = parsed;
        } catch {
          rawImages = p.images.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      if (rawImages.length === 0 && Array.isArray(p.gallery) && p.gallery.length > 0) {
        rawImages = p.gallery;
      } else if (rawImages.length === 0 && typeof p.gallery === 'string' && p.gallery.trim()) {
        try {
          const parsed = JSON.parse(p.gallery);
          if (Array.isArray(parsed)) rawImages = parsed;
        } catch {
          rawImages = p.gallery.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      // 1. Resolve Hero Image (priority: p.hero_image, p.heroImage, p.image, p.featured_image)
      const heroCandidate = p.hero_image || p.heroImage || p.featured_image || p.image;
      const heroImage = heroCandidate
        ? resolveUploadUrl(heroCandidate)
        : (rawImages.length > 0 ? resolveUploadUrl(rawImages[0]) : '/images/hero/projects-hero.jpg');

      // 2. Resolve Gallery Images (strictly exclude hero image to avoid duplicate presentation)
      const resolvedImages = rawImages
        .map((img: string) => resolveUploadUrl(img))
        .filter(Boolean)
        .filter((img: string) => img !== heroImage);

      return {
        id: p.id,
        name: name,
        type: p.type || p.category || 'Villa',
        status: p.status || 'Ongoing',
        location: p.location || '',
        area: p.area || (p.location ? p.location.split(',')[0] : ''),
        price: Number(p.price || 0),
        priceDisplay: p.priceDisplay || p.price_display || p.price_label || formatPriceINR(Number(p.price)),
        bhk: p.bhk || '3 BHK',
        sqft: Number(p.sqft || p.sq_ft || p.built_area || 0),
        landArea: p.landArea || p.land_area || '',
        image: heroImage,
        images: resolvedImages,
        amenities: normalizeAmenities(p.amenities || p.features || []),
        description: p.description || '',
        tagline: p.tagline || '',
        story: p.story || '',
        nearby: p.nearby || [],
        featured: Boolean(p.featured),
        coordinates: p.coordinates || { lat: 10.0121, lng: 76.3532 },
        brochurePdf: resolveUploadUrl(p.brochurePdf || p.brochure_pdf || p.brochure),
        virtualTourLink: p.virtualTourLink || p.virtual_tour_link || p.video_url || '',
        floorPlan: resolveUploadUrl(p.floorPlan || p.floor_plan)
      };
    });
  } catch (err) {
    console.error('Could not reach API, falling back to read-only sample portfolio:', err);
    return initialProperties.map(p => ({
      ...p,
      priceDisplay: p.priceDisplay && p.priceDisplay.trim() !== '' ? p.priceDisplay : formatPriceINR(Number(p.price))
    }));
  }
};

export const saveProperty = async (
  property: Property, 
  files?: { heroImage?: File, gallery?: File[], brochure?: File, floorPlan?: File }
): Promise<Property> => {
  const isUpdate = property.id && property.id > 0;
  
  // Normalize existing URLs to relative paths (or keep Cloudinary) to avoid hardcoded domain pollution
  const normalizedHero = normalizeStorageUrl(property.image);
  const normalizedGallery = (property.images || [])
    .map(img => normalizeStorageUrl(img))
    .filter(img => img && img !== normalizedHero);

  const hasUploadedGallery = Boolean(files?.gallery && files.gallery.length > 0);
  const backendData: any = {
    name: property.name,
    title: property.name,
    type: property.type,
    category: property.type,
    status: property.status,
    location: property.location,
    area: property.area,
    price: property.price,
    priceLabel: formatPriceINR(property.price),
    priceDisplay: formatPriceINR(property.price),
    bhk: property.bhk,
    sqFt: property.sqft,
    builtArea: property.sqft,
    landArea: property.landArea || '',
    heroImage: normalizedHero,
    // When uploading new gallery files, only send existing remote images if any
    images: normalizedGallery,
    gallery: normalizedGallery,
    amenities: normalizeAmenities(property.amenities || []),
    features: normalizeAmenities(property.amenities || []),
    description: property.description,
    tagline: property.tagline || '',
    story: property.story || '',
    nearby: property.nearby || [],
    featured: property.featured,
    coordinates: property.coordinates,
    brochurePdf: property.brochurePdf ? normalizeStorageUrl(property.brochurePdf) : '',
    virtualTourLink: property.virtualTourLink || '',
    floorPlan: property.floorPlan ? normalizeStorageUrl(property.floorPlan) : ''
  };

  let body: any = JSON.stringify(backendData);
  let headers: any = {};

  // Compress all files before uploading
  if (files) {
    if (files.heroImage) {
      const r = await compressFile(files.heroImage, { maxDimension: 1600, quality: 0.78, maxBytes: 700 * 1024 });
      files = { ...files, heroImage: r.file };
      console.info(`[compressor] Hero image: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.compressedSize/1024).toFixed(0)}KB (${r.savedPercent}% smaller)`);
    }
    if (files.gallery && files.gallery.length > 0) {
      const compressed = await Promise.all(
        files.gallery.map(f => compressFile(f, { maxDimension: 1400, quality: 0.75, maxBytes: 600 * 1024 }).then(r => r.file))
      );
      files = { ...files, gallery: compressed };
    }
    if (files.brochure) {
      const r = await compressFile(files.brochure, { maxDimension: 1200, quality: 0.72 });
      files = { ...files, brochure: r.file };
      console.info(`[compressor] Brochure PDF: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.compressedSize/1024).toFixed(0)}KB (${r.savedPercent}% smaller)`);
    }
    if (files.floorPlan) {
      const r = await compressFile(files.floorPlan, { maxDimension: 1400, quality: 0.75 });
      files = { ...files, floorPlan: r.file };
      console.info(`[compressor] Floor plan: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.compressedSize/1024).toFixed(0)}KB (${r.savedPercent}% smaller)`);
    }
  }

  // If uploading files, package as FormData
  if (files && (files.heroImage || files.gallery || files.brochure || files.floorPlan)) {
    const formData = new FormData();
    Object.keys(backendData).forEach(key => {
      // Avoid key collision between string value and file value
      if (key === 'heroImage' && files.heroImage) return;
      if (key === 'floorPlan' && files.floorPlan) return;
      if (key === 'brochure' && files.brochure) return;
      if (key === 'brochurePdf' && files.brochure) return;

      if (typeof backendData[key] === 'object' && backendData[key] !== null) {
        formData.append(key, JSON.stringify(backendData[key]));
      } else {
        formData.append(key, String(backendData[key]));
      }
    });
    if (files.heroImage) {
      formData.append('heroImage', files.heroImage);
    }
    if (files.gallery) {
      files.gallery.forEach(file => {
        formData.append('gallery', file);
      });
    }
    if (files.brochure) {
      formData.append('brochure', files.brochure);
    }
    if (files.floorPlan) {
      formData.append('floorPlan', files.floorPlan);
    }
    body = formData;
  }

  const saved = await request(
    isUpdate ? `/properties/${property.id}` : '/properties',
    {
      method: isUpdate ? 'PUT' : 'POST',
      headers,
      body,
    }
  );

  return getProperties().then(list => list.find(p => p.id === saved.id) || property);
};

export const deleteProperty = async (id: number): Promise<void> => {
  await request(`/properties/${id}`, { method: 'DELETE' });
};

/* ============================================================================
   BLOGS APIs (CRUD)
   ============================================================================ */
export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const rawBlogs = await request('/blogs');
    return rawBlogs.map((b: any) => ({
      id: b.id,
      title: b.title,
      slug: b.slug,
      category: b.category,
      date: new Date(b.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: b.author,
      excerpt: b.excerpt || b.seo_description || b.content.substring(0, 150),
      image: b.featured_image,
      content: b.content,
      featured: b.featured,
      publishStatus: b.publish_status,
      galleryImages: b.gallery || [],
      pdfAttachment: b.pdf_attachment || ''
    }));
  } catch (err) {
    console.error('Could not reach API, falling back to read-only sample blogs:', err);
    return initialBlogs;
  }
};

export const saveBlog = async (
  blog: Blog, 
  files?: { featuredImage?: File, pdfAttachment?: File, gallery?: File[] }
): Promise<Blog> => {
  const isUpdate = blog.id && blog.id > 0;
  
  const backendData: any = {
    title: blog.title,
    category: blog.category,
    author: blog.author,
    content: blog.content,
    featuredImage: blog.image,
    featured: blog.featured,
    publishStatus: blog.publishStatus || 'published',
    excerpt: blog.excerpt,
    gallery: blog.galleryImages || [],
    pdfAttachment: blog.pdfAttachment || ''
  };

  let body: any = JSON.stringify(backendData);
  let headers: any = {};

  // Compress all files before uploading
  if (files) {
    if (files.featuredImage) {
      const r = await compressFile(files.featuredImage, { maxDimension: 1600, quality: 0.78, maxBytes: 700 * 1024 });
      files = { ...files, featuredImage: r.file };
      console.info(`[compressor] Blog image: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.compressedSize/1024).toFixed(0)}KB (${r.savedPercent}% smaller)`);
    }
    if (files.pdfAttachment) {
      const r = await compressFile(files.pdfAttachment, { maxDimension: 1200, quality: 0.72 });
      files = { ...files, pdfAttachment: r.file };
      console.info(`[compressor] Blog PDF: ${(r.originalSize/1024).toFixed(0)}KB → ${(r.compressedSize/1024).toFixed(0)}KB (${r.savedPercent}% smaller)`);
    }
    if (files.gallery && files.gallery.length > 0) {
      const compressed = await Promise.all(
        files.gallery.map(f => compressFile(f, { maxDimension: 1400, quality: 0.75, maxBytes: 600 * 1024 }).then(r => r.file))
      );
      files = { ...files, gallery: compressed };
    }
  }

  // If uploading files, package as FormData
  if (files && (files.featuredImage || files.pdfAttachment || files.gallery)) {
    const formData = new FormData();
    Object.keys(backendData).forEach(key => {
      if (typeof backendData[key] === 'object' && backendData[key] !== null) {
        formData.append(key, JSON.stringify(backendData[key]));
      } else {
        formData.append(key, String(backendData[key]));
      }
    });
    if (files.featuredImage) {
      formData.append('featuredImage', files.featuredImage);
    }
    if (files.pdfAttachment) {
      formData.append('pdfAttachment', files.pdfAttachment);
    }
    if (files.gallery) {
      files.gallery.forEach(file => {
        formData.append('gallery', file);
      });
    }
    body = formData;
  }

  const saved = await request(
    isUpdate ? `/blogs/${blog.id}` : '/blogs',
    {
      method: isUpdate ? 'PUT' : 'POST',
      headers,
      body,
    }
  );

  return getBlogs().then(list => list.find(b => b.id === saved.id) || blog);
};

export const deleteBlog = async (id: number): Promise<void> => {
  await request(`/blogs/${id}`, { method: 'DELETE' });
};

/* ============================================================================
   CRM LEADS APIs
   ============================================================================ */
export const getEnquiries = async (): Promise<Enquiry[]> => {
  return request('/enquiries', { method: 'GET' });
};

export const submitEnquiry = async (data: any): Promise<Enquiry> => {
  return request('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateEnquiryStatus = async (id: number, data: { status: string, notes?: string }): Promise<Enquiry> => {
  return request(`/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getConsultations = async (): Promise<Consultation[]> => {
  return request('/consultations', { method: 'GET' });
};

export const submitConsultation = async (data: any): Promise<Consultation> => {
  return request('/consultations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateConsultationStatus = async (id: number, data: { status: string }): Promise<Consultation> => {
  return request(`/consultations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getSiteVisits = async (): Promise<SiteVisit[]> => {
  return request('/site-visits', { method: 'GET' });
};

export const submitSiteVisit = async (data: any): Promise<SiteVisit> => {
  return request('/site-visits', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSiteVisitStatus = async (id: number, data: { status: string }): Promise<SiteVisit> => {
  return request(`/site-visits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/* ============================================================================
   BROCHURE CATALOG APIs
   ============================================================================ */
export const getBrochureInfo = async (): Promise<{ file_path: string, download_count: number }> => {
  return request('/brochure', { method: 'GET' });
};

export const uploadBrochurePdf = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('brochureFile', file);
  return request('/brochure', {
    method: 'POST',
    body: formData,
  });
};

/* ============================================================================
   CAREER PORTAL APIs
   ============================================================================ */
export const getJobsList = async (includeClosed = false): Promise<Job[]> => {
  try {
    return await request(`/jobs?includeClosed=${includeClosed}`, { method: 'GET' });
  } catch (err) {
    console.error('Jobs API offline, returning empty jobs array');
    return [];
  }
};

export const saveJobPosting = async (job: any): Promise<Job> => {
  const isUpdate = job.id && job.id > 0;
  return request(isUpdate ? `/jobs/${job.id}` : '/jobs', {
    method: isUpdate ? 'PUT' : 'POST',
    body: JSON.stringify(job),
  });
};

export const deleteJobPosting = async (id: number): Promise<void> => {
  return request(`/jobs/${id}`, { method: 'DELETE' });
};

export const getApplicationsList = async (): Promise<JobApplication[]> => {
  return request('/applications', { method: 'GET' });
};

export const submitJobApplication = async (data: any, resumeFile: File): Promise<JobApplication> => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    formData.append(key, String(data[key]));
  });
  formData.append('resume', resumeFile);
  return request('/applications', {
    method: 'POST',
    body: formData,
  });
};

/* ============================================================================
   DASHBOARD STATS API
   ============================================================================ */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return request('/dashboard/stats', { method: 'GET' });
};

/* ============================================================================
   LIVE SUPPORT CHAT API
   ============================================================================ */

export interface SupportConversation {
  id: string;
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  property_context?: string;
  status: 'waiting' | 'active' | 'resolved' | 'closed';
  assigned_agent?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  conversation_id: string;
  sender: 'visitor' | 'agent';
  sender_name?: string;
  content: string;
  is_read: number;
  created_at: string;
}

// Public: check if any agent is online
export const checkAgentPresence = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/support/presence`, { credentials: 'include' });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.online;
  } catch {
    return false;
  }
};

// Public: create or retrieve conversation
export const getOrCreateSupportConversation = async (opts: {
  visitor_name: string;
  visitor_phone?: string;
  visitor_email?: string;
  property_context?: string;
  existing_conversation_id?: string;
}): Promise<SupportConversation> => {
  const res = await fetch(`${API_URL}/support/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(opts),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to start conversation.');
  }
  const data = await res.json();
  return data.conversation;
};

// Public: fetch messages for a conversation
export const fetchSupportMessages = async (
  conversationId: string,
  after?: string
): Promise<{ messages: SupportMessage[]; agentOnline: boolean; conversation: SupportConversation }> => {
  const url = new URL(`${API_URL}/support/conversations/${conversationId}/messages`);
  if (after) url.searchParams.set('after', after);
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch messages.');
  return res.json();
};

// Public: send visitor message
export const sendVisitorMessage = async (
  conversationId: string,
  content: string
): Promise<SupportMessage> => {
  const res = await fetch(`${API_URL}/support/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message.');
  }
  const data = await res.json();
  return data.message;
};

// Protected: agent heartbeat
export const sendSupportHeartbeat = async (): Promise<void> => {
  try {
    await request('/support/heartbeat', {
      method: 'POST',
    });
  } catch {
    // Silently ignore heartbeat errors
  }
};

// Protected: mark agent offline
export const sendAgentOffline = async (): Promise<void> => {
  try {
    await request('/support/agent-offline', {
      method: 'POST',
    });
  } catch {
    // Silently ignore
  }
};

// Protected: list all conversations for admin
export const fetchAdminSupportConversations = async (): Promise<SupportConversation[]> => {
  const data = await request('/support/admin/conversations') as { conversations: SupportConversation[] };
  return data.conversations;
};

// Protected: get conversation detail with messages
export const fetchAdminSupportConversation = async (
  id: string
): Promise<{ conversation: SupportConversation; messages: SupportMessage[] }> => {
  return request(`/support/admin/conversations/${id}`) as Promise<{ conversation: SupportConversation; messages: SupportMessage[] }>;
};

// Protected: send staff reply
export const sendAdminSupportReply = async (
  conversationId: string,
  content: string
): Promise<SupportMessage> => {
  const data = await request(`/support/admin/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }) as { message: SupportMessage };
  return data.message;
};

// Protected: update conversation status
export const updateSupportConversationStatus = async (
  id: string,
  status: 'active' | 'waiting' | 'resolved' | 'closed'
): Promise<void> => {
  await request(`/support/admin/conversations/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
};
