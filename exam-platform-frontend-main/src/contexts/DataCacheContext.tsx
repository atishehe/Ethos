import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface StudentData {
  name: string;
  rollNo: string;
  _id: string;
}

interface CollegeData {
  [collegeName: string]: StudentData[];
}

interface CacheData {
  students: CollegeData;
  questions: any[];
  lastUpdated: number;
  isLoading: boolean;
}

interface DataCacheContextType {
  cache: CacheData;
  preloadCollegeData: (collegeName: string) => Promise<void>;
  getCollegeStudents: (collegeName: string) => StudentData[] | null;
  isDataLoading: (collegeName: string) => boolean;
  refreshData: (collegeName: string) => Promise<void>;
  preloadAllData: () => Promise<void>;
  clearCache: () => void;
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

export const DataCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<CacheData>({
    students: {},
    questions: [],
    lastUpdated: 0,
    isLoading: false
  });

  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Load cached data from localStorage on initialization
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem('dataCache');
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();
          const cacheAge = now - parsed.lastUpdated;
          
          // Cache is valid for 30 minutes
          if (cacheAge < 30 * 60 * 1000) {
            setCache(parsed);
            console.log('Loaded cached data:', Object.keys(parsed.students));
          } else {
            console.log('Cache expired, will reload data');
            localStorage.removeItem('dataCache');
          }
        }
      } catch (error) {
        console.error('Failed to load cached data:', error);
        localStorage.removeItem('dataCache');
      }
    };

    loadCachedData();
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    if (cache.lastUpdated > 0) {
      localStorage.setItem('dataCache', JSON.stringify(cache));
    }
  }, [cache]);

  const preloadCollegeData = async (collegeName: string): Promise<void> => {
    if (cache.students[collegeName] && !loadingStates[collegeName]) {
      return; // Already cached and not loading
    }

    setLoadingStates(prev => ({ ...prev, [collegeName]: true }));

    try {
      console.log(`Preloading data for ${collegeName}...`);
      const response = await axios.get(`${API_BASE_URL}/api/college/${collegeName}`);
      
      if (response.data && response.data[collegeName]) {
        setCache(prev => ({
          ...prev,
          students: {
            ...prev.students,
            [collegeName]: response.data[collegeName]
          },
          lastUpdated: Date.now()
        }));
        console.log(`Successfully preloaded data for ${collegeName}`);
      }
    } catch (error) {
      console.error(`Failed to preload data for ${collegeName}:`, error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [collegeName]: false }));
    }
  };

  const getCollegeStudents = (collegeName: string): StudentData[] | null => {
    return cache.students[collegeName] || null;
  };

  const isDataLoading = (collegeName: string): boolean => {
    return loadingStates[collegeName] || false;
  };

  const refreshData = async (collegeName: string): Promise<void> => {
    // Remove from cache to force reload
    setCache(prev => ({
      ...prev,
      students: {
        ...prev.students,
        [collegeName]: undefined as any
      }
    }));
    
    await preloadCollegeData(collegeName);
  };

  const preloadAllData = async (): Promise<void> => {
    setCache(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Preload data for all supported colleges
      const colleges = [
        "IIT Bombay", "IIT Delhi", "IIIT Delhi", "IIT Madras", "IIT Hyderabad",
        "IIT Roorkee", "IIT Mandi", "IIT Jodhpur", "IIT Guwahati", "IIT Kanpur",
        "IIT BHU", "IIT Ropar", "IIT ISM Dhanbad", "IISc Bangalore", "ISI Bangalore",
        "IIIT Hyderabad", "BITS Pilani", "IIT Bhubaneshwar", "IIT Gandhinagar",
        "IIT Bhilai", "IIT Palakkad", "IIT Patna"
      ];

      console.log('Starting background data preloading...');
      
      // Preload data for all colleges in parallel
      const preloadPromises = colleges.map(college => 
        preloadCollegeData(college).catch(error => 
          console.warn(`Failed to preload ${college}:`, error)
        )
      );

      await Promise.allSettled(preloadPromises);
      console.log('Background data preloading completed');
    } catch (error) {
      console.error('Failed to preload all data:', error);
    } finally {
      setCache(prev => ({ ...prev, isLoading: false }));
    }
  };

  const clearCache = () => {
    setCache({
      students: {},
      questions: [],
      lastUpdated: 0,
      isLoading: false
    });
    setLoadingStates({});
    localStorage.removeItem('dataCache');
  };

  return (
    <DataCacheContext.Provider value={{
      cache,
      preloadCollegeData,
      getCollegeStudents,
      isDataLoading,
      refreshData,
      preloadAllData,
      clearCache
    }}>
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => {
  const context = useContext(DataCacheContext);
  if (context === undefined) {
    throw new Error('useDataCache must be used within a DataCacheProvider');
  }
  return context;
}; 