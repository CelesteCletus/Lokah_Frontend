import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  BookOpen, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle,
  MapPin,
  Mail,
  Users,
  UserPlus,
  Briefcase,
  Download,
  History,
  Phone,
  Calendar,
  DollarSign,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Check,
  ExternalLink,
  Bold,
  Italic,
  List,
  Heading,
  Link,
  Quote,
  Image,
  FileText,
  Key,
  MessageSquare,
  Bell,
  Filter,
  Eye
} from 'lucide-react';
import { 
  getProperties, saveProperty, deleteProperty, 
  getBlogs, saveBlog, deleteBlog, Blog,
  logoutAdmin, checkAdminSession, changeAdminPassword,
  formatPriceINR,
  getEnquiries, updateEnquiryStatus, Enquiry,

  getConsultations, updateConsultationStatus, Consultation,
  getSiteVisits, updateSiteVisitStatus, SiteVisit,
  getAdminsList, createAdminAccount, removeAdminAccount, Admin,
  getJobsList, saveJobPosting, deleteJobPosting, getApplicationsList, Job, JobApplication,
  getDashboardStats, DashboardStats,
  fetchAdminSupportConversations, SupportConversation
} from '../../lib/db';
import type { Property } from '../../data/sampleData';
import LocationSelector from '../../components/Admin/LocationSelector';
import { normalizeAmenities } from '../../lib/propertyContent';
import StaffSupportDesk from '../../components/Admin/StaffSupportDesk';
import { API_URL } from '../../lib/apiUrl';

const extractLocationAndArea = (formattedAddress: string) => {
  const rawParts = formattedAddress.split(',').map(p => p.trim()).filter(Boolean);
  if (rawParts.length === 0) return { location: 'Kochi, Kerala', area: 'Kakkanad' };
  
  const area = rawParts[0];
  // Filter out pincodes (5-6 digit numbers) and country name
  const cleanParts = rawParts.filter(p => !/^\d{5,6}$/.test(p) && p.toLowerCase() !== 'india');
  
  let state = 'Kerala';
  if (cleanParts.length >= 2) {
    state = cleanParts[cleanParts.length - 1];
  }
  
  const location = `${area}, ${state}`;
  return { location, area };
};

export interface UnifiedEnquiry {
  id: string;
  rawId: number;
  sourceType: 'enquiries' | 'consultations' | 'site_visits';
  type: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  preferredDate: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'blogs' | 'crm' | 'careers' | 'admins' | 'logs' | 'settings' | 'support'>('properties');
  const [careersSubTab, setCareersSubTab] = useState<'postings' | 'applications'>('postings');
  
  // Data lists — owned locally (AdminDashboard is outside RootLayout)
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [unifiedEnquiries, setUnifiedEnquiries] = useState<UnifiedEnquiry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'pending' | 'contacted' | 'resolved'>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<UnifiedEnquiry | null>(null);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type?: 'enquiry' | 'support' } | null>(null);
  const prevEnquiryCountRef = useRef<number | null>(null);
  const prevSupportUnreadRef = useRef<number | null>(null);
  const prevSupportIdsRef = useRef<Set<string>>(new Set());
  const [unreadSupportCount, setUnreadSupportCount] = useState<number>(0);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  // Form modals state
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Redesign CMS Property States
  const [propBannerFile, setPropBannerFile] = useState<File | null>(null);
  const [propBannerPreview, setPropBannerPreview] = useState<string>('');
  const [propGalleryItems, setPropGalleryItems] = useState<{ id: string, type: 'remote' | 'local', url: string, file?: File }[]>([]);
  const [propBrochureFile, setPropBrochureFile] = useState<File | null>(null);
  const [propBrochureName, setPropBrochureName] = useState<string>('');
  const [propCoordinates, setPropCoordinates] = useState<{
    lat: number;
    lng: number;
    formatted_address?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [locationValidationError, setLocationValidationError] = useState<string | null>(null);
  const [propAmenities, setPropAmenities] = useState<string[]>([]);
  const [propAmenitiesSearch, setPropAmenitiesSearch] = useState('');
  const [propVirtualTour, setPropVirtualTour] = useState('');
  const [propFormPrice, setPropFormPrice] = useState(0);
  const [propDescLength, setPropDescLength] = useState(0);
  const [propFloorPlanFile, setPropFloorPlanFile] = useState<File | null>(null);
  const [propFloorPlanName, setPropFloorPlanName] = useState<string>('');

  // Password settings state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Redesign CMS Blog States
  const [blogBannerFile, setBlogBannerFile] = useState<File | null>(null);
  const [blogBannerPreview, setBlogBannerPreview] = useState<string>('');
  const [blogGalleryItems, setBlogGalleryItems] = useState<{ id: string, type: 'remote' | 'local', url: string, file?: File }[]>([]);
  const [blogPdfFile, setBlogPdfFile] = useState<File | null>(null);
  const [blogPdfName, setBlogPdfName] = useState<string>('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogSeoTitle, setBlogSeoTitle] = useState('');
  const [blogSeoDescription, setBlogSeoDescription] = useState('');
  const [blogSeoSlug, setBlogSeoSlug] = useState('');
  const [blogCategoryCustom, setBlogCategoryCustom] = useState('');
  const [blogCategorySelect, setBlogCategorySelect] = useState('Real Estate News');

  // Check Express server health and auth state on mount
  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        const healthRes = await fetch(`${API_URL}/health`, { credentials: 'include' });
        const online = healthRes.ok;
        if (!online) {
          if (isMounted) {
            setApiConnected(false);
            navigate('/team-login', { replace: true });
          }
          return;
        }

        if (isMounted) setApiConnected(true);

        try {
          const { admin } = await checkAdminSession();
          if (isMounted) {
            setCurrentAdmin(admin);
            setAuthChecked(true);
          }
        } catch (authErr) {
          if (isMounted) {
            navigate('/team-login', { replace: true });
          }
          return;
        }
      } catch (err) {
        if (isMounted) {
          setApiConnected(false);
          navigate('/team-login', { replace: true });
        }
      }
    };
    initSession();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Toast notification timer
  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => setNotificationToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // Play an audible chime for live alerts
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext might be restricted until user interacts with the page
    }
  };

  // Master refresh function for customer enquiries & live stats & support chat
  const refreshEnquiriesAndStats = async () => {
    if (!apiConnected || !authChecked || !currentAdmin) return;
    try {
      const [enqRes, conRes, svRes, dashboardStats, supportConvs] = await Promise.all([
        getEnquiries().catch(() => []),
        getConsultations().catch(() => []),
        getSiteVisits().catch(() => []),
        getDashboardStats().catch(() => null),
        fetchAdminSupportConversations().catch(() => []),
      ]);

      if (dashboardStats) {
        setStats(dashboardStats);
      }

      // Check Live Support conversations
      if (Array.isArray(supportConvs)) {
        let totalUnread = 0;
        let newSupportConv: SupportConversation | null = null;
        let hasNewUnread = false;

        supportConvs.forEach((c) => {
          totalUnread += c.unread_count || 0;
          if (prevSupportIdsRef.current.size > 0 && !prevSupportIdsRef.current.has(c.id)) {
            newSupportConv = c;
          }
        });

        if (prevSupportUnreadRef.current !== null && totalUnread > prevSupportUnreadRef.current) {
          hasNewUnread = true;
        }

        if (newSupportConv) {
          playNotificationSound();
          setNotificationToast({
            message: `💬 Live Support requested by ${(newSupportConv as SupportConversation).visitor_name || 'Visitor'}!`,
            type: 'support',
          });
        } else if (hasNewUnread) {
          playNotificationSound();
          setNotificationToast({
            message: `💬 New message received in Live Support!`,
            type: 'support',
          });
        }

        prevSupportIdsRef.current = new Set(supportConvs.map((c) => c.id));
        prevSupportUnreadRef.current = totalUnread;
        setUnreadSupportCount(totalUnread);
      }

      const combined: UnifiedEnquiry[] = [
        ...(Array.isArray(enqRes) ? enqRes : []).map((e: any) => ({
          id: `enquiry-${e.id}`,
          rawId: e.id,
          sourceType: 'enquiries' as const,
          type: e.project_interest ? 'Property Inquiry' : 'General Enquiry',
          name: e.name || 'Anonymous',
          phone: e.phone || '-',
          email: e.email || '-',
          category: e.project_interest || 'General Inquiry',
          preferredDate: '-',
          message: e.message || 'No additional message',
          status: e.status || 'pending',
          createdAt: e.created_at || new Date().toISOString(),
        })),
        ...(Array.isArray(conRes) ? conRes : []).map((c: any) => ({
          id: `consultation-${c.id}`,
          rawId: c.id,
          sourceType: 'consultations' as const,
          type: 'Consultation Booking',
          name: c.name || 'Anonymous',
          phone: c.phone || '-',
          email: c.email || '-',
          category: c.project_type || 'General Advisory / Custom Build',
          preferredDate: c.preferred_date ? (isNaN(Date.parse(c.preferred_date)) ? c.preferred_date : new Date(c.preferred_date).toLocaleDateString()) : 'Flexible',
          message: c.message || (c.budget && c.budget !== 'Not specified' ? c.budget : 'No additional message'),
          status: c.status || 'pending',
          createdAt: c.created_at || new Date().toISOString(),
        })),
        ...(Array.isArray(svRes) ? svRes : []).map((sv: any) => ({
          id: `sitevisit-${sv.id}`,
          rawId: sv.id,
          sourceType: 'site_visits' as const,
          type: 'Site Visit Request',
          name: sv.name || 'Anonymous',
          phone: sv.phone || '-',
          email: sv.email || '-',
          category: sv.project_name || 'Property Site Visit',
          preferredDate: sv.visit_date ? (isNaN(Date.parse(sv.visit_date)) ? sv.visit_date : new Date(sv.visit_date).toLocaleDateString()) : 'To be scheduled',
          message: sv.message || 'No additional message',
          status: (sv.status === 'scheduled' || sv.status === 'pending') ? 'pending' : (sv.status || 'pending'),
          createdAt: sv.created_at || new Date().toISOString(),
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Trigger notification if total enquiry count increased
      if (prevEnquiryCountRef.current !== null && combined.length > prevEnquiryCountRef.current) {
        const latest = combined[0];
        playNotificationSound();
        setNotificationToast({
          message: `🔔 New Customer Enquiry received from ${latest.name}! (${latest.type})`,
          type: 'enquiry',
        });
      }
      prevEnquiryCountRef.current = combined.length;
      setUnifiedEnquiries(combined);
    } catch (err) {
      console.error('Error refreshing customer enquiries & support:', err);
    }
  };

  // Real-time auto-polling & submission event listener
  useEffect(() => {
    if (!apiConnected || !authChecked || !currentAdmin) return;

    refreshEnquiriesAndStats();

    // Auto-poll every 3.5 seconds for instant updates & notifications
    const pollTimer = setInterval(() => {
      refreshEnquiriesAndStats();
    }, 3500);

    const handleCustomSubmission = (e: any) => {
      refreshEnquiriesAndStats();
      if (e?.detail?.name) {
        playNotificationSound();
        setNotificationToast({
          message: `🔔 New Customer Enquiry received from ${e.detail.name}!`,
          type: 'enquiry',
        });
      }
    };

    window.addEventListener('new_enquiry_submitted', handleCustomSubmission);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('new_enquiry_submitted', handleCustomSubmission);
    };
  }, [apiConnected, authChecked, currentAdmin]);

  // Fetch data
  useEffect(() => {
    if (!authChecked || !currentAdmin) return;
    fetchData();
  }, [activeTab, careersSubTab, apiConnected, authChecked, currentAdmin]);

  const fetchData = async () => {
    if (!authChecked || !currentAdmin) return;
    setLoading(true);
    try {
      if (activeTab === 'properties') {
        const propsData = await getProperties();
        setProperties(propsData);
      } else if (activeTab === 'blogs') {
        const blogsData = await getBlogs();
        setBlogs(blogsData);
      } else if (activeTab === 'careers') {
        if (apiConnected) {
          if (careersSubTab === 'postings') {
            const data = await getJobsList(true);
            setJobs(data);
          } else if (careersSubTab === 'applications') {
            const data = await getApplicationsList();
            setApplications(data);
          }
        }
      } else if (activeTab === 'admins') {
        if (apiConnected) {
          const list = await getAdminsList();
          setAdmins(list);
        }
      }

      if (apiConnected) {
        await refreshEnquiriesAndStats();
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUnifiedStatus = async (item: UnifiedEnquiry, newStatus: string) => {
    try {
      if (item.sourceType === 'enquiries') {
        await updateEnquiryStatus(item.rawId, { status: newStatus });
      } else if (item.sourceType === 'consultations') {
        await updateConsultationStatus(item.rawId, { status: newStatus });
      } else if (item.sourceType === 'site_visits') {
        await updateSiteVisitStatus(item.rawId, { status: newStatus });
      }
      await refreshEnquiriesAndStats();
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  const handleLogout = async () => {
    try {
      if (apiConnected) {
        await logoutAdmin();
      }
      localStorage.removeItem('lokah_sandbox_session');
      sessionStorage.removeItem('lokah_admin_auth');
      navigate('/team-login');
    } catch (err) {
      localStorage.removeItem('lokah_sandbox_session');
      navigate('/team-login');
    }
  };

  /* ============================================================================
     PROPERTY CRUD
     ============================================================================ */
  const handleOpenPropertyModal = (property: Property | null = null) => {
    setSelectedProperty(property);
    setPropBannerFile(null);
    setPropBannerPreview(property?.image || '');
    setPropGalleryItems(property?.images.map((img, idx) => ({ id: `remote-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type: 'remote', url: img })) || []);
    setPropBrochureFile(null);
    setPropBrochureName(property?.brochurePdf ? property.brochurePdf.split('/').pop() || 'brochure.pdf' : '');
    setPropCoordinates(property?.coordinates || null);
    setLocationValidationError(null);
    setPropAmenities(normalizeAmenities(property?.amenities || []));
    setPropAmenitiesSearch('');
    setPropVirtualTour(property?.virtualTourLink || '');
    setPropFormPrice(property?.price || 0);
    setPropDescLength(property?.description?.length || 0);
    setPropFloorPlanFile(null);
    setPropFloorPlanName(property?.floorPlan ? property.floorPlan.split('/').pop() || 'floor-plan.jpg' : '');
    setPropertyModalOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      
      const numericalPrice = Number(formData.get('price'));
      const isFeatured = formData.get('featured') === 'true';

      // Use the existing preview URL (remote URL) for the hero image if no new file was uploaded.
      // If a new file was picked, pass it via filesPayload — the backend handles storing it.
      const heroImageUrl = propBannerPreview || '/images/projects/completed-1.jpg';

      // For gallery: keep existing remote URLs as-is; new local files go into filesPayload.
      const galleryUrls: string[] = propGalleryItems
        .filter(item => item.type === 'remote')
        .map(item => item.url);

      // Validate that a location has been selected
      if (!propCoordinates || !propCoordinates.lat) {
        setLocationValidationError('A verified location is required to publish this property.');
        alert('Validation Error: A verified location is required. Please search for a location or drop a pin on the map.');
        const locElement = document.getElementById('location-tools-section');
        if (locElement) {
          locElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const addressInfo = propCoordinates.formatted_address 
        ? extractLocationAndArea(propCoordinates.formatted_address)
        : { 
            location: selectedProperty?.location || 'Kochi, Kerala', 
            area: selectedProperty?.area || 'Kakkanad' 
          };

      const propPayload: Property = {
        id: selectedProperty?.id || 0,
        name: formData.get('name') as string,
        type: formData.get('type') as any,
        status: formData.get('status') as any,
        location: addressInfo.location,
        area: addressInfo.area,
        price: numericalPrice,
        priceDisplay: formatPriceINR(numericalPrice),
        bhk: formData.get('bhk') as string,
        sqft: Number(formData.get('sqft')),
        landArea: (formData.get('landArea') as string) || undefined,
        image: heroImageUrl,
        images: galleryUrls,
        amenities: normalizeAmenities(propAmenities),
        description: formData.get('description') as string,
        tagline: (formData.get('tagline') as string) || '',
        story: (formData.get('story') as string) || '',
        nearby: selectedProperty?.nearby || [],
        featured: isFeatured,
        coordinates: propCoordinates!,
        brochurePdf: selectedProperty?.brochurePdf || '',
        virtualTourLink: propVirtualTour,
        floorPlan: selectedProperty?.floorPlan || ''
      };

      // Pass the actual File objects to saveProperty — it builds FormData and streams
      // them to the server. No base64 conversion = no memory crash.
      const filesPayload = {
        heroImage: propBannerFile || undefined,
        gallery: propGalleryItems.filter(item => item.type === 'local').map(item => item.file) as File[],
        brochure: propBrochureFile || undefined,
        floorPlan: propFloorPlanFile || undefined
      };

      await saveProperty(propPayload, filesPayload);
      setPropertyModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save property listing: ${err.message || err}`);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      try {
        await deleteProperty(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete property.');
      }
    }
  };

  /* ============================================================================
     BLOG CRUD
     ============================================================================ */
  const handleOpenBlogModal = (blog: Blog | null = null) => {
    setSelectedBlog(blog);
    setBlogBannerFile(null);
    setBlogBannerPreview(blog?.image || '');
    setBlogGalleryItems(blog?.galleryImages?.map((img, idx) => ({ id: `remote-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, type: 'remote', url: img })) || []);
    setBlogPdfFile(null);
    setBlogPdfName(blog?.pdfAttachment ? blog.pdfAttachment.split('/').pop() || 'attachment.pdf' : '');
    setBlogExcerpt(blog?.excerpt || '');
    setBlogContent(blog?.content || '');
    setBlogSeoTitle(blog?.seoTitle || blog?.title || '');
    setBlogSeoDescription(blog?.seoDescription || blog?.excerpt || '');
    setBlogSeoSlug(blog?.slug || '');
    
    const standardCategories = ['Real Estate News', 'Market Trends', 'Investment', 'Buying Guide', 'Interior Design', 'Company Updates'];
    if (blog && !standardCategories.includes(blog.category)) {
      setBlogCategorySelect('Custom');
      setBlogCategoryCustom(blog.category);
    } else {
      setBlogCategorySelect(blog?.category || 'Real Estate News');
      setBlogCategoryCustom('');
    }
    setBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const category = blogCategorySelect === 'Custom' ? blogCategoryCustom : blogCategorySelect;

      // Use the existing preview URL; new file uploads go via filesPayload to the server.
      const bannerUrl = blogBannerPreview || '/images/blog/blog-1.jpg';

      // Keep only existing remote gallery URLs; new local files go into filesPayload.
      const galleryUrls: string[] = blogGalleryItems
        .filter(item => item.type === 'remote')
        .map(item => item.url);

      const blogPayload: Blog = {
        id: selectedBlog?.id || 0,
        title: formData.get('title') as string,
        category: category || 'Real Estate News',
        author: (formData.get('author') as string) || 'Lokah Builders Team',
        excerpt: blogExcerpt,
        image: bannerUrl,
        content: blogContent,
        featured: formData.get('featured') === 'true',
        publishStatus: (formData.get('publishStatus') as any) || 'published',
        seoTitle: blogSeoTitle || formData.get('title') as string,
        seoDescription: blogSeoDescription || blogExcerpt,
        slug: blogSeoSlug || '',
        galleryImages: galleryUrls,
        pdfAttachment: selectedBlog?.pdfAttachment || ''
      };

      const filesPayload = {
        featuredImage: blogBannerFile || undefined,
        pdfAttachment: blogPdfFile || undefined,
        gallery: blogGalleryItems.filter(item => item.type === 'local').map(item => item.file) as File[]
      };

      await saveBlog(blogPayload, filesPayload);
      setBlogModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save blog post: ${err.message || err}`);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete blog.');
      }
    }
  };

  /* ============================================================================
     CRM Lead Operations
     ============================================================================ */
  const handleUpdateEnquiryStatus = async (id: number, status: 'pending' | 'contacted' | 'resolved', notes: string) => {
    try {
      await updateEnquiryStatus(id, { status, notes });
      fetchData();
    } catch (err) {
      alert('Failed to update enquiry status.');
    }
  };

  const handleUpdateConsultationStatus = async (id: number, status: 'pending' | 'contacted' | 'resolved') => {
    try {
      await updateConsultationStatus(id, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update consultation status.');
    }
  };

  const handleUpdateSiteVisitStatus = async (id: number, status: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      await updateSiteVisitStatus(id, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update site visit status.');
    }
  };

  /* ============================================================================
     Career Positions CRUD
     ============================================================================ */
  const handleOpenJobModal = (job: Job | null = null) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requirementsStr = formData.get('requirements') as string;
    const reqsArr = requirementsStr.split(',').map(r => r.trim()).filter(r => r !== '');

    const jobPayload = {
      id: selectedJob?.id || 0,
      title: formData.get('title') as string,
      department: formData.get('department') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
      requirements: reqsArr,
      experience: formData.get('experience') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as any || 'open'
    };

    try {
      await saveJobPosting(jobPayload);
      setJobModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save job posting.');
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (window.confirm('Delete this career posting?')) {
      try {
        await deleteJobPosting(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete job posting.');
      }
    }
  };

  /* ============================================================================
     Admin Management
     ============================================================================ */
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminAccount({
        username: newAdminUsername,
        email: newAdminEmail,
        password: newAdminPassword,
        role: 'admin'
      });
      setAdminModalOpen(false);
      setNewAdminUsername('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create admin account.');
    }
  };

  const handleRemoveAdmin = async (id: number) => {
    if (window.confirm('Deactivate this administrator account?')) {
      try {
        await removeAdminAccount(id);
        fetchData();
      } catch (err: any) {
        alert(err.message || 'Failed to deactivate admin.');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage(null);

    if (newPassword !== confirmPassword) {
      setSettingsMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setSettingsMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }

    setSettingsLoading(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setSettingsMessage({ text: 'Password updated successfully.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSettingsMessage({ text: err.message || 'Failed to update password.', type: 'error' });
    } finally {
      setSettingsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-matte-black text-ivory-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-xs text-ivory-400 tracking-wider uppercase">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-matte-black text-ivory-100 relative">
      {/* Real-time Notification Toast Banner */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={() => {
              if (notificationToast.type === 'support') {
                setActiveTab('support');
              } else if (notificationToast.type === 'enquiry') {
                setActiveTab('crm');
              }
              setNotificationToast(null);
            }}
            className="fixed top-6 right-6 z-[999] p-4 rounded-2xl bg-matte-950 border border-gold-500/50 text-ivory-100 shadow-2xl flex items-center gap-3 max-w-md backdrop-blur-2xl cursor-pointer hover:border-gold-400 transition-all hover:scale-[1.02]"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 animate-pulse ${
              notificationToast.type === 'support'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
            }`}>
              {notificationToast.type === 'support' ? (
                <MessageSquare className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 text-xs font-body min-w-0">
              <p className="font-semibold text-gold-400 text-sm mb-0.5 flex items-center gap-2">
                <span>{notificationToast.type === 'support' ? 'Live Support Alert' : 'New Client Enquiry'}</span>
                <span className="text-[10px] text-ivory-400 font-normal underline">Click to view</span>
              </p>
              <p className="text-ivory-200 leading-snug">{notificationToast.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotificationToast(null);
              }}
              className="text-ivory-400 hover:text-ivory-100 p-1 text-xs font-bold cursor-pointer shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 lg:px-8 pt-10 pb-16">
      {/* Top Banner Status */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="glass-card p-5 border border-gold-500/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-ivory-450 mb-0.5">Properties Portfolio</p>
              <h4 className="font-display text-lg font-bold text-gradient-gold">
                {stats?.totalProperties || 0} Listings
              </h4>
            </div>
          </div>

          <div className="glass-card p-5 border border-gold-500/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-ivory-450 mb-0.5">Customer Enquiries</p>
              <h4 className="font-display text-lg font-bold text-gradient-gold">
                {unifiedEnquiries.filter(e => e.status === 'pending').length} Pending
              </h4>
            </div>
          </div>

          <div className="glass-card p-5 border border-gold-500/10 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-450">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-ivory-450 mb-0.5">Insights Articles</p>
              <h4 className="font-display text-lg font-bold text-gradient-gold">
                {stats?.blogs || 0} Published
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* SIDE BAR NAVIGATION */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="glass-card p-6 border border-gold-500/10 space-y-6">
            <div>
              <img src="/logo.png" alt="Lokah Builders & Developers" className="h-10 w-auto object-contain mb-3" />
              <h2 className="font-display text-base font-semibold text-ivory-50">MANAGEMENT CONSOLE</h2>
              {currentAdmin && (
                <p className="font-body text-[10px] text-champagne-400 uppercase tracking-wider font-semibold mt-1">
                  Active: {currentAdmin.username}
                </p>
              )}
            </div>

            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('properties')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                  activeTab === 'properties' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1 min-w-0 leading-tight">Properties</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                  activeTab === 'blogs' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1 min-w-0 leading-tight">Insights Blog</span>
              </button>

              <button
                onClick={() => setActiveTab('crm')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all relative ${
                  activeTab === 'crm' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1 min-w-0 leading-tight">Customer Enquiries</span>
                {unifiedEnquiries.filter(e => e.status === 'pending').length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'crm' ? 'bg-matte-black text-gold-400' : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {unifiedEnquiries.filter(e => e.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('careers')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                  activeTab === 'careers' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1 min-w-0 leading-tight">Careers</span>
              </button>

              {apiConnected && (
                <>
                  <button
                    onClick={() => setActiveTab('admins')}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                      activeTab === 'admins' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span className="text-left flex-1 min-w-0 leading-tight">Admins Console</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('logs')}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                      activeTab === 'logs' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                    }`}
                  >
                    <History className="w-4 h-4 shrink-0" />
                    <span className="text-left flex-1 min-w-0 leading-tight">Audit Logs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all ${
                      activeTab === 'settings' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                    }`}
                  >
                    <Key className="w-4 h-4 shrink-0" />
                    <span className="text-left flex-1 min-w-0 leading-tight">Change Password</span>
                  </button>
                </>
              )}

              {/* Live Support — always visible */}
              <button
                onClick={() => setActiveTab('support')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs tracking-wider uppercase font-semibold transition-all relative ${
                  activeTab === 'support' ? 'bg-gradient-gold text-matte-black shadow-gold' : 'text-ivory-300 hover:text-ivory-50 hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1 min-w-0 leading-tight">Live Support</span>
                {unreadSupportCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'support' ? 'bg-matte-black text-emerald-400' : 'bg-emerald-500 text-white animate-pulse'
                  }`}>
                    {unreadSupportCount}
                  </span>
                )}
              </button>
            </nav>

            <div className="pt-6 border-t border-ivory-400/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-500/20 hover:bg-red-500/10 text-red-400 font-body text-xs tracking-wider uppercase font-semibold rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Portal</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENT PANEL */}
        <main className="flex-grow">
          {loading ? (
            <div className="glass-card p-12 text-center border border-gold-500/10">
              <div className="animate-spin w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="font-body text-xs text-ivory-450">Synchronizing database assets...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TAB: PROPERTIES */}
              {activeTab === 'properties' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                      <h3 className="font-display text-2xl font-light text-ivory-50">Property Portfolio</h3>
                      <p className="font-body text-xs text-ivory-450 font-light mt-1">
                        Add, remove or edit property details.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenPropertyModal(null)}
                      className="btn-primary py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Listing</span>
                    </button>
                  </div>

                  {properties.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-ivory-400/10 rounded-2xl">
                      <p className="font-body text-xs text-ivory-400">No properties in portfolio. Click Add Listing to begin.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-body">
                        <thead>
                          <tr className="border-b border-ivory-400/15 text-gold-450 tracking-wider uppercase text-[10px] font-semibold">
                            <th className="py-4 pr-4">Property</th>
                            <th className="py-4 px-4">Location</th>
                            <th className="py-4 px-4">Type</th>
                            <th className="py-4 px-4">Status</th>
                            <th className="py-4 px-4">Price</th>
                            <th className="py-4 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map((prop) => (
                            <tr key={prop.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all">
                              <td className="py-4 pr-4 font-display text-sm font-semibold text-ivory-100 flex items-center gap-3">
                                <img
                                  src={prop.image}
                                  alt={prop.name}
                                  className="w-12 h-9 rounded object-cover border border-ivory-400/10 bg-matte-900"
                                />
                                <span>{prop.name}</span>
                              </td>
                              <td className="py-4 px-4 text-ivory-300 font-light">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
                                  {prop.area}, {prop.location.split(',')[0]}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-ivory-300 font-light">{prop.type}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${
                                  prop.status === 'Completed' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : prop.status === 'Ongoing'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                                }`}>
                                  {prop.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-semibold text-gold-400">{prop.priceDisplay}</td>
                              <td className="py-4 pl-4 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleOpenPropertyModal(prop)}
                                    className="p-2 border border-ivory-400/10 hover:border-gold-500/50 hover:text-gold-450 text-ivory-300 rounded-lg transition-all"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(prop.id)}
                                    className="p-2 border border-ivory-400/10 hover:border-red-500/50 hover:text-red-400 text-ivory-300 rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: BLOGS */}
              {activeTab === 'blogs' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                      <h3 className="font-display text-2xl font-light text-ivory-50">Insights Editor</h3>
                      <p className="font-body text-xs text-ivory-450 font-light mt-1">
                        Publish construction case studies, architectural guides, and updates.
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenBlogModal(null)}
                      className="btn-primary py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Write Article</span>
                    </button>
                  </div>

                  {blogs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-ivory-400/10 rounded-2xl">
                      <p className="font-body text-xs text-ivory-400">No blog posts found. Click Write Article to begin.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-body">
                        <thead>
                          <tr className="border-b border-ivory-400/15 text-gold-450 tracking-wider uppercase text-[10px] font-semibold">
                            <th className="py-4 pr-4">Article Title</th>
                            <th className="py-4 px-4">Category</th>
                            <th className="py-4 px-4">Author</th>
                            <th className="py-4 px-4">Publish Date</th>
                            <th className="py-4 pl-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((blog) => (
                            <tr key={blog.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all">
                              <td className="py-4 pr-4 font-display text-sm font-semibold text-ivory-100 flex items-center gap-3">
                                <img
                                  src={blog.image}
                                  alt={blog.title}
                                  className="w-12 h-9 rounded object-cover border border-ivory-400/10 bg-matte-900"
                                />
                                <span>{blog.title}</span>
                              </td>
                              <td className="py-4 px-4 text-ivory-300 font-light">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-charcoal-900 border border-ivory-400/10">
                                  {blog.category}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-ivory-300 font-light">{blog.author}</td>
                              <td className="py-4 px-4 text-ivory-300 font-light">{blog.date}</td>
                              <td className="py-4 pl-4 text-right">
                                <div className="inline-flex gap-2">
                                  <button
                                    onClick={() => handleOpenBlogModal(blog)}
                                    className="p-2 border border-ivory-400/10 hover:border-gold-500/50 hover:text-gold-450 text-ivory-300 rounded-lg transition-all"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="p-2 border border-ivory-400/10 hover:border-red-500/50 hover:text-red-400 text-ivory-300 rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CUSTOMER ENQUIRIES */}
              {activeTab === 'crm' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h3 className="font-display text-2xl font-light text-ivory-50 flex items-center gap-2.5">
                        <span>Customer Enquiries</span>
                        {unifiedEnquiries.filter(e => e.status === 'pending').length > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30 font-semibold animate-pulse">
                            {unifiedEnquiries.filter(e => e.status === 'pending').length} Pending
                          </span>
                        )}
                      </h3>
                      <p className="font-body text-xs text-ivory-450 font-light mt-1">
                        View and manage all customer enquiries, consultation bookings, and site visit requests in one single master inbox.
                      </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-matte-950 p-1.5 rounded-xl border border-white/5">
                      {(['all', 'pending', 'contacted', 'resolved'] as const).map((filterKey) => {
                        const count = filterKey === 'all' 
                          ? unifiedEnquiries.length 
                          : unifiedEnquiries.filter(e => e.status === filterKey).length;
                        return (
                          <button
                            key={filterKey}
                            onClick={() => setEnquiryFilter(filterKey)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-body uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                              enquiryFilter === filterKey
                                ? 'bg-gold-500 text-matte-black shadow-gold'
                                : 'text-ivory-400 hover:text-ivory-100 hover:bg-white/5'
                            }`}
                          >
                            <span>{filterKey}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              enquiryFilter === filterKey ? 'bg-matte-black/30 text-matte-black font-bold' : 'bg-white/10 text-ivory-300'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {!apiConnected ? (
                    <div className="text-center py-12 p-5 bg-gold-500/5 border border-gold-500/10 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-gold-450 mx-auto mb-3" />
                      <h4 className="font-display text-sm text-ivory-100">Customer Enquiries Offline</h4>
                      <p className="font-body text-xs text-ivory-450 mt-1 max-w-sm mx-auto">
                        Customer enquiries require the backend server to be online. Connect a database to manage enquiries.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {unifiedEnquiries.filter(item => enquiryFilter === 'all' || item.status === enquiryFilter).length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-ivory-400/10 rounded-2xl">
                          <Mail className="w-10 h-10 text-ivory-500/40 mx-auto mb-3" />
                          <p className="font-body text-xs text-ivory-400">No {enquiryFilter !== 'all' ? enquiryFilter : ''} customer enquiries found.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-body">
                            <thead>
                              <tr className="border-b border-ivory-400/15 text-gold-450 uppercase text-[10px] font-semibold">
                                <th className="py-4 pr-4">Applicant</th>
                                <th className="py-4 px-4">Enquiry Type &amp; Category</th>
                                <th className="py-4 px-4">Preferred Date</th>
                                <th className="py-4 px-4">Message Snippet</th>
                                <th className="py-4 px-4">Received Date</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 pl-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {unifiedEnquiries
                                .filter(item => enquiryFilter === 'all' || item.status === enquiryFilter)
                                .map(item => (
                                  <tr
                                    key={item.id}
                                    onClick={() => setSelectedEnquiry(item)}
                                    className="border-b border-ivory-400/5 hover:bg-gold-500/5 transition-all cursor-pointer group"
                                  >
                                    {/* APPLICANT */}
                                    <td className="py-3.5 pr-4 align-middle">
                                      <p className="font-semibold text-ivory-100 text-sm group-hover:text-gold-400 transition-colors">{item.name}</p>
                                      <p className="text-[11px] text-ivory-400 font-light truncate max-w-[170px]">
                                        {item.email && item.email !== '-' ? item.email : item.phone}
                                      </p>
                                    </td>

                                    {/* ENQUIRY TYPE & CATEGORY */}
                                    <td className="py-3.5 px-4 align-middle">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold tracking-wider mb-1 border ${
                                        item.type.includes('Consultation') ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' :
                                        item.type.includes('Site Visit') ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                                        'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                      }`}>
                                        {item.type}
                                      </span>
                                      <div className="font-medium text-ivory-200 text-xs truncate max-w-[180px]">
                                        {item.category}
                                      </div>
                                    </td>

                                    {/* PREFERRED DATE */}
                                    <td className="py-3.5 px-4 align-middle text-ivory-300 font-light whitespace-nowrap">
                                      <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                                        <span>{item.preferredDate}</span>
                                      </span>
                                    </td>

                                    {/* MESSAGE SNIPPET */}
                                    <td className="py-3.5 px-4 align-middle">
                                      <p className="text-ivory-300 text-xs font-light line-clamp-1 max-w-[220px]">
                                        {item.message}
                                      </p>
                                    </td>

                                    {/* RECEIVED DATE */}
                                    <td className="py-3.5 px-4 align-middle text-ivory-400 font-light text-[11px] whitespace-nowrap">
                                      {new Date(item.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </td>

                                    {/* STATUS */}
                                    <td className="py-3.5 px-4 align-middle" onClick={(e) => e.stopPropagation()}>
                                      <select
                                        value={item.status}
                                        onChange={(e) => handleUpdateUnifiedStatus(item, e.target.value)}
                                        className={`border py-1 px-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-gold-500 cursor-pointer ${
                                          item.status === 'pending' ? 'bg-red-500/10 text-red-300 border-red-500/30' :
                                          item.status === 'contacted' ? 'bg-gold-500/10 text-gold-300 border-gold-500/30' :
                                          item.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                                          'bg-charcoal-900 text-ivory-200 border-ivory-400/10'
                                        }`}
                                      >
                                        <option value="pending" className="bg-matte-950 text-red-300">Pending</option>
                                        <option value="contacted" className="bg-matte-950 text-gold-300">Contacted</option>
                                        <option value="in-progress" className="bg-matte-950 text-blue-300">In Progress</option>
                                        <option value="resolved" className="bg-matte-950 text-emerald-300">Resolved</option>
                                      </select>
                                    </td>

                                    {/* ACTION */}
                                    <td className="py-3.5 pl-4 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => setSelectedEnquiry(item)}
                                        className="px-3 py-1.5 rounded-lg border border-gold-500/20 hover:border-gold-500/50 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>View</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CAREERS BOARD */}
              {activeTab === 'careers' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="flex flex-col gap-4 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-light text-ivory-50">Careers Portal Console</h3>
                        <p className="font-body text-xs text-ivory-450 font-light mt-1">
                          Post job openings and download resumes submitted by applicants.
                        </p>
                      </div>
                      {careersSubTab === 'postings' && apiConnected && (
                        <button
                          onClick={() => handleOpenJobModal(null)}
                          className="btn-primary py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Post Job</span>
                        </button>
                      )}
                    </div>

                    <div className="flex border-b border-ivory-400/10 gap-4 mt-2">
                      <button
                        onClick={() => setCareersSubTab('postings')}
                        className={`pb-2.5 font-body text-xs tracking-wider uppercase font-semibold border-b-2 transition-all ${
                          careersSubTab === 'postings' ? 'border-gold-500 text-gold-400' : 'border-transparent text-ivory-400 hover:text-ivory-200'
                        }`}
                      >
                        Job Postings
                      </button>
                      <button
                        onClick={() => setCareersSubTab('applications')}
                        className={`pb-2.5 font-body text-xs tracking-wider uppercase font-semibold border-b-2 transition-all ${
                          careersSubTab === 'applications' ? 'border-gold-500 text-gold-400' : 'border-transparent text-ivory-400 hover:text-ivory-200'
                        }`}
                      >
                        Applications
                      </button>
                    </div>
                  </div>

                  {!apiConnected ? (
                    <div className="text-center py-12 p-5 bg-gold-500/5 border border-gold-500/10 rounded-2xl">
                      <AlertTriangle className="w-8 h-8 text-gold-450 mx-auto mb-3" />
                      <h4 className="font-display text-sm text-ivory-100">Careers Module Offline</h4>
                      <p className="font-body text-xs text-ivory-450 mt-1 max-w-sm mx-auto">
                        Career posting creation and applications retrieval require the PostgreSQL server to be online.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* SUBTAB: POSTINGS */}
                      {careersSubTab === 'postings' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-body">
                            <thead>
                              <tr className="border-b border-ivory-400/15 text-gold-450 uppercase text-[10px] font-semibold">
                                <th className="py-4 pr-4">Position Title</th>
                                <th className="py-4 px-4">Department</th>
                                <th className="py-4 px-4">Location</th>
                                <th className="py-4 px-4">Type</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 pl-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobs.map(job => (
                                <tr key={job.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all">
                                  <td className="py-4 pr-4 font-display text-sm font-semibold text-ivory-100">
                                    {job.title}
                                    <p className="text-[10px] text-ivory-450 font-body font-light mt-0.5">Exp: {job.experience}</p>
                                  </td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{job.department}</td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{job.location}</td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{job.type}</td>
                                  <td className="py-4 px-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold border ${
                                      job.status === 'open' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                      {job.status}
                                    </span>
                                  </td>
                                  <td className="py-4 pl-4 text-right">
                                    <div className="inline-flex gap-2">
                                      <button
                                        onClick={() => handleOpenJobModal(job)}
                                        className="p-2 border border-ivory-400/10 hover:border-gold-500/50 hover:text-gold-450 text-ivory-300 rounded-lg transition-all"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="p-2 border border-ivory-400/10 hover:border-red-500/50 hover:text-red-400 text-ivory-300 rounded-lg transition-all"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* SUBTAB: APPLICATIONS */}
                      {careersSubTab === 'applications' && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs font-body">
                            <thead>
                              <tr className="border-b border-ivory-400/15 text-gold-450 uppercase text-[10px] font-semibold">
                                <th className="py-4 pr-4">Applicant</th>
                                <th className="py-4 px-4">Position Applied</th>
                                <th className="py-4 px-4">Job Posting Title</th>
                                <th className="py-4 px-4">Submit Date</th>
                                <th className="py-4 pl-4 text-right">Resume</th>
                              </tr>
                            </thead>
                            <tbody>
                              {applications.map(app => (
                                <tr key={app.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all">
                                  <td className="py-4 pr-4">
                                    <p className="font-semibold text-ivory-100">{app.name}</p>
                                    <p className="text-[10px] text-ivory-400 flex items-center gap-1 mt-0.5">
                                      <Phone className="w-2.5 h-2.5 text-gold-500" /> {app.phone}
                                    </p>
                                    <p className="text-[10px] text-ivory-400 flex items-center gap-1 mt-0.5">
                                      <Mail className="w-2.5 h-2.5 text-gold-500" /> {app.email}
                                    </p>
                                  </td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{app.position}</td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{app.jobTitle || 'General Application'}</td>
                                  <td className="py-4 px-4 text-ivory-300 font-light">{new Date(app.created_at || '').toLocaleDateString()}</td>
                                  <td className="py-4 pl-4 text-right">
                                    <a
                                      href={`${API_URL.replace('/api', '')}${app.resumePath}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 py-1.5 px-3 border border-gold-500/20 hover:border-gold-500 hover:text-gold-400 rounded-lg text-[10px] font-semibold tracking-wider uppercase transition-all"
                                    >
                                      <Download className="w-3 h-3" /> CV
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ADMINS CONSOLE */}
              {activeTab === 'admins' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                      <h3 className="font-display text-2xl font-light text-ivory-50">Administrators Registry</h3>
                      <p className="font-body text-xs text-ivory-450 font-light mt-1">
                        Add new managers or deactivate administrator credentials.
                      </p>
                    </div>
                    <button
                      onClick={() => setAdminModalOpen(true)}
                      className="btn-primary py-2.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>New Admin</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-body">
                      <thead>
                        <tr className="border-b border-ivory-400/15 text-gold-450 uppercase text-[10px] font-semibold">
                          <th className="py-4 pr-4">Username</th>
                          <th className="py-4 px-4">Email</th>
                          <th className="py-4 px-4">Role</th>
                          <th className="py-4 px-4">Created Date</th>
                          <th className="py-4 pl-4 text-right">Deactivate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.map(admin => (
                          <tr key={admin.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all">
                            <td className="py-4 pr-4 font-display text-sm font-semibold text-ivory-100">{admin.username}</td>
                            <td className="py-4 px-4 text-ivory-300 font-light">{admin.email}</td>
                            <td className="py-4 px-4 text-ivory-300 font-light">
                              <span className="px-2 py-0.5 rounded text-[9px] bg-charcoal-900 border border-ivory-400/10 uppercase tracking-wider">
                                {admin.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-ivory-300 font-light">{new Date(admin.created_at || '').toLocaleDateString()}</td>
                            <td className="py-4 pl-4 text-right">
                              {currentAdmin && currentAdmin.id !== admin.id ? (
                                <button
                                  onClick={() => handleRemoveAdmin(admin.id)}
                                  className="p-2 border border-ivory-400/10 hover:border-red-500/50 hover:text-red-400 text-ivory-300 rounded-lg transition-all"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-ivory-500 font-light">Active Self</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: AUDIT LOGS */}
              {activeTab === 'logs' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10">
                  <div className="mb-8">
                    <h3 className="font-display text-2xl font-light text-ivory-50">Audit Trail</h3>
                    <p className="font-body text-xs text-ivory-450 font-light mt-1">
                      Monitor administrator activity logs and system queries history.
                    </p>
                  </div>

                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto hide-scrollbar">
                    <table className="w-full min-w-[850px] text-left border-collapse text-xs font-body">
                      <thead>
                        <tr className="border-b border-ivory-400/15 text-gold-450 uppercase text-[10px] font-semibold sticky top-0 bg-matte-950 z-10">
                          <th className="py-3 pr-4 pl-2 min-w-[160px]">Timestamp</th>
                          <th className="py-3 px-4 min-w-[180px]">Admin Email</th>
                          <th className="py-3 px-4 min-w-[130px]">Action</th>
                          <th className="py-3 px-4 min-w-[240px]">Details</th>
                          <th className="py-3 px-4 text-right min-w-[160px] whitespace-nowrap">IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.activityLogs?.map((log: any) => {
                          const rawIp = log.ip_address || '';
                          const formattedIp = (!rawIp || rawIp === '::1' || rawIp === '::ffff:127.0.0.1' || rawIp === '127.0.0.1')
                            ? '127.0.0.1 (Localhost)'
                            : rawIp.replace(/^::ffff:/, '');

                          return (
                            <tr key={log.id} className="border-b border-ivory-400/5 hover:bg-white/5 transition-all text-[11px]">
                              <td className="py-3 pr-4 pl-2 text-ivory-400 font-light whitespace-nowrap">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 font-semibold text-ivory-100">{log.admin_email || 'System'}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-semibold whitespace-nowrap ${
                                  log.action.includes('LOGIN') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  log.action.includes('DELETE') || log.action.includes('REMOVE') ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                  'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                                }`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-ivory-300 font-light">{log.details}</td>
                              <td className="py-3 px-4 text-right font-mono text-[11px] text-gold-450/90 whitespace-nowrap">
                                {formattedIp}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: CHANGE PASSWORD / SETTINGS */}
              {activeTab === 'settings' && (
                <div className="glass-card p-6 md:p-8 border border-gold-500/10 max-w-lg">
                  <div className="mb-8">
                    <h3 className="font-display text-2xl font-light text-ivory-50">Change Access Password</h3>
                    <p className="font-body text-xs text-ivory-450 font-light mt-1">
                      Update your administrator credentials below.
                    </p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5 text-left font-body text-xs">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium uppercase tracking-wider text-[10px]">Current Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-luxury py-2.5 px-4 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium uppercase tracking-wider text-[10px]">New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-luxury py-2.5 px-4 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium uppercase tracking-wider text-[10px]">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-luxury py-2.5 px-4 text-sm"
                      />
                    </div>

                    {settingsMessage && (
                      <p className={`text-xs font-body font-light ${settingsMessage.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {settingsMessage.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="btn-primary w-full py-3 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                    >
                      {settingsLoading ? (
                        <div className="w-4 h-4 border-2 border-matte-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Update Password</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: LIVE SUPPORT */}
              {activeTab === 'support' && (
                <div className="h-[70vh] flex flex-col">
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-light text-ivory-50">Live Support Desk</h3>
                    <p className="font-body text-xs text-ivory-450 font-light mt-1">
                      Respond to visitor chat requests in real time. Toggle your presence to go online or offline.
                    </p>
                  </div>
                  <div className="flex-1 min-h-0">
                    <StaffSupportDesk />
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>

      {/* ============================================================================
         PROPERTY MODAL EDITOR
         ============================================================================ */}
      <AnimatePresence>
        {propertyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
            onClick={() => setPropertyModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-matte-950 border border-gold-500/20 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-elegant hide-scrollbar"
            >
              <button
                onClick={() => setPropertyModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-400 hover:text-gold-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display text-2xl font-light text-gradient-gold mb-2">
                {selectedProperty ? 'Edit Property Listing' : 'Create Property Listing'}
              </h3>
              <p className="font-body text-[10px] text-ivory-450 uppercase tracking-widest mb-8">Property Management System</p>

              <form onSubmit={handleSaveProperty} className="space-y-8 font-body text-xs text-left">
                
                {/* PROPERTY OVERVIEW */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">PROPERTY OVERVIEW</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Property Name *</label>
                      <input
                        name="name"
                        required
                        defaultValue={selectedProperty?.name || ''}
                        placeholder="e.g. Infinity Sky Residences"
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-ivory-400 block mb-1.5 font-medium">Property Type *</label>
                        <select
                          name="type"
                          defaultValue={selectedProperty?.type || 'Villa'}
                          className="select-luxury py-2.5 px-4 block w-full"
                        >
                          <option value="Villa">Villa</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Land to Landmark">Land to Landmark</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-ivory-400 block mb-1.5 font-medium">Property Status *</label>
                        <select
                          name="status"
                          defaultValue={selectedProperty?.status || 'Ongoing'}
                          className="select-luxury py-2.5 px-4 block w-full"
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOCATION */}
                <div id="location-tools-section" className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <LocationSelector
                    coordinates={propCoordinates}
                    onChange={(coords) => {
                      setPropCoordinates(coords);
                      setLocationValidationError(null);
                    }}
                    validationError={locationValidationError}
                  />
                </div>

                {/* PROPERTY SPECIFICATIONS */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">PROPERTY SPECIFICATIONS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">BHK</label>
                      <select
                        name="bhk"
                        defaultValue={selectedProperty?.bhk || '3 BHK'}
                        className="select-luxury py-2.5 px-4 block w-full"
                      >
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                        <option value="5 BHK">5 BHK</option>
                        <option value="NA">NA (Plots)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Built Area (sqft)</label>
                      <input
                        name="sqft"
                        type="number"
                        defaultValue={selectedProperty?.sqft || 0}
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Price (Numerical INR) *</label>
                      <input
                        name="price"
                        type="number"
                        required
                        value={propFormPrice}
                        onChange={(e) => setPropFormPrice(Number(e.target.value))}
                        placeholder="e.g. 12500000"
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                      {propFormPrice > 0 && (
                        <div className="mt-2 text-[10px] text-gold-450 font-semibold tracking-wider flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Generated: <strong className="text-ivory-100">{formatPriceINR(propFormPrice)}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Land Area (Optional)</label>
                    <input
                      name="landArea"
                      defaultValue={selectedProperty?.landArea || ''}
                      placeholder="e.g. 15 Cents (for Plots/Villas)"
                      className="input-luxury py-2.5 px-4 block w-full"
                    />
                  </div>
                </div>

                {/* CINEMATIC TAGLINE & STORY NARRATIVE */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">HERO & STORY HIGHLIGHTS</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Hero Sub-Tagline / Quote</label>
                      <input
                        name="tagline"
                        defaultValue={selectedProperty?.tagline || ''}
                        placeholder='e.g. "A skyline residence built for modern family life."'
                        className="input-luxury py-2.5 px-4 block w-full text-xs"
                      />
                      <p className="text-[10px] text-ivory-450 font-light mt-1">Displayed underneath the property name on the cinematic property detail hero screen.</p>
                    </div>
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Story Narrative / Opening Statement</label>
                      <textarea
                        name="story"
                        rows={3}
                        defaultValue={selectedProperty?.story || ''}
                        placeholder='e.g. "More than a place to live, this is a space designed for the life that unfolds within it."'
                        className="textarea-luxury py-2.5 px-4 block w-full leading-relaxed text-xs"
                      />
                      <p className="text-[10px] text-ivory-450 font-light mt-1">Displayed as the primary opening quote narrative in "The Story" section.</p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">DESCRIPTION</h4>
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Property Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={5}
                      maxLength={1000}
                      defaultValue={selectedProperty?.description || ''}
                      onChange={(e) => setPropDescLength(e.target.value.length)}
                      placeholder="Detailed narrative describing the architecture, design aesthetic, and layouts..."
                      className="textarea-luxury py-2.5 px-4 block w-full leading-relaxed"
                    />
                    <div className="text-right text-[9px] text-ivory-450 mt-1">
                      {propDescLength}/1000 characters
                    </div>
                  </div>
                </div>

                {/* LIFESTYLE AMENITIES */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">LIFESTYLE AMENITIES</h4>
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Select Amenities</label>
                    {propAmenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {propAmenities.map((amenity) => (
                          <span key={amenity} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-full text-[10px] font-semibold">
                            {amenity}
                            <button
                              type="button"
                              onClick={() => setPropAmenities(prev => prev.filter(a => a !== amenity))}
                              className="text-gold-400 hover:text-red-400 transition-all font-bold cursor-pointer text-xs ml-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="relative">
                      <div className="flex gap-2">
                        <input
                          value={propAmenitiesSearch}
                          onChange={(e) => setPropAmenitiesSearch(e.target.value)}
                          placeholder="Type to search or add custom amenity..."
                          className="input-luxury py-2 px-4 flex-grow block w-full"
                        />
                        {propAmenitiesSearch && (
                          <button
                            type="button"
                            onClick={() => {
                              if (propAmenitiesSearch.trim() && !propAmenities.includes(propAmenitiesSearch.trim())) {
                                setPropAmenities(prev => [...prev, propAmenitiesSearch.trim()]);
                                setPropAmenitiesSearch('');
                              }
                            }}
                            className="px-4 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Add Custom
                          </button>
                        )}
                      </div>
                      {propAmenitiesSearch && (
                        <div className="absolute left-0 right-0 top-full z-10 mt-1 bg-matte-950 border border-gold-500/20 rounded-xl p-2 max-h-40 overflow-y-auto shadow-elegant">
                          {['Swimming Pool', 'Gym', 'Smart Home', 'Security', 'Club House', 'Children\'s Play Area', 'Parking', 'Garden', 'EV Charging', 'CCTV']
                            .filter(opt => opt.toLowerCase().includes(propAmenitiesSearch.toLowerCase()) && !propAmenities.includes(opt))
                            .map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setPropAmenities(prev => [...prev, opt]);
                                  setPropAmenitiesSearch('');
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-white/5 text-ivory-200 hover:text-gold-450 rounded-lg transition-all text-xs cursor-pointer"
                              >
                                + {opt}
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* VISUAL ASSETS */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-5">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">VISUAL ASSETS</h4>
                  
                  {/* Banner Upload */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Banner Hero Image *</label>
                    {propBannerPreview ? (
                      <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-gold-500/20 bg-matte-900">
                        <img src={propBannerPreview} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300">
                          <label className="cursor-pointer py-2.5 px-5 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold uppercase tracking-wider rounded-xl text-[10px] transition-all">
                            Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPropBannerFile(file);
                                  setPropBannerPreview(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setPropBannerFile(null);
                              setPropBannerPreview('');
                            }}
                            className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold uppercase tracking-wider rounded-xl text-[10px] transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-8 text-center bg-gold-500/5 transition-all">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-10 h-10 text-gold-450 mx-auto mb-2" />
                          <p className="text-xs text-ivory-100 font-medium">Drag and drop or click to upload banner</p>
                          <p className="text-[10px] text-ivory-450 mt-1 uppercase tracking-wider font-semibold">JPG, PNG or WEBP (Max 5MB)</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPropBannerFile(file);
                                setPropBannerPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Gallery Upload */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Gallery Portfolio Images</label>
                    <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-6 text-center bg-gold-500/5 transition-all mb-4">
                      <label className="cursor-pointer block">
                        <UploadCloud className="w-8 h-8 text-gold-450 mx-auto mb-2" />
                        <p className="text-xs text-ivory-100 font-medium">Upload Multiple Gallery Assets</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              const newItems = Array.from(files).map((file, idx) => ({
                                id: `local-${idx}-${Date.now()}`,
                                type: 'local' as const,
                                url: URL.createObjectURL(file),
                                file
                              }));
                              setPropGalleryItems(prev => [...prev, ...newItems]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {propGalleryItems.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1 border border-white/5 rounded-2xl bg-charcoal-950/20 hide-scrollbar">
                        {propGalleryItems.map((item, index) => (
                          <div key={item.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-matte-900">
                            <img src={item.url} alt="Gallery Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all duration-300">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => {
                                  const newItems = [...propGalleryItems];
                                  const temp = newItems[index];
                                  newItems[index] = newItems[index - 1];
                                  newItems[index - 1] = temp;
                                  setPropGalleryItems(newItems);
                                }}
                                className="p-1.5 bg-charcoal-900/80 border border-gold-500/20 hover:border-gold-500 rounded text-gold-450 disabled:opacity-30 disabled:border-transparent transition-all cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === propGalleryItems.length - 1}
                                onClick={() => {
                                  const newItems = [...propGalleryItems];
                                  const temp = newItems[index];
                                  newItems[index] = newItems[index + 1];
                                  newItems[index + 1] = temp;
                                  setPropGalleryItems(newItems);
                                }}
                                className="p-1.5 bg-charcoal-900/80 border border-gold-500/20 hover:border-gold-500 rounded text-gold-450 disabled:opacity-30 disabled:border-transparent transition-all cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPropGalleryItems(prev => prev.filter(i => i.id !== item.id))}
                                className="p-1.5 bg-charcoal-900/80 border border-red-500/20 hover:border-red-500 rounded text-red-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Brochure Upload */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Bespoke Project Brochure (PDF only)</label>
                    {propBrochureName ? (
                      <div className="flex items-center justify-between p-4 bg-gold-500/5 border border-gold-500/20 rounded-2xl">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-5 h-5 text-gold-400 shrink-0" />
                          <span className="text-xs text-ivory-200 truncate font-semibold">{propBrochureName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProperty?.brochurePdf && (
                            <a
                              href={selectedProperty.brochurePdf}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold uppercase tracking-wider rounded-lg text-[9px] flex items-center gap-1 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Preview PDF
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setPropBrochureFile(null);
                              setPropBrochureName('');
                            }}
                            className="py-1.5 px-3 bg-red-650/15 border border-red-500/20 hover:bg-red-500/10 text-red-400 font-semibold uppercase tracking-wider rounded-lg text-[9px] transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-5 text-center bg-gold-500/5 transition-all">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-8 h-8 text-gold-450 mx-auto mb-1.5" />
                          <p className="text-xs text-ivory-100 font-medium">Upload Technical PDF Brochure</p>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPropBrochureFile(file);
                                setPropBrochureName(file.name);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Floor Plan Upload */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Bespoke Floor Plan (Image or PDF)</label>
                    {propFloorPlanName ? (
                      <div className="flex items-center justify-between p-4 bg-gold-500/5 border border-gold-500/20 rounded-2xl">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-5 h-5 text-gold-400 shrink-0" />
                          <span className="text-xs text-ivory-200 truncate font-semibold">{propFloorPlanName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProperty?.floorPlan && (
                            <a
                              href={selectedProperty.floorPlan}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold uppercase tracking-wider rounded-lg text-[9px] flex items-center gap-1 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Preview Floor Plan
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setPropFloorPlanFile(null);
                              setPropFloorPlanName('');
                            }}
                            className="py-1.5 px-3 bg-red-650/15 border border-red-500/20 hover:bg-red-500/10 text-red-400 font-semibold uppercase tracking-wider rounded-lg text-[9px] transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-5 text-center bg-gold-500/5 transition-all">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-8 h-8 text-gold-450 mx-auto mb-1.5" />
                          <p className="text-xs text-ivory-100 font-medium">Upload Floor Plan Layout (JPG, PNG or PDF)</p>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPropFloorPlanFile(file);
                                setPropFloorPlanName(file.name);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Virtual Tour */}
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">360° Virtual Tour URL Link</label>
                    <div className="flex gap-2">
                      <input
                        value={propVirtualTour}
                        onChange={(e) => setPropVirtualTour(e.target.value)}
                        placeholder="e.g. https://my.matterport.com/show/?m=xxx"
                        className="input-luxury py-2.5 px-4 flex-grow block w-full"
                      />
                      {propVirtualTour && (
                        <a
                          href={propVirtualTour}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-4 bg-gold-500/15 border border-gold-500/20 hover:border-gold-500 text-gold-450 hover:bg-gold-500/25 rounded-xl font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Preview
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* VISIBILITY & PUBLISHING */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">VISIBILITY & PUBLISHING</h4>
                  <div className="flex items-center gap-4 p-4 bg-charcoal-950/20 border border-gold-500/10 rounded-2xl">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="featured"
                        value="true"
                        defaultChecked={selectedProperty?.featured}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-charcoal-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ivory-450 after:border-charcoal-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500 peer-checked:after:bg-matte-black"></div>
                    </label>
                    <div>
                      <span className="text-xs text-ivory-100 font-semibold block">Show on Homepage</span>
                      <span className="text-[10px] text-ivory-400 font-light mt-0.5 block">Show this property listing on the homepage featured carousel sections.</span>
                    </div>
                  </div>
                </div>

                {locationValidationError && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-[11px] font-body leading-relaxed text-left">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{locationValidationError}</span>
                  </div>
                )}

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setPropertyModalOpen(false)}
                    className="px-6 py-2.5 border border-white/10 hover:border-white/30 text-ivory-300 hover:text-white rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer text-[10px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Property</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================================
         BLOG MODAL EDITOR
         ============================================================================ */}
      <AnimatePresence>
        {blogModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
            onClick={() => setBlogModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-matte-950 border border-gold-500/20 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-elegant hide-scrollbar"
            >
              <button
                onClick={() => setBlogModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-400 hover:text-gold-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display text-2xl font-light text-gradient-gold mb-2">
                {selectedBlog ? 'Modify Insights Article' : 'Bespoke Insights Article'}
              </h3>
              <p className="font-body text-[10px] text-ivory-450 uppercase tracking-widest mb-8">Luxury Publisher CMS</p>

              <form onSubmit={handleSaveBlog} className="space-y-8 font-body text-xs text-left">
                
                {/* BLOG OVERVIEW */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">BLOG OVERVIEW</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Blog Title *</label>
                      <input
                        name="title"
                        required
                        defaultValue={selectedBlog?.title || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBlogSeoTitle(val);
                          setBlogSeoSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
                        }}
                        placeholder="e.g. Architectural Trends in Modern Villas"
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-ivory-400 block mb-1.5 font-medium">Category *</label>
                        <select
                          value={blogCategorySelect}
                          onChange={(e) => setBlogCategorySelect(e.target.value)}
                          className="select-luxury py-2.5 px-4 block w-full"
                        >
                          <option value="Real Estate News">Real Estate News</option>
                          <option value="Market Trends">Market Trends</option>
                          <option value="Investment">Investment</option>
                          <option value="Buying Guide">Buying Guide</option>
                          <option value="Interior Design">Interior Design</option>
                          <option value="Company Updates">Company Updates</option>
                          <option value="Custom">Custom Category</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-ivory-400 block mb-1.5 font-medium">Author Bylines</label>
                        <input
                          name="author"
                          defaultValue={selectedBlog?.author || 'Lokah Builders Team'}
                          placeholder="Lokah Builders Team"
                          className="input-luxury py-2.5 px-4 block w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {blogCategorySelect === 'Custom' && (
                    <div className="pt-2 animate-fadeIn">
                      <label className="text-ivory-400 block mb-1.5 font-medium">Custom Category Name *</label>
                      <input
                        required
                        value={blogCategoryCustom}
                        onChange={(e) => setBlogCategoryCustom(e.target.value)}
                        placeholder="e.g. Engineering Feats"
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Publish Date</label>
                      <input
                        type="date"
                        name="publishDate"
                        defaultValue={selectedBlog?.date ? new Date(selectedBlog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* VISUAL ASSETS */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">VISUAL ASSETS</h4>
                  
                  {/* Featured Image */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Featured Cover Image *</label>
                    {blogBannerPreview ? (
                      <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-gold-500/20 bg-matte-900">
                        <img src={blogBannerPreview} alt="Blog Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-300">
                          <label className="cursor-pointer py-2.5 px-5 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold uppercase tracking-wider rounded-xl text-[10px] transition-all">
                            Replace Cover
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setBlogBannerFile(file);
                                  setBlogBannerPreview(URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setBlogBannerFile(null);
                              setBlogBannerPreview('');
                            }}
                            className="py-2.5 px-5 bg-red-650 hover:bg-red-750 text-white font-semibold uppercase tracking-wider rounded-xl text-[10px] transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-8 text-center bg-gold-500/5 transition-all">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-10 h-10 text-gold-450 mx-auto mb-2" />
                          <p className="text-xs text-ivory-100 font-medium">Upload Featured Banner Cover</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setBlogBannerFile(file);
                                setBlogBannerPreview(URL.createObjectURL(file));
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Blog Gallery */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Additional Blog Images</label>
                    <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-6 text-center bg-gold-500/5 transition-all mb-4">
                      <label className="cursor-pointer block">
                        <UploadCloud className="w-8 h-8 text-gold-450 mx-auto mb-2" />
                        <p className="text-xs text-ivory-100 font-medium">Upload Additional Blog Visuals</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              const newItems = Array.from(files).map((file, idx) => ({
                                id: `local-${idx}-${Date.now()}`,
                                type: 'local' as const,
                                url: URL.createObjectURL(file),
                                file
                              }));
                              setBlogGalleryItems(prev => [...prev, ...newItems]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {blogGalleryItems.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1 border border-white/5 rounded-2xl bg-charcoal-950/20 hide-scrollbar">
                        {blogGalleryItems.map((item, index) => (
                          <div key={item.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-matte-900">
                            <img src={item.url} alt="Gallery Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-all duration-300">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => {
                                  const newItems = [...blogGalleryItems];
                                  const temp = newItems[index];
                                  newItems[index] = newItems[index - 1];
                                  newItems[index - 1] = temp;
                                  setBlogGalleryItems(newItems);
                                }}
                                className="p-1.5 bg-charcoal-900/80 border border-gold-500/20 hover:border-gold-500 rounded text-gold-450 disabled:opacity-30 disabled:border-transparent transition-all cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === blogGalleryItems.length - 1}
                                onClick={() => {
                                  const newItems = [...blogGalleryItems];
                                  const temp = newItems[index];
                                  newItems[index] = newItems[index + 1];
                                  newItems[index + 1] = temp;
                                  setBlogGalleryItems(newItems);
                                }}
                                className="p-1.5 bg-charcoal-900/80 border border-gold-500/20 hover:border-gold-500 rounded text-gold-450 disabled:opacity-30 disabled:border-transparent transition-all cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setBlogGalleryItems(prev => prev.filter(i => i.id !== item.id))}
                                className="p-1.5 bg-charcoal-900/80 border border-red-500/20 hover:border-red-500 rounded text-red-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">CONTENT</h4>
                  
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Short Excerpt (Max 200 chars) *</label>
                    <textarea
                      name="excerpt"
                      required
                      rows={2}
                      maxLength={200}
                      value={blogExcerpt}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlogExcerpt(val);
                        setBlogSeoDescription(val.substring(0, 160));
                      }}
                      placeholder="Brief article summary for card previews and meta descriptors..."
                      className="textarea-luxury py-2.5 px-4 block w-full leading-relaxed"
                    />
                    <div className="text-right text-[9px] text-ivory-450 mt-1">
                      {blogExcerpt.length}/200 characters
                    </div>
                  </div>

                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Blog Content *</label>
                    
                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-charcoal-950/80 border-x border-t border-gold-500/10 rounded-t-2xl">
                      {[
                        { icon: <Heading className="w-3.5 h-3.5" />, label: 'Heading', syntax: '### ' },
                        { icon: <Bold className="w-3.5 h-3.5" />, label: 'Bold', syntax: '**text**' },
                        { icon: <Italic className="w-3.5 h-3.5" />, label: 'Italic', syntax: '*text*' },
                        { icon: <List className="w-3.5 h-3.5" />, label: 'List', syntax: '- ' },
                        { icon: <Link className="w-3.5 h-3.5" />, label: 'Link', syntax: '[text](url)' },
                        { icon: <Quote className="w-3.5 h-3.5" />, label: 'Quote', syntax: '> ' },
                        { icon: <Image className="w-3.5 h-3.5" />, label: 'Image', syntax: '![alt](url)' },
                      ].map((btn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement;
                            if (!textarea) return;
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const text = textarea.value;
                            const before = text.substring(0, start);
                            const after = text.substring(end, text.length);
                            const selected = text.substring(start, end);
                            
                            let inserted = btn.syntax;
                            if (selected) {
                              if (btn.syntax.includes('text')) {
                                inserted = btn.syntax.replace('text', selected);
                              } else {
                                inserted = btn.syntax + selected;
                              }
                            }
                            
                            setBlogContent(before + inserted + after);
                            textarea.focus();
                          }}
                          className="p-1.5 hover:bg-white/5 text-ivory-450 hover:text-gold-450 rounded-lg transition-all flex items-center gap-1 text-[10px] cursor-pointer"
                          title={btn.label}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                    <textarea
                      id="blog-content-textarea"
                      name="content"
                      required
                      rows={12}
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write your article body content. Markdown syntax is fully supported."
                      className="textarea-luxury p-4 block w-full rounded-b-2xl border-t-0 font-mono text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* SEO METADATA */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">SEO METADATA</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">SEO Meta Title</label>
                      <input
                        value={blogSeoTitle}
                        onChange={(e) => setBlogSeoTitle(e.target.value)}
                        placeholder="Search engine meta title..."
                        className="input-luxury py-2.5 px-4 block w-full"
                      />
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">URL Slug</label>
                      <input
                        value={blogSeoSlug}
                        onChange={(e) => setBlogSeoSlug(e.target.value)}
                        placeholder="e.g. architectural-trends-in-modern-villas"
                        className="input-luxury py-2.5 px-4 block w-full font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Meta Description</label>
                    <textarea
                      rows={2}
                      value={blogSeoDescription}
                      onChange={(e) => setBlogSeoDescription(e.target.value)}
                      placeholder="Search engine description preview..."
                      className="textarea-luxury py-2.5 px-4 block w-full leading-relaxed"
                    />
                  </div>
                </div>

                {/* VISIBILITY & PUBLISHING */}
                <div className="bg-charcoal-900/40 p-5 rounded-2xl border border-white/5 space-y-5">
                  <h4 className="font-display text-sm text-gold-450 uppercase tracking-wider font-semibold border-b border-white/5 pb-2">VISIBILITY & PUBLISHING</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-charcoal-950/20 border border-gold-500/10 rounded-2xl">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          value="true"
                          defaultChecked={selectedBlog?.featured}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-charcoal-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ivory-450 after:border-charcoal-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500 peer-checked:after:bg-matte-black"></div>
                      </label>
                      <div>
                        <span className="text-xs text-ivory-100 font-semibold block">Featured Article</span>
                        <span className="text-[10px] text-ivory-400 font-light mt-0.5 block">Pin this article to the top of the blog homepage listings.</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Publishing Status</label>
                      <select
                        name="publishStatus"
                        defaultValue={selectedBlog?.publishStatus || 'published'}
                        className="select-luxury py-2.5 px-4 block w-full"
                      >
                        <option value="draft">Draft (Private)</option>
                        <option value="published">Published (Public)</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </div>
                  </div>

                  {/* PDF Attachment Upload */}
                  <div>
                    <label className="text-ivory-400 block mb-2 font-medium">Additional Document Attachment (e.g. market reports, investment guides PDF)</label>
                    {blogPdfName ? (
                      <div className="flex items-center justify-between p-4 bg-gold-500/5 border border-gold-500/20 rounded-2xl">
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          <FileText className="w-5 h-5 text-gold-400 shrink-0" />
                          <span className="text-xs text-ivory-200 truncate font-semibold">{blogPdfName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedBlog?.pdfAttachment && (
                            <a
                              href={selectedBlog.pdfAttachment}
                              target="_blank"
                              rel="noreferrer"
                              className="py-1.5 px-3 bg-gold-500 hover:bg-gold-600 text-matte-black font-semibold uppercase tracking-wider rounded-lg text-[9px] flex items-center gap-1 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Preview PDF
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setBlogPdfFile(null);
                              setBlogPdfName('');
                            }}
                            className="py-1.5 px-3 bg-red-650/15 border border-red-500/20 hover:bg-red-500/10 text-red-400 font-semibold uppercase tracking-wider rounded-lg text-[9px] transition-all cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gold-500/20 hover:border-gold-500/50 rounded-2xl p-5 text-center bg-gold-500/5 transition-all">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-8 h-8 text-gold-450 mx-auto mb-1.5" />
                          <p className="text-xs text-ivory-100 font-medium">Upload PDF Report Attachment</p>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setBlogPdfFile(file);
                                setBlogPdfName(file.name);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setBlogModalOpen(false)}
                    className="px-6 py-2.5 border border-white/10 hover:border-white/30 text-ivory-300 hover:text-white rounded-xl transition-all cursor-pointer font-semibold uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer text-[10px]"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Blog Article</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================================
         JOB POSTING MODAL
         ============================================================================ */}
      <AnimatePresence>
        {jobModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
            onClick={() => setJobModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-matte-950 border border-gold-500/20 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-elegant hide-scrollbar"
            >
              <button
                onClick={() => setJobModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-400 hover:text-gold-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display text-2xl font-light text-ivory-50 mb-6">
                {selectedJob ? 'Modify Job Posting' : 'Post New Career Position'}
              </h3>

              <form onSubmit={handleSaveJob} className="space-y-5 font-body text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Position Title</label>
                    <input
                      name="title"
                      required
                      defaultValue={selectedJob?.title || ''}
                      placeholder="e.g. Senior Quantity Surveyor"
                      className="input-luxury py-2.5 px-4"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Department</label>
                      <input
                        name="department"
                        defaultValue={selectedJob?.department || ''}
                        placeholder="e.g. Engineering"
                        className="input-luxury py-2.5 px-4"
                      />
                    </div>
                    <div>
                      <label className="text-ivory-400 block mb-1.5 font-medium">Job Type</label>
                      <input
                        name="type"
                        defaultValue={selectedJob?.type || 'Full-time'}
                        placeholder="e.g. Full-time, Contract"
                        className="input-luxury py-2.5 px-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Location</label>
                    <input
                      name="location"
                      defaultValue={selectedJob?.location || 'Kochi, Kerala'}
                      className="input-luxury py-2.5 px-4"
                    />
                  </div>

                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Experience Required</label>
                    <input
                      name="experience"
                      defaultValue={selectedJob?.experience || '5+ Years'}
                      className="input-luxury py-2.5 px-4"
                    />
                  </div>

                  <div>
                    <label className="text-ivory-400 block mb-1.5 font-medium">Position Status</label>
                    <select
                      name="status"
                      defaultValue={selectedJob?.status || 'open'}
                      className="select-luxury py-2.5 px-4 block w-full"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-ivory-400 block mb-1.5 font-medium">Requirements (Comma-separated)</label>
                  <input
                    name="requirements"
                    defaultValue={selectedJob?.requirements.join(', ') || ''}
                    placeholder="B.Tech in Civil, AutoCAD, Billing Software"
                    className="input-luxury py-2.5 px-4"
                  />
                </div>

                <div>
                  <label className="text-ivory-400 block mb-1.5 font-medium">Job Description & Responsibilities</label>
                  <textarea
                    name="description"
                    rows={6}
                    required
                    defaultValue={selectedJob?.description || ''}
                    placeholder="Outline day-to-day operations and deliverables..."
                    className="textarea-luxury py-2.5 px-4"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setJobModalOpen(false)}
                    className="px-5 py-2.5 border border-ivory-400/10 hover:border-ivory-400/30 text-ivory-300 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish Position</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================================
         CREATE ADMIN MODAL
         ============================================================================ */}
      <AnimatePresence>
        {adminModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setAdminModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-matte-950 border border-gold-500/20 rounded-3xl p-6 md:p-8 shadow-elegant"
            >
              <button
                onClick={() => setAdminModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-ivory-400/10 hover:border-gold-500/40 text-ivory-400 hover:text-gold-400 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-display text-xl font-light text-ivory-50 mb-6">
                Register Administrator Credentials
              </h3>

              <form onSubmit={handleAddAdmin} className="space-y-4 font-body text-xs text-left">
                <div>
                  <label className="text-ivory-400 block mb-1.5 font-medium">Username</label>
                  <input
                    required
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="input-luxury py-2.5 px-4"
                  />
                </div>

                <div>
                  <label className="text-ivory-400 block mb-1.5 font-medium">Security Email</label>
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="john@lokahbuilders.com"
                    className="input-luxury py-2.5 px-4"
                  />
                </div>

                <div>
                  <label className="text-ivory-400 block mb-1.5 font-medium">Temporary Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="input-luxury py-2.5 px-4"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminModalOpen(false)}
                    className="px-5 py-2.5 border border-ivory-400/10 hover:border-ivory-400/30 text-ivory-300 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-6 font-semibold uppercase tracking-wider flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENQUIRY DETAIL POPUP MODAL */}
      <AnimatePresence>
        {selectedEnquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedEnquiry(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-2xl p-6 md:p-8 relative border border-gold-500/25 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-ivory-400/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold tracking-wider border ${
                      selectedEnquiry.type.includes('Consultation') ? 'bg-gold-500/15 text-gold-400 border-gold-500/30' :
                      selectedEnquiry.type.includes('Site Visit') ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                      'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    }`}>
                      {selectedEnquiry.type}
                    </span>
                    <span className="text-ivory-400 text-xs font-light">
                      Received: {new Date(selectedEnquiry.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-light text-ivory-50">
                    {selectedEnquiry.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="w-8 h-8 rounded-full border border-ivory-400/10 hover:border-gold-500/40 hover:text-gold-400 flex items-center justify-center text-ivory-400 transition-all cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Applicant & Request Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Applicant Contact */}
                <div className="p-4 rounded-xl bg-matte-950 border border-white/5 space-y-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-gold-450 font-semibold block">Applicant Contact</span>
                  <p className="text-ivory-100 font-medium text-sm">{selectedEnquiry.name}</p>
                  {selectedEnquiry.phone && selectedEnquiry.phone !== '-' && (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="flex items-center gap-2 text-xs text-ivory-300 hover:text-gold-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span>{selectedEnquiry.phone}</span>
                    </a>
                  )}
                  {selectedEnquiry.email && selectedEnquiry.email !== '-' && (
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="flex items-center gap-2 text-xs text-ivory-300 hover:text-gold-400 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span>{selectedEnquiry.email}</span>
                    </a>
                  )}
                </div>

                {/* Request Details */}
                <div className="p-4 rounded-xl bg-matte-950 border border-white/5 space-y-2.5">
                  <span className="text-[10px] uppercase tracking-wider text-gold-450 font-semibold block">Request Summary</span>
                  <div>
                    <span className="text-ivory-400 text-xs block">Property / Category</span>
                    <p className="text-ivory-100 font-medium text-xs mt-0.5">{selectedEnquiry.category}</p>
                  </div>
                  <div>
                    <span className="text-ivory-400 text-xs block">Preferred Date</span>
                    <p className="text-ivory-200 text-xs mt-0.5 flex items-center gap-1.5 font-light">
                      <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      {selectedEnquiry.preferredDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message / Requirements Section */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-450 font-semibold block mb-2">
                  Additional Message &amp; Requirements
                </span>
                <div className="p-4 rounded-xl bg-charcoal-900/80 border border-gold-500/15 text-ivory-200 text-sm leading-relaxed font-light whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Actions & Status Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ivory-400/10">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <span className="text-ivory-400 text-xs font-light whitespace-nowrap">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const updated = { ...selectedEnquiry, status: newStatus };
                      setSelectedEnquiry(updated);
                      await handleUpdateUnifiedStatus(updated, newStatus);
                    }}
                    className={`border py-1.5 px-3 rounded-xl text-xs font-medium focus:outline-none focus:border-gold-500 cursor-pointer ${
                      selectedEnquiry.status === 'pending' ? 'bg-red-500/10 text-red-300 border-red-500/30' :
                      selectedEnquiry.status === 'contacted' ? 'bg-gold-500/10 text-gold-300 border-gold-500/30' :
                      selectedEnquiry.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                      'bg-charcoal-900 text-ivory-200 border-ivory-400/10'
                    }`}
                  >
                    <option value="pending" className="bg-matte-950 text-red-300">Pending</option>
                    <option value="contacted" className="bg-matte-950 text-gold-300">Contacted</option>
                    <option value="in-progress" className="bg-matte-950 text-blue-300">In Progress</option>
                    <option value="resolved" className="bg-matte-950 text-emerald-300">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="btn-secondary py-2 px-5 text-xs w-full sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>{/* end padding wrapper */}
    </div>
  );
}
