import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';


const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://hum-fleet-backend.loca.lt'
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000'
    : (import.meta.env.VITE_BACKEND_URL || 'http://187.127.165.79:5000');

const fetchJSON = async (url) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return response.json();
};

export const useDrivers = (page, limit, search, status) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  if (status) queryParams.append('status', status);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  return useQuery({
    queryKey: ['drivers', page, limit, search, status],
    queryFn: () => fetchJSON(`/api/drivers${queryString}`),
    refetchInterval: 5000,
  });
};

export const usePassengers = (page, limit, search) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (search) queryParams.append('search', search);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  return useQuery({
    queryKey: ['passengers', page, limit, search],
    queryFn: () => fetchJSON(`/api/passengers${queryString}`),
    refetchInterval: 10000,
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: () => fetchJSON('/api/employees'),
  });
};

export const useFinancials = () => {
  return useQuery({
    queryKey: ['financials'],
    queryFn: () => fetchJSON('/api/admin/financials'),
    refetchInterval: 30000,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchJSON('/api/vehicle-categories'),
  });
};

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => fetchJSON('/api/settings'),
  });
};

export const useFleetLive = () => {
  return useQuery({
    queryKey: ['fleetLive'],
    queryFn: () => fetchJSON('/api/admin/fleet-live'),
    refetchInterval: 3000,
  });
};

export const usePendingPayments = () => {
  return useQuery({
    queryKey: ['pendingPayments'],
    queryFn: () => fetchJSON('/api/pending-payments'),
    refetchInterval: 10000,
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const [hospitalsRes, poisRes] = await Promise.all([
        fetch(`${API_BASE}/api/hospitals`),
        fetch(`${API_BASE}/api/pois`)
      ]);
      const hospitals = hospitalsRes.ok ? await hospitalsRes.json() : [];
      const pois = poisRes.ok ? await poisRes.json() : [];
      return [...hospitals, ...pois];
    }
  });
};

export const useAdminProfile = () => {
  return useQuery({
    queryKey: ['adminProfile'],
    queryFn: () => fetchJSON('/api/admin/profile'),
  });
};

export const useSocketFleetLive = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(API_BASE);

    socket.on('fleetState', (state) => {
      // Initialize fleet data
      queryClient.setQueryData(['fleetLive'], state);
    });

    socket.on('driverUpdate', (update) => {
      queryClient.setQueryData(['fleetLive'], (oldData) => {
        if (!oldData || !oldData.drivers) return oldData;
        const newDrivers = oldData.drivers.map(d => 
          d.id === update.driverId 
            ? { ...d, lat: update.lat, lng: update.lng, isOnline: update.isOnline, currentRide: update.currentRide }
            : d
        );
        return { ...oldData, drivers: newDrivers };
      });
    });

    return () => socket.disconnect();
  }, [queryClient]);
};
