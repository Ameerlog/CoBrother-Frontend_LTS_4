import api from './axios';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register:           (data)          => api.post('/api/v1/auth/register', data),
  login:              (data)          => api.post('/api/v1/auth/login', data),
  sendOtp:            (email)         => api.post('/api/v1/auth/otp/send', { email }),
  verifyOtp:          (email, otp)    => api.post('/api/v1/auth/otp/verify', { email, otpCode: otp }),
  verifyEmail:        (token)         => api.get(`/api/v1/auth/verify-email?token=${token}`),
  resendVerification: (email)         => api.post('/api/v1/auth/resend-verification', { email }),
  refresh:            (refreshToken)  => api.post('/api/v1/auth/refresh', { refreshToken }),
  logout:             ()              => api.post('/api/v1/auth/logout'),
  completeProfile:    (data)          => api.post('/api/v1/auth/complete-profile', data),
};

// ─── Profile ─────────────────────────────────────────────────────────────────
export const profileAPI = {
  // /profile/me is the primary source — returns AppUser with profileComplete
  getMe:    ()     => api.get('/api/v1/profile/me'),
  complete: (data) => api.put('/api/v1/profile/complete', data),
};

// ─── Venture ─────────────────────────────────────────────────────────────────
export const ventureAPI = {
  getAll:       ()        => api.get('/api/v1/venture/all'),
  getMyVentures:()        => api.get('/api/v1/venture/my'),
  get:          (id)      => api.get(`/api/v1/venture/${id}`),
  create:       (data)    => api.post('/api/v1/venture', data),
  update:       (id, data)=> api.put(`/api/v1/venture/${id}`, data),
  delete:       (id)      => api.delete(`/api/v1/venture/${id}`),
  // Add to ventureAPI:
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`api/v1/venture/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ─── CoVenture ───────────────────────────────────────────────────────────────
export const coVentureAPI = {
  apply:                  (ventureId, data) => api.post(`/api/v1/coventure/${ventureId}`, data),
  checkApplied:           (ventureId)       => api.get(`/api/v1/coventure/${ventureId}/my-status`),
  getMyApplications:      ()                => api.get('/api/v1/coventure/my-applications'),
  getMyVentureApplications: (status)        => api.get('/api/v1/coventure/my-venture-applications', { params: { status } }),
  updateStatus:           (id, status)      => api.put(`/api/v1/coventure/${id}/status`, { status }),
};

// ─── Venture Auction ─────────────────────────────────────────────────────────
export const ventureAuctionAPI = {
  create:        (ventureId, data)    => api.post(`/api/v1/venture-auction/venture/${ventureId}`, data),
  verifyGstin:   (ventureId, gstin)   => api.post(`/api/v1/venture-auction/venture/${ventureId}/verify/gstin`, { gstin }),
  get:           (auctionId)          => api.get(`/api/v1/venture-auction/${auctionId}`),
  getByVenture:  (ventureId)          => api.get(`/api/v1/venture-auction/venture/${ventureId}`),
  placeBid:      (auctionId, amount)  => api.post(`/api/v1/venture-auction/${auctionId}/bid`, { amount }),
  reAuction:     (auctionId, data)    => api.post(`/api/v1/venture-auction/${auctionId}/re-auction`, data),
  close:         (auctionId)          => api.post(`/api/v1/venture-auction/${auctionId}/close`),
  getActive:     ()                   => api.get('/api/v1/venture-auction/active'),
  adminGetAll:   ()                   => api.get('/api/v1/venture-auction/admin/all'),
};
// ─── Community ───────────────────────────────────────────────────────────────
export const communityAPI = {
  getAll:           ()        => api.get('/api/v1/community/all'),
  getOne:           (id)      => api.get(`/api/v1/community/${id}`),
  update:           (id, data)=> api.put(`/api/v1/community/${id}`, data),
  linkedInAuthUrl:  ()        => api.get('/api/v1/community/linkedin/auth'),
  linkedInCallback: (code)    => api.get(`/api/v1/community/linkedin/callback?code=${code}`),
};



export const domainAPI = {
  getAll:          ()        => api.get('/api/v1/domain/all'),
  getMyListings:   ()        => api.get('/api/v1/domain/my-listings'),
  getMyPurchases:  ()        => api.get('/api/v1/domain/my-purchases'),
  get:             (id)      => api.get(`/api/v1/domain/${id}`),
  create:          (data)    => api.post('/api/v1/domain', data),
  update:          (id, data)=> api.put(`/api/v1/domain/${id}`, data),
  delete:          (id)      => api.delete(`/api/v1/domain/${id}`),
  createOrder:     (id, data) => api.post(`/api/v1/domain/${id}/purchase/create-order`, data || {}),
  verifyPayment:   (id, data)=> api.post(`/api/v1/domain/${id}/purchase/verify`, data),
  handleFailure:   (id)      => api.post(`/api/v1/domain/${id}/purchase/failure`),
  verifyInit:  (id, method) => api.post(`/api/v1/domain/${id}/verify/init?method=${method}`),
  verifyCheck: (id, code)   => api.post(`/api/v1/domain/${id}/verify/check`, code ? { code } : {}),
  uploadImage: (id, formData) =>
    api.post(`/api/v1/domain/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const analyticsAPI = {
  getVentureAnalytics: (id) => api.get(`/api/v1/analytics/venture/${id}`),
  getProfileAnalytics: ()    => api.get('/api/v1/analytics/profile'),
  getMyVentures:       ()    => api.get('/api/v1/venture/my'),
};

export const cocreationAPI = {
  getAll:          ()         => api.get('/api/v1/cocreation/all'),
  getMyListings:   ()         => api.get('/api/v1/cocreation/my-listings'),
  getMyPurchases:  ()         => api.get('/api/v1/cocreation/my-purchases'),
  get:             (id)       => api.get(`/api/v1/cocreation/${id}`),
  create:          (data)     => api.post('/api/v1/cocreation', data),
  update:          (id, data) => api.put(`/api/v1/cocreation/${id}`, data),
  delete:          (id)       => api.delete(`/api/v1/cocreation/${id}`),
  createOrder:     (id, data) => api.post(`/api/v1/cocreation/${id}/purchase/create-order`, data),
  verifyPayment:   (id, data) => api.post(`/api/v1/cocreation/${id}/purchase/verify`, data),
  handleFailure:   (id)       => api.post(`/api/v1/cocreation/${id}/purchase/failure`),
  confirmPurchase: (purchaseId) => api.post(`/api/v1/cocreation/purchase/${purchaseId}/confirm`),
  getAnalytics:    (id)       => api.get(`/api/v1/cocreation/${id}/analytics`),
  payCoBrotherHelp:    (purchaseId) => api.post(`/api/v1/cocreation/purchase/${purchaseId}/cobrother-help/create-order`),
  verifyCoBrotherHelp: (purchaseId, data) => api.post(`/api/v1/cocreation/purchase/${purchaseId}/cobrother-help/verify`, data),
  uploadImage: (id, formData) =>
    api.post(`/api/v1/cocreation/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const notificationAPI = {
  getRecent:     () => api.get('/api/v1/notifications/recent'),
  getAll:        () => api.get('/api/v1/notifications/all'),
  getUnreadCount:() => api.get('/api/v1/notifications/unread-count'),
  markAllRead:   () => api.put('/api/v1/notifications/mark-all-read'),
  markOneRead:   (id)=> api.put(`/api/v1/notifications/${id}/read`),
};


export const likeAPI = {
  toggle:     (type, id)       => api.post(`/api/v1/likes/${type}/${id}/toggle`),
  getStatus:  (type, id)       => api.get(`/api/v1/likes/${type}/${id}/status`),
  bulkStatus: (type, ids)      => api.post(`/api/v1/likes/${type}/bulk-status`, ids),
  whoLiked:   (type, id)       => api.get(`/api/v1/likes/${type}/${id}/who-liked`),
  myLiked:    (type)           => api.get(`/api/v1/likes/${type}/my-liked`),
};

export const adminAPI = {
  getCoVentures:        ()              => api.get('/api/v1/admin/coventures'),
  getVentures:          ()              => api.get('/api/v1/admin/ventures'),
  getDomains:           ()              => api.get('/api/v1/admin/domains'),
  getCoCreations:       ()              => api.get('/api/v1/admin/cocreations'),
  getCommunities:       ()              => api.get('/api/v1/admin/communities'),
  getCoBrotherRequests: ()              => api.get('/api/v1/admin/cobrother-requests'),
  getCoBrothers:        ()              => api.get('/api/v1/admin/cobrothers'),
  forward:              (data)          => api.post('/api/v1/admin/forward', data),
  listOfficialSoftware: (data)          => api.post('/api/v1/admin/cocreation', data),
  getAllAuctions: () => api.get('/api/v1/auction/admin/all'),
  getAllVentureAuctions: () => api.get('/api/v1/venture-auction/admin/all'),
  takeDown:  (type, id, reason) => api.post(`/api/v1/admin/takedown`, { type, entityId: id, reason }),
  restore:   (type, id)         => api.post(`/api/v1/admin/restore`,  { type, entityId: id }),
  getDomainEnquiries: ()        => api.get('/api/v1/domain-enquiry/all'),
  toggleFeatured: (type, id, featured) =>
    api.post('/api/v1/admin/feature', { 
      type: type, 
      entityId: String(id), 
      featured: String(featured)   // must be "true" or "false" as string
    }),
};

export const coBrotherAPI = {
  getRequests: ()                       => api.get('/api/v1/cobrother/requests'),
  respond:     (id, accepted, note)     => api.put(`/api/v1/cobrother/requests/${id}/respond`,
                                            { accepted, note }),
};

export const feeAPI = {
  getMyRequests:  ()        => api.get('/api/v1/fee/my-requests'),
  createOrder:    (id)      => api.post(`/api/v1/fee/requests/${id}/create-order`),
  verify:         (id, data)=> api.post(`/api/v1/fee/requests/${id}/verify`, data),
  cancel:         (id)      => api.post(`/api/v1/fee/requests/${id}/cancel`),
};

export const domainEnquiryAPI = {
  submit: (domainId, data) => api.post(`/api/v1/domain-enquiry/${domainId}`, data),
};

export const auctionAPI = {
  create:       (domainId, data)    => api.post(`/api/v1/auction/domain/${domainId}`, data),
  get:          (auctionId)         => api.get(`/api/v1/auction/${auctionId}`),
  getByDomain:  (domainId)          => api.get(`/api/v1/auction/domain/${domainId}`),
  placeBid:     (auctionId, amount) => api.post(`/api/v1/auction/${auctionId}/bid`, { amount }),
  reAuction:    (auctionId, data)   => api.post(`/api/v1/auction/${auctionId}/re-auction`, data),
  close:        (auctionId)         => api.post(`/api/v1/auction/${auctionId}/close`),
  adminGetAll:  ()                  => api.get('/api/v1/auction/admin/all'),
  getActive: () => api.get('/api/v1/auction/active'),
};

export const feedbackAPI = {
  submit: (payload) => api.post('/api/v1/feedback', payload),
};

// ─── Insights ─────────────────────────────────────────────────────────────────
export const insightsAPI = {
  // Startup Validator
  validate:         (data)         => api.post('/api/v1/insights/validate', data),
  validationHistory:()             => api.get('/api/v1/insights/validate/history'),

  // News Subscriptions
  getSubscriptions: ()             => api.get('/api/v1/insights/subscriptions'),
  createSubscription:(data)        => api.post('/api/v1/insights/subscriptions', data),
  updateSubscription:(id, data)    => api.put(`/api/v1/insights/subscriptions/${id}`, data),
  deleteSubscription:(id)          => api.delete(`/api/v1/insights/subscriptions/${id}`),
  toggleSubscription:(id)          => api.post(`/api/v1/insights/subscriptions/${id}/toggle`),
  triggerSubscription:(id)         => api.post(`/api/v1/insights/subscriptions/${id}/trigger`),

  // Digests
  getDigests:       (page = 0, size = 10) => api.get('/api/v1/insights/digests', { params: { page, size } }),
  getDigest:        (id)           => api.get(`/api/v1/insights/digests/${id}`),
  markDigestRead:   (id)           => api.patch(`/api/v1/insights/digests/${id}/read`),
  markAllRead:      ()             => api.post('/api/v1/insights/digests/mark-all-read'),
  getUnreadCount:   ()             => api.get('/api/v1/insights/digests/unread-count'),
  getRadar:         ()             => api.get('/api/v1/insights/digests/radar'),
  getFundingSignals:()             => api.get('/api/v1/insights/digests/funding'),
};

export const addonAPI = {
  getServices: () => api.get('/api/v1/addon/services'),
  createOrder: (body) => api.post('/api/v1/addon/order', body),
  verifyPayment: (body) => api.post('/api/v1/addon/verify', body),
  getMyOrders: () => api.get('/api/v1/addon/my-orders'),
  adminGetAll: () => api.get('/api/v1/addon/admin/all'),
};


export const joinUsAPI = {
  submit: (data) => api.post('/api/v1/becobrother', data),
};

// ─── Public APIs (no auth required) ──────────────────────────────────────────
export const publicAPI = {
  getDomains:   () => api.get('/public/api/v1/domains'),
  getVentures:  () => api.get('/public/api/v1/ventures'),
  getSoftwares: () => api.get('/public/api/v1/softwares'),
};


