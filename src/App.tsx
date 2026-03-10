import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  Hotel, 
  Plane, 
  Utensils, 
  ShoppingBag, 
  Package, 
  MapPin, 
  Search, 
  Menu, 
  Bell, 
  Wallet, 
  User, 
  ArrowRight, 
  Star, 
  Shield, 
  MessageSquare,
  FileText,
  Bike,
  Building,
  Banknote,
  X,
  Send,
  Loader2,
  ChevronRight,
  TrendingUp,
  Clock,
  Heart,
  Settings,
  LogOut,
  CreditCard,
  Smartphone,
  Navigation,
  MoreHorizontal,
  Circle,
  Plus,
  Gift,
  Truck,
  Globe,
  Moon,
  Sun,
  LayoutGrid,
  History,
  Bus,
  AlertTriangle,
  IdCard,
  CheckCircle2,
  Info,
  Train,
  Mountain,
  Key,
  Camera,
  Box,
  BarChart3,
  ClipboardList,
  Layers,
  ShoppingCart,
  Apple,
  Milk,
  Beef,
  Coffee,
  Filter,
  Warehouse,
  Fuel,
  QrCode,
  PenTool,
  Users,
  Activity,
  Receipt,
  Zap,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants ---
const GOOGLE_MAPS_API_KEY = '';

// --- Types ---
type AppStep = 'auth' | 'home' | 'ride_selection' | 'promotions' | 'booking_confirmed' | 'service_view' | 'trip_planner' | 'explore' | 'activity' | 'driver_mode' | 'wallet' | 'notifications' | 'ride_tracking' | 'flight_booking' | 'bus_booking' | 'seat_selection' | 'courier_booking' | 'bidding_view' | 'hotel_booking' | 'train_booking' | 'trips_adventure' | 'rental_cars' | 'logistics' | 'grocery' | 'admin_panel' | 'grocery_tracking' | 'support_chat';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// --- Components ---

const ServiceCard = ({ icon: Icon, label, onClick, isPromo, color = "bg-zinc-100 dark:bg-zinc-800" }: { icon: any, label: string, onClick: () => void, isPromo?: boolean, color?: string }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 group"
  >
    <div className="relative">
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm border border-zinc-50 dark:border-zinc-700",
        color,
        "group-hover:shadow-md group-hover:border-emerald-500/30"
      )}>
        <Icon className="w-6 h-6 text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
      </div>
      {isPromo && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
          Promo
        </div>
      )}
    </div>
    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-tight text-center group-hover:text-emerald-600 transition-colors">{label}</span>
  </motion.button>
);

const MapView = ({ origin, destination, onMapClick }: { origin?: google.maps.LatLngLiteral | null, destination?: google.maps.LatLngLiteral | null, onMapClick?: (e: any) => void }) => {
  const isKeyValid = false;

  return (
    <div className="w-full h-full bg-zinc-100 relative overflow-hidden flex items-center justify-center">
      {/* High-fidelity Map Placeholder */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute top-1/4 left-1/4 w-px h-full bg-zinc-900/20"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-900/20"></div>
        <div className="absolute top-1/3 left-2/3 w-px h-full bg-zinc-900/20"></div>
      </div>
      
      <div className="relative z-10 text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white max-w-[80%]">
        <div className="w-12 h-12 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <p className="text-zinc-900 font-black text-sm uppercase tracking-widest">Map Preview Mode</p>
        <p className="text-[10px] text-zinc-500 font-bold mt-1">Real-time tracking active</p>
        <p className="text-[8px] text-zinc-400 mt-4 italic">Google Maps API Key Deleted</p>
      </div>

      {/* Simulated Markers */}
      <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-zinc-900 rounded-full border-2 border-white shadow-md flex items-center justify-center opacity-80">
        <Car className="w-3 h-3 text-white" />
      </div>
    </div>
  );
};

const DriverMode = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'documents' | 'rules' | 'topup' | 'vehicle'>('dashboard');
  const [balance, setBalance] = useState(120.50);
  const [country, setCountry] = useState('');
  const [rules, setRules] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [vehiclePhotos, setVehiclePhotos] = useState<string[]>([]);

  const fetchRules = async () => {
    if (!country.trim()) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `Provide a concise summary of traffic rules, laws, and driver agreements for ${country}. Include speed limits, major fines, and unique local laws. Use markdown.` }] }],
      });
      setRules(response.text || 'No rules found.');
    } catch (error) {
      setRules('Error fetching rules. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-zinc-900 text-white flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black">Driver Mode</h2>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online • Active</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Car className="w-5 h-5" />
        </div>
      </div>

      <div className="flex bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'documents', label: 'Documents' },
          { id: 'vehicle', label: 'Vehicle' },
          { id: 'rules', label: 'Traffic Rules' },
          { id: 'topup', label: 'Top-up' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2",
              activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400 dark:text-zinc-500"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Today's Earnings</p>
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white">$84.20</h3>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">4.98</h3>
                  <Star className="w-4 h-4 text-blue-600 fill-current" />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 dark:bg-blue-600 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-sm font-bold opacity-60 mb-1 uppercase tracking-widest">Current Balance</h4>
                <h2 className="text-4xl font-black mb-6">${balance.toFixed(2)}</h2>
                <button onClick={() => setActiveTab('topup')} className="bg-blue-600 dark:bg-zinc-900 px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/40">
                  Withdraw Funds
                </button>
              </div>
              <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-[-15deg]" />
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Recent Trips</h4>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-700 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 dark:text-white">Trip #{1234 + i}</p>
                      <p className="text-[10px] font-bold text-zinc-400">2.4 miles • 12 mins</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-500">+$12.40</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[32px] border border-blue-100 dark:border-blue-900/30 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-blue-900 dark:text-blue-100">Strict Verification</h3>
              </div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 opacity-80 leading-relaxed">
                All documents must be valid and up-to-date. Failure to maintain active insurance or license will result in immediate account suspension.
              </p>
            </div>

            {[
              { label: "Driver's License", status: 'Verified', date: 'Exp: Dec 2026', icon: User },
              { label: "Vehicle Registration", status: 'Verified', date: 'Exp: Jan 2027', icon: FileText },
              { label: "Commercial Insurance", status: 'Verified', date: 'Exp: Oct 2026', icon: Shield },
              { label: "Background Check", status: 'Cleared', date: 'Last: Mar 2026', icon: Search },
            ].map((doc, i) => (
              <div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                    <doc.icon className="w-6 h-6 text-zinc-400 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white">{doc.label}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">{doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vehicle' && (
          <div className="space-y-6">
            {!showRegistration ? (
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-700 shadow-sm text-center">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Car className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black mb-2 dark:text-white">Vehicle Status</h3>
                <p className="text-sm font-bold text-zinc-400 mb-8">Your vehicle condition is the key to elite status.</p>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">Approved</span>
                  </div>
                  <span className="text-[10px] font-black bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg shadow-sm">Clean & Comfortable</span>
                </div>

                <button 
                  onClick={() => setShowRegistration(true)}
                  className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl"
                >
                  Update Vehicle Photos
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black dark:text-white">Registration</h3>
                  <span className="text-xs font-black text-blue-600">Step {regStep}/3</span>
                </div>

                {regStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-zinc-400">Upload 4 exterior angles of your vehicle.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-video bg-zinc-50 dark:bg-zinc-700 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center gap-2">
                          <Camera className="w-6 h-6 text-zinc-300" />
                          <span className="text-[8px] font-black text-zinc-400 uppercase">Angle {i}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-zinc-400">Upload interior photos (Seats, Dashboard, Boot).</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['Seats', 'Dashboard', 'Boot'].map((label) => (
                        <div key={label} className="aspect-video bg-zinc-50 dark:bg-zinc-700 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center gap-2">
                          <Camera className="w-6 h-6 text-zinc-300" />
                          <span className="text-[8px] font-black text-zinc-400 uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-zinc-400">Final step: Odometer & Number Plate.</p>
                    <div className="grid grid-cols-2 gap-4">
                      {['Odometer', 'Number Plate'].map((label) => (
                        <div key={label} className="aspect-video bg-zinc-50 dark:bg-zinc-700 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-600 flex flex-col items-center justify-center gap-2">
                          <Camera className="w-6 h-6 text-zinc-300" />
                          <span className="text-[8px] font-black text-zinc-400 uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  {regStep > 1 && (
                    <button 
                      onClick={() => setRegStep(regStep - 1)}
                      className="flex-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white py-4 rounded-2xl font-black"
                    >
                      Back
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (regStep < 3) setRegStep(regStep + 1);
                      else {
                        setShowRegistration(false);
                        setRegStep(1);
                      }
                    }}
                    className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-900/20"
                  >
                    {regStep === 3 ? 'Submit for Review' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
              <h3 className="font-black text-lg mb-2 dark:text-white">Global Traffic Laws</h3>
              <p className="text-xs font-bold text-zinc-400 mb-6">Search traffic rules, laws, and agreements for any country in the world.</p>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country name..."
                    className="w-full bg-zinc-50 dark:bg-zinc-700 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
                  />
                </div>
                <button
                  onClick={fetchRules}
                  disabled={isSearching}
                  className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {rules && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-800 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm prose prose-sm prose-zinc dark:prose-invert max-w-none"
              >
                <Markdown>{rules}</Markdown>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'topup' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-700 shadow-sm text-center">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black mb-2 dark:text-white">Top-up Balance</h3>
              <p className="text-sm font-bold text-zinc-400 mb-8">Add funds to your driver wallet for fees and subscriptions.</p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[10, 20, 50, 100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBalance(prev => prev + amount)}
                    className="py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-700 border border-zinc-100 dark:border-zinc-600 font-black text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 dark:text-white"
                  >
                    +${amount}
                  </button>
                ))}
              </div>

              <button className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-zinc-200 dark:shadow-none">
                Custom Amount
              </button>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-900 dark:text-emerald-100">Secure Payments</h4>
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 opacity-70 uppercase tracking-widest">PCI-DSS Compliant • 256-bit SSL</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityView = ({ onBack }: { onBack: () => void }) => (
  <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
    <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
      <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
        <ChevronRight className="w-5 h-5 rotate-180" />
      </button>
      <h2 className="text-xl font-black dark:text-white">Activity</h2>
      <div className="w-10 h-10" />
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-700">
        <h3 className="text-sm font-black uppercase tracking-tight mb-4 dark:text-white">Current Status</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-black dark:text-white">No active rides</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase">Ready when you are</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">Past Activity</h3>
        {[
          { title: 'Ride to Chase Center', date: 'Yesterday, 8:30 PM', price: '$12.50', status: 'Completed' },
          { title: 'Grocery Delivery', date: '2 days ago', price: '$45.20', status: 'Completed' },
          { title: 'Ride to SFO', date: 'Last week', price: '$35.00', status: 'Completed' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 rounded-2xl p-4 flex items-center justify-between border border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-700 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs font-black dark:text-white">{item.title}</p>
                <p className="text-[10px] font-bold text-zinc-400">{item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black dark:text-white">{item.price}</p>
              <p className="text-[8px] font-bold text-emerald-500 uppercase">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ExploreView = ({ onBack }: { onBack: () => void }) => (
  <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
    <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
      <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
        <ChevronRight className="w-5 h-5 rotate-180" />
      </button>
      <h2 className="text-xl font-black dark:text-white">Explore</h2>
      <div className="w-10 h-10" />
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      <div className="relative aspect-[16/9] rounded-[32px] overflow-hidden shadow-xl">
        <img 
          src="https://picsum.photos/seed/sf/800/450" 
          alt="San Francisco" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-white text-xl font-black">Discover San Francisco</h3>
          <p className="text-white/80 text-xs font-bold">Top 10 hidden gems to visit this weekend</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">Nearby Attractions</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Golden Gate', img: '🌉', rating: '4.9' },
            { name: 'Fisherman\'s Wharf', img: '🦞', rating: '4.7' },
            { name: 'Alcatraz', img: '⛓️', rating: '4.8' },
            { name: 'Painted Ladies', img: '🏠', rating: '4.6' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-3xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
              <div className="aspect-square bg-zinc-50 dark:bg-zinc-700 rounded-2xl mb-3 flex items-center justify-center text-4xl">
                {item.img}
              </div>
              <h4 className="font-black text-xs mb-1 dark:text-white">{item.name}</h4>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-blue-600 fill-current" />
                <span className="text-[10px] font-bold text-zinc-400">{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi! I am Venzgo AI. How can I help you plan your trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `You are Venzgo AI, a helpful travel and ride assistant for the Venzgo Super-App. Help the user with: ${userMsg}` }] }],
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-12 h-12 bg-zinc-900 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
      >
        <MessageSquare className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-6 w-[320px] h-[450px] bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-700 flex flex-col z-50 overflow-hidden"
          >
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <h3 className="font-bold text-sm">Venzgo AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-xs shadow-sm",
                    m.role === 'user' ? "bg-zinc-900 text-white rounded-tr-none" : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-700"
                  )}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                    <Loader2 className="w-3 h-3 animate-spin text-zinc-900 dark:text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-zinc-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Venzgo AI..."
                className="flex-1 bg-zinc-100 dark:bg-zinc-700 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AuthScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [phone, setPhone] = useState('');
  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900 p-8">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-20 h-20 bg-emerald-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black mb-8 shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20">V</div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">Welcome to Venzgo</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold mb-12">The future of mobility is here. Sign in to continue.</p>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-sm font-black text-zinc-400">+92</span>
              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            <input 
              type="tel" 
              placeholder="300 1234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl pl-16 pr-4 py-5 text-sm font-bold focus:ring-2 focus:ring-emerald-600 outline-none dark:text-white"
            />
          </div>
          
          <button 
            onClick={onLogin}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
          >
            Continue with Phone
          </button>
          
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800"></div>
          </div>
          
          <button 
            onClick={onLogin}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-900 dark:text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-zinc-400 font-bold">
        By continuing, you agree to Venzgo's <span className="text-emerald-600">Terms of Service</span> and <span className="text-emerald-600">Privacy Policy</span>.
      </p>
    </div>
  );
};

const NotificationScreen = ({ onBack, notifications, onClear }: { onBack: () => void, notifications: any[], onClear: () => void }) => (
  <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
    <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
      <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
        <ChevronRight className="w-5 h-5 rotate-180" />
      </button>
      <h2 className="text-xl font-black dark:text-white">Notifications</h2>
      <button onClick={onClear} className="text-xs font-bold text-blue-600">Clear All</button>
    </div>
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {notifications.map((n, i) => (
        <div key={n.id} className="bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 flex items-start gap-4 shadow-sm">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", n.color)}>
            <n.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-black dark:text-white">{n.title}</h4>
              <span className="text-[10px] font-bold text-zinc-400">{n.time}</span>
            </div>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{n.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RideTrackingView = ({ onBack, onCancel }: { onBack: () => void, onCancel: (reason: string) => void }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const reasons = [
    "Driver is too far",
    "Driver is not moving",
    "Changed my mind",
    "Found another ride",
    "Incorrect pickup location"
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
      <div className="relative h-[60%]">
        <MapView origin={{ lat: 31.5204, lng: 74.3587 }} destination={{ lat: 31.5580, lng: 74.3507 }} />
        
        {/* Top Overlay */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center dark:text-white"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Driver is Arriving
          </div>
        </div>

        {/* Driver Marker Simulation */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white">
              <Car className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-2 py-1 rounded-lg shadow-md whitespace-nowrap">
              <p className="text-[8px] font-black dark:text-white">Ahmed • 1.2 km</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 bg-white dark:bg-zinc-800 rounded-t-[40px] -mt-10 relative z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] p-6">
        <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full mx-auto mb-6"></div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-700 rounded-2xl overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=ahmed" className="w-full h-full object-cover" alt="Driver" />
            </div>
            <div>
              <h3 className="text-lg font-black dark:text-white">Ahmed Raza</h3>
              <p className="text-xs font-bold text-zinc-400">White Toyota Corolla • LED-1234</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-blue-600 fill-current" />
                <span className="text-xs font-black dark:text-zinc-300">4.9 (1.2k trips)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-blue-600">$12.50</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fixed Price</p>
          </div>
        </div>

        {/* Full Vehicle Card */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vehicle Condition</h4>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase">Clean & Comfortable</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=200&auto=format&fit=crop" className="aspect-video rounded-xl object-cover" alt="Exterior" />
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=200&auto=format&fit=crop" className="aspect-video rounded-xl object-cover" alt="Interior" />
            <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=200&auto=format&fit=crop" className="aspect-video rounded-xl object-cover" alt="Odometer" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500">
            <span>Model: 2022</span>
            <span>Condition: 4.9/5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-red-100 dark:border-red-900/30"
          >
            <AlertTriangle className="w-4 h-4" />
            Emergency
          </button>
          <button 
            onClick={() => setShowCancelModal(true)}
            className="flex items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-zinc-100 dark:border-zinc-600"
          >
            <X className="w-4 h-4" />
            Cancel Ride
          </button>
        </div>

        {/* Prayer Assistant Stop Button */}
        <div className="bg-zinc-900 dark:bg-blue-600 p-6 rounded-[32px] text-white mb-8 relative overflow-hidden shadow-xl shadow-blue-900/20">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Prayer Assistant</span>
            </div>
            <h4 className="text-lg font-black mb-1">Asr Prayer in 45 mins</h4>
            <p className="text-xs font-bold opacity-70 mb-4">Would you like to stop at the nearest mosque?</p>
            <button className="bg-white text-zinc-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
              Stop for Prayer
            </button>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Clock className="w-32 h-32 rotate-12" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 leading-tight">
            Your safety is our priority. All rides are tracked and drivers are verified.
          </p>
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[40px] p-8 pb-12"
            >
              <h3 className="text-2xl font-black mb-2 dark:text-white">Cancel Ride?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 font-bold">Please select a reason for cancellation.</p>
              
              <div className="space-y-2 mb-8">
                {reasons.map((r) => (
                  <button 
                    key={r}
                    onClick={() => setCancelReason(r)}
                    className={cn(
                      "w-full p-4 rounded-2xl text-left text-sm font-bold transition-all border",
                      cancelReason === r 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-900 dark:text-white"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white py-4 rounded-2xl font-black"
                >
                  Keep Ride
                </button>
                <button 
                  onClick={() => {
                    if (cancelReason) onCancel(cancelReason);
                  }}
                  disabled={!cancelReason}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black disabled:opacity-50"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[40px] p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-black mb-4 dark:text-white">Emergency Assistance</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 font-bold leading-relaxed">
                We will immediately notify local authorities and our safety team with your current location.
              </p>
              
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-200 dark:shadow-red-900/20">
                  Call Police (15)
                </button>
                <button className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-lg">
                  Share Trip with Family
                </button>
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="w-full py-4 text-zinc-400 font-black"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BookingFlow = ({ type, onBack }: { type: 'flight' | 'bus', onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    nationality: '',
    dob: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name is required (min 3 chars)";
    }
    if (!formData.idNumber || formData.idNumber.trim().length < 5) {
      newErrors.idNumber = type === 'flight' ? "Valid Passport number is required" : "Valid CNIC is required";
    }
    if (!formData.nationality || formData.nationality.trim().length < 2) {
      newErrors.nationality = "Nationality is required";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(formData.dob);
      if (dobDate > new Date()) {
        newErrors.dob = "DOB cannot be in the future";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1) {
      if (validate()) setStep(2);
    } else if (step === 2) {
      if (selectedSeat) setStep(3);
    } else {
      onBack();
    }
  };
  
  const seats = Array.from({ length: 40 }, (_, i) => ({
    id: `${Math.floor(i/4) + 1}${['A', 'B', 'C', 'D'][i%4]}`,
    isOccupied: Math.random() > 0.7
  }));

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
      <div className="p-6 bg-zinc-900 text-white flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-black uppercase tracking-widest">{type} Booking</h2>
        </div>
        <div className="text-[10px] font-black bg-blue-600 px-3 py-1 rounded-full">Step {step}/3</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[32px] border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3 mb-4">
                <IdCard className="w-6 h-6 text-blue-600" />
                <h3 className="font-black text-blue-900 dark:text-blue-100">Strict Verification</h3>
              </div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 opacity-80 leading-relaxed">
                As per international regulations, all passengers must provide valid identification documents. 
                {type === 'flight' ? " Passport and Visa details are mandatory for international travel." : " National ID is required for all passengers."}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Passenger Details</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <input 
                    type="text" 
                    placeholder="Full Name (as per ID)" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={cn(
                      "w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 transition-all",
                      errors.fullName ? "ring-2 ring-rose-500" : "focus:ring-blue-600"
                    )} 
                  />
                  {errors.fullName && <p className="text-[10px] font-bold text-rose-500 ml-4 uppercase">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <input 
                    type="text" 
                    placeholder={type === 'flight' ? "Passport Number" : "CNIC / ID Number"} 
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className={cn(
                      "w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 transition-all",
                      errors.idNumber ? "ring-2 ring-rose-500" : "focus:ring-blue-600"
                    )} 
                  />
                  {errors.idNumber && <p className="text-[10px] font-bold text-rose-500 ml-4 uppercase">{errors.idNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      placeholder="Nationality" 
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className={cn(
                        "w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 transition-all",
                        errors.nationality ? "ring-2 ring-rose-500" : "focus:ring-blue-600"
                      )} 
                    />
                    {errors.nationality && <p className="text-[10px] font-bold text-rose-500 ml-4 uppercase">{errors.nationality}</p>}
                  </div>

                  <div className="space-y-1">
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className={cn(
                        "w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 transition-all",
                        errors.dob ? "ring-2 ring-rose-500" : "focus:ring-blue-600"
                      )} 
                    />
                    {errors.dob && <p className="text-[10px] font-bold text-rose-500 ml-4 uppercase">{errors.dob}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Required Documents</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2">
                  <Plus className="w-6 h-6 text-zinc-300" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase">Front Side</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2">
                  <Plus className="w-6 h-6 text-zinc-300" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase">Back Side</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black mb-2 dark:text-white">Select Your Seat</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Choose your preferred spot</p>
            </div>

            <div className="max-w-xs mx-auto bg-zinc-50 dark:bg-zinc-800 p-8 rounded-[40px] shadow-inner">
              <div className="grid grid-cols-4 gap-3">
                {seats.map((s) => (
                  <button
                    key={s.id}
                    disabled={s.isOccupied}
                    onClick={() => setSelectedSeat(s.id)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                      s.isOccupied 
                        ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                        : selectedSeat === s.id 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                          : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-700"
                    )}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-sm"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded-sm"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase">Occupied</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black dark:text-white">Ready to Book!</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-bold max-w-xs mx-auto">
              Your documents have been verified and seat {selectedSeat} is reserved.
            </p>
            
            <div className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 text-left space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase">Ticket Price</span>
                <span className="text-lg font-black dark:text-white">{type === 'flight' ? "$450.00" : "$45.00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase">Seat Number</span>
                <span className="text-lg font-black text-blue-600">{selectedSeat}</span>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700 flex justify-between items-center">
                <span className="text-sm font-black dark:text-white">Total Amount</span>
                <span className="text-2xl font-black text-zinc-900 dark:text-white">{type === 'flight' ? "$450.00" : "$45.00"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-700">
        <button 
          onClick={handleContinue}
          disabled={step === 2 && !selectedSeat}
          className="w-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {step === 3 ? "Complete Booking" : "Continue"}
        </button>
      </div>
    </div>
  );
};

const TripPlanner = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to Venzgo Trip Planner! 🌍\n\nI can help you plan your entire journey. Ask me about:\n- 📍 Destinations & hidden gems\n- 🏨 Hotel recommendations\n- ✈️ Flight options & tips\n- 🎡 Activities & local experiences\n\nWhere would you like to go?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { 
            role: 'user', 
            parts: [{ 
              text: `You are Venzgo Trip Planner, a world-class travel expert. 
              Help the user plan their trip. Provide detailed information about destinations, hotels, flights, and activities. 
              Use markdown for formatting (bold, lists, etc.). 
              Be helpful, professional, and inspiring.
              
              User query: ${userMsg}` 
            }] 
          }
        ],
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the travel database. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 border-b border-zinc-100 flex items-center gap-4 bg-white sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-black">Trip Planner</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Travel Assistant</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/50">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}
          >
            <div className={cn(
              "max-w-[90%] p-4 rounded-3xl text-sm shadow-sm",
              m.role === 'user' 
                ? "bg-zinc-900 text-white rounded-tr-none" 
                : "bg-white text-zinc-800 rounded-tl-none border border-zinc-100"
            )}>
              <div className="markdown-body prose prose-sm prose-zinc">
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm">
              <div className="flex gap-1">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-zinc-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Where to next?"
            className="flex-1 bg-zinc-100 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CourierBookingView = ({ onBack, onConfirm }: { onBack: () => void, onConfirm: (data: any) => void }) => {
  const [weight, setWeight] = useState(1);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  
  const recommendations = weight <= 5 ? [
    { id: 'bike', name: 'Bike', icon: Bike, capacity: 'Up to 5kg', price: '$5.00', desc: 'Fastest for small items' },
    { id: 'car', name: 'Economy Car', icon: Car, capacity: 'Up to 20kg', price: '$12.00', desc: 'Safe & Weatherproof' }
  ] : [
    { id: 'freight_small', name: 'Small Truck', icon: Truck, capacity: 'Up to 100kg', price: '$25.00', desc: 'For heavy parcels' },
    { id: 'freight_large', name: 'Large Truck', icon: Truck, capacity: 'Up to 500kg', price: '$55.00', desc: 'Bulk delivery' }
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black dark:text-white">Courier Booking</h2>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
            <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Pickup Location</label>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <input 
                type="text" 
                placeholder="Enter pickup address"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none dark:text-white"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
            <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Drop-off Location</label>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <input 
                type="text" 
                placeholder="Enter destination address"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black dark:text-white">Package Weight</h3>
            <span className="text-blue-600 font-black">{weight} kg</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-400">
            <span>1 kg</span>
            <span>100 kg</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">Recommended Vehicles</h3>
          {recommendations.map((v) => (
            <button 
              key={v.id}
              onClick={() => onConfirm({ pickup, dropoff, weight, vehicle: v })}
              className="w-full bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between hover:border-blue-600 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black dark:text-white">{v.name}</h4>
                  <p className="text-[10px] font-bold text-zinc-400">{v.capacity} • {v.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-blue-600">{v.price}</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase">Est. Price</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const BiddingView = ({ onBack, onSelect }: { onBack: () => void, onSelect: (bid: any) => void }) => {
  const bids = [
    { id: 1, driver: 'Ahmed Khan', rating: 4.9, car: 'Toyota Corolla', plate: 'PAK-123', price: 12.50, distance: '0.8 km away', img: 'https://i.pravatar.cc/150?u=ahmed' },
    { id: 2, driver: 'Sarah Malik', rating: 4.8, car: 'Honda Civic', plate: 'LHR-789', price: 11.00, distance: '1.2 km away', img: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 3, driver: 'Zubair Ali', rating: 4.7, car: 'Suzuki Swift', plate: 'KHI-456', price: 10.50, distance: '2.5 km away', img: 'https://i.pravatar.cc/150?u=zubair' },
    { id: 4, driver: 'Maria J.', rating: 5.0, car: 'Tesla Model 3', plate: 'VIP-001', price: 15.00, distance: '0.5 km away', img: 'https://i.pravatar.cc/150?u=maria' },
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-zinc-900 text-white flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black">Driver Bids</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">4 Drivers bidding...</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
          <LayoutGrid className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {bids.map((bid) => (
          <motion.div 
            key={bid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={bid.img} alt={bid.driver} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <h4 className="text-sm font-black dark:text-white">{bid.driver}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-blue-600 fill-current" />
                    <span className="text-[10px] font-bold text-zinc-400">{bid.rating} • {bid.distance}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">${bid.price.toFixed(2)}</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Offer Price</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-2xl mb-4">
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black dark:text-white">{bid.car}</p>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase">{bid.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-[8px] font-black text-emerald-600 uppercase">Verified</span>
              </div>
            </div>

            <button 
              onClick={() => onSelect(bid)}
              className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Accept Offer
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const HotelBookingView = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'luxury'>('standard');
  const hotels = [
    { id: 1, name: 'Pearl Continental', type: 'luxury', price: '$250', rating: 4.9, distance: '2.4 km', reviews: 1240, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop', services: ['Pool', 'Spa', 'Gym', 'Breakfast'] },
    { id: 2, name: 'City Inn', type: 'standard', price: '$45', rating: 4.2, distance: '0.8 km', reviews: 450, img: 'https://images.unsplash.com/photo-1551882547-ff43c63fe78d?q=80&w=400&auto=format&fit=crop', services: ['Wifi', 'AC', 'Parking'] },
    { id: 3, name: 'Marriott Executive', type: 'luxury', price: '$320', rating: 5.0, distance: '3.1 km', reviews: 890, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop', services: ['All-inclusive', 'Beach Access', 'Butler'] },
    { id: 4, name: 'Budget Stay', type: 'standard', price: '$25', rating: 3.8, distance: '1.2 km', reviews: 120, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&auto=format&fit=crop', services: ['Wifi', 'Shared Kitchen'] },
  ];

  const filteredHotels = hotels.filter(h => h.type === activeTab);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black dark:text-white">Hotels</h2>
        <div className="w-10 h-10" />
      </div>

      <div className="flex bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 shrink-0">
        <button 
          onClick={() => setActiveTab('standard')}
          className={cn("flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'standard' ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400")}
        >
          Standard
        </button>
        <button 
          onClick={() => setActiveTab('luxury')}
          className={cn("flex-1 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all", activeTab === 'luxury' ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400")}
        >
          Luxury
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {filteredHotels.map((hotel) => (
          <motion.div 
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm"
          >
            <div className="relative h-48">
              <img src={hotel.img} alt={hotel.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 text-blue-600 fill-current" />
                <span className="text-xs font-black dark:text-white">{hotel.rating}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-black dark:text-white">{hotel.name}</h3>
                  <p className="text-xs font-bold text-zinc-400">{hotel.distance} from you • {hotel.reviews} reviews</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-600">{hotel.price}</p>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase">per night</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {hotel.services.map((s, i) => (
                  <span key={i} className="text-[8px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 px-2.5 py-1 rounded-lg border border-zinc-100 dark:border-zinc-600">
                    {s}
                  </span>
                ))}
              </div>
              <button className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 shadow-lg active:scale-95 transition-all">
                Book Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RentalCarsView = ({ onBack }: { onBack: () => void }) => {
  const [mode, setMode] = useState<'choice' | 'list'>('choice');
  const cars = [
    { id: 1, name: 'Toyota Corolla 2022', price: '$45/day', mileage: '12,400 km', rating: 4.8, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop' },
    { id: 2, name: 'Honda Civic 2023', price: '$55/day', mileage: '5,200 km', rating: 4.9, img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=400&auto=format&fit=crop' },
    { id: 3, name: 'Range Rover Sport', price: '$150/day', mileage: '8,900 km', rating: 5.0, img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=400&auto=format&fit=crop' },
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black dark:text-white">Rental Cars</h2>
        <div className="w-10 h-10" />
      </div>

      {mode === 'choice' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[40px] flex items-center justify-center">
            <Key className="w-12 h-12 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black dark:text-white mb-2">Plan your trip</h3>
            <p className="text-sm font-bold text-zinc-400">Do you want to use your own vehicle or rent one from us?</p>
          </div>
          <div className="w-full space-y-4">
            <button 
              onClick={() => setMode('list')}
              className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <Car className="w-5 h-5" />
              Rent a Vehicle
            </button>
            <button 
              onClick={onBack}
              className="w-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white py-6 rounded-[32px] font-black text-sm uppercase tracking-widest border border-zinc-100 dark:border-zinc-700 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              <User className="w-5 h-5" />
              Use My Own
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cars.map((car) => (
            <motion.div 
              key={car.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm flex"
            >
              <div className="w-1/3">
                <img src={car.img} alt={car.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 p-5">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-black dark:text-white">{car.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-blue-600 fill-current" />
                    <span className="text-[10px] font-black dark:text-white">{car.rating}</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 mb-4">{car.mileage} driven</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-blue-600">{car.price}</p>
                  <button className="bg-zinc-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    Rent
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrainBookingView = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState<'search' | 'seats' | 'summary'>('search');
  const trains = [
    { id: 1, name: 'Green Line Express', from: 'Lahore', to: 'Karachi', time: '16:00 - 08:00', price: '$45', class: 'Business' },
    { id: 2, name: 'Karakoram Express', from: 'Lahore', to: 'Karachi', time: '14:00 - 06:00', price: '$30', class: 'Economy' },
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black dark:text-white">Train Booking</h2>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {step === 'search' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm space-y-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-2xl">
                <MapPin className="w-5 h-5 text-blue-600" />
                <input type="text" placeholder="From" className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none dark:text-white w-full" defaultValue="Lahore" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-700 rounded-2xl">
                <MapPin className="w-5 h-5 text-red-600" />
                <input type="text" placeholder="To" className="bg-transparent border-none text-sm font-bold focus:ring-0 outline-none dark:text-white w-full" defaultValue="Karachi" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">Available Trains</h3>
              {trains.map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setStep('seats')}
                  className="w-full bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm text-left hover:border-blue-600 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-black dark:text-white">{t.name}</h4>
                      <p className="text-xs font-bold text-zinc-400">{t.class} Class</p>
                    </div>
                    <p className="text-xl font-black text-blue-600">{t.price}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold dark:text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>{t.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Train className="w-4 h-4 text-zinc-400" />
                      <span>Daily</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'seats' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-xl font-black dark:text-white mb-2">Select Seats</h3>
              <p className="text-xs font-bold text-zinc-400">Choose your preferred seats in the cabin.</p>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-[280px] mx-auto">
              {Array.from({ length: 20 }).map((_, i) => (
                <button 
                  key={i}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                    i % 5 === 0 ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 cursor-not-allowed" : 
                    i === 7 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 dark:text-white"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setStep('summary')}
              className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Confirm Seats
            </button>
          </div>
        )}

        {step === 'summary' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[40px] border border-emerald-100 dark:border-emerald-900/30 text-center">
              <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mb-2">Ready to Book!</h3>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Your seats are reserved. Complete the payment to finalize.</p>
            </div>
            <button 
              onClick={onBack}
              className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              Pay $45.00
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const LogisticsDashboard = ({ onBack }: { onBack: () => void }) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  
  const modules = [
    { id: 'oms', label: 'Order Mgmt (OMS)', icon: ClipboardList, color: 'bg-blue-500', desc: 'Receive & Manage Orders' },
    { id: 'tms', label: 'Transport (TMS)', icon: Navigation, color: 'bg-emerald-500', desc: 'Dispatch & Route Planning' },
    { id: 'wms', label: 'Warehouse (WMS)', icon: Warehouse, color: 'bg-purple-500', desc: 'Picking, Packing & Racking' },
    { id: 'inventory', label: 'Inventory', icon: Box, color: 'bg-amber-500', desc: 'Real-time Stock Control' },
    { id: 'fleet', label: 'Fleet & Fuel', icon: Truck, color: 'bg-rose-500', desc: 'Maintenance & Fuel Tracking' },
    { id: 'billing', label: 'Billing & B2B', icon: Receipt, color: 'bg-indigo-500', desc: 'Invoicing & 3PL Partners' },
  ];

  const shipments = [
    { id: 'VZ-9012', status: 'In Transit', origin: 'Dubai Port', destination: 'Karachi Hub', progress: 65, eta: '2h 15m' },
    { id: 'VZ-4432', status: 'Processing', origin: 'Shenzhen', destination: 'Lahore Warehouse', progress: 15, eta: '3 days' },
    { id: 'VZ-1102', status: 'Delivered', origin: 'London', destination: 'Islamabad HQ', progress: 100, eta: 'Completed' },
  ];

  const inventoryItems = [
    { item: 'Medical Supplies', stock: 1240, status: 'Healthy', color: 'bg-emerald-500' },
    { item: 'Electronics', stock: 450, status: 'Low Stock', color: 'bg-amber-500' },
    { item: 'Textiles', stock: 2800, status: 'Healthy', color: 'bg-emerald-500' },
    { item: 'Auto Parts', stock: 85, status: 'Critical', color: 'bg-red-500' },
  ];

  const renderModuleView = () => {
    switch (activeModule) {
      case 'oms':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-black dark:text-white">Order Management</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">New Order</button>
            </div>
            <div className="space-y-4">
              {[
                { id: 'ORD-7721', client: 'Amazon B2B', items: 12, status: 'Pending', date: 'Just now' },
                { id: 'ORD-6612', client: 'Local Retailer', items: 5, status: 'Processing', date: '2h ago' },
                { id: 'ORD-5501', client: 'Global Tech', items: 45, status: 'Shipped', date: 'Yesterday' },
              ].map((order) => (
                <div key={order.id} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-black dark:text-white">{order.id}</h4>
                      <p className="text-[10px] font-bold text-zinc-400">{order.client}</p>
                    </div>
                    <span className="text-[8px] font-black px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-lg uppercase tracking-widest dark:text-white">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[10px] font-bold text-zinc-400">{order.items} Units • {order.date}</p>
                    <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tms':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-black dark:text-white mb-2">Transport & Route Optimization</h3>
            <div className="bg-zinc-900 rounded-[32px] p-6 text-white relative overflow-hidden h-48 mb-6">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Smart Route Optimization</p>
                <h4 className="text-xl font-black italic mb-4">Route #882 Optimized</h4>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] font-bold opacity-60 uppercase">Fuel Saved</p>
                    <p className="text-lg font-black text-emerald-400">12.5%</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold opacity-60 uppercase">Time Saved</p>
                    <p className="text-lg font-black text-blue-400">45m</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Navigation className="w-40 h-40 rotate-12" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Carrier Selection</h4>
              {[
                { name: 'Venzgo Fleet', type: 'Internal', rating: 4.9, cost: 'Low' },
                { name: 'DHL Express', type: '3PL Partner', rating: 4.8, cost: 'High' },
                { name: 'Local Freight', type: 'Contractor', rating: 4.5, cost: 'Medium' },
              ].map((carrier, i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-black dark:text-white">{carrier.name}</h5>
                    <p className="text-[10px] font-bold text-zinc-400">{carrier.type} • {carrier.cost} Cost</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-xs font-black dark:text-white">{carrier.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'wms':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-black dark:text-white mb-2">Warehouse Management</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm text-center">
                <p className="text-[8px] font-black text-zinc-400 uppercase mb-2">Picking Efficiency</p>
                <h3 className="text-2xl font-black text-blue-600">94%</h3>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm text-center">
                <p className="text-[8px] font-black text-zinc-400 uppercase mb-2">Racking Capacity</p>
                <h3 className="text-2xl font-black text-emerald-600">82%</h3>
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-[40px] border border-zinc-100 dark:border-zinc-700">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Active Picking List</h4>
              <div className="space-y-4">
                {[
                  { item: 'SKU-001: Lithium Batteries', rack: 'A-12-4', qty: 50, status: 'Picking' },
                  { item: 'SKU-092: Solar Panels', rack: 'B-04-1', qty: 12, status: 'Packed' },
                  { item: 'SKU-112: Control Units', rack: 'C-01-9', qty: 100, status: 'Pending' },
                ].map((pick, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-zinc-50 dark:border-zinc-700 last:border-0 last:pb-0">
                    <div>
                      <h5 className="text-xs font-black dark:text-white">{pick.item}</h5>
                      <p className="text-[10px] font-bold text-zinc-400">Rack: {pick.rack} • Qty: {pick.qty}</p>
                    </div>
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{pick.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="bg-zinc-900 dark:bg-blue-600 rounded-[32px] p-6 text-white flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold opacity-60 uppercase tracking-widest">Total Inventory Value</h4>
                <h2 className="text-2xl font-black">$2.4M</h2>
              </div>
              <BarChart3 className="w-10 h-10 opacity-20" />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Real-time Stock Levels</h4>
              {inventoryItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                    <div>
                      <h5 className="text-sm font-black dark:text-white">{item.item}</h5>
                      <p className="text-[10px] font-bold text-zinc-400">{item.stock} Units</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                    item.status === 'Healthy' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'fleet':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-black dark:text-white mb-2">Fleet & Maintenance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-4 h-4 text-rose-500" />
                  <p className="text-[8px] font-black text-zinc-400 uppercase">Fuel Usage</p>
                </div>
                <h3 className="text-xl font-black dark:text-white">4.2k L</h3>
                <p className="text-[8px] font-bold text-emerald-500">-5% vs last month</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <p className="text-[8px] font-black text-zinc-400 uppercase">Maintenance</p>
                </div>
                <h3 className="text-xl font-black dark:text-white">2 Alerts</h3>
                <p className="text-[8px] font-bold text-rose-500">Action Required</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Driver Status (Fleet App)</h4>
              {[
                { name: 'Ahmed Khan', vehicle: 'Truck #901', status: 'On Route', fuel: '75%', docExpiry: '120 days' },
                { name: 'Sara Ali', vehicle: 'Van #442', status: 'Resting', fuel: '20%', docExpiry: '12 days' },
                { name: 'John Doe', vehicle: 'Truck #110', status: 'Loading', fuel: '95%', docExpiry: '300 days' },
              ].map((driver, i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-2xl flex items-center justify-center text-xl">🚛</div>
                      <div>
                        <h5 className="text-sm font-black dark:text-white">{driver.name}</h5>
                        <p className="text-[10px] font-bold text-zinc-400">{driver.vehicle}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg uppercase tracking-widest">
                      {driver.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50 dark:border-zinc-700">
                    <div>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">Fuel Level</p>
                      <p className="text-xs font-black dark:text-white">{driver.fuel}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase">Doc Expiry</p>
                      <p className={cn("text-xs font-black", parseInt(driver.docExpiry) < 30 ? "text-rose-500" : "dark:text-white")}>
                        {driver.docExpiry}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-black dark:text-white mb-2">Billing, B2B & 3PL</h3>
            <div className="bg-indigo-600 rounded-[32px] p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-900/20">
              <div>
                <h4 className="text-xs font-bold opacity-60 uppercase tracking-widest">Pending Invoices</h4>
                <h2 className="text-2xl font-black">$142,500</h2>
              </div>
              <Receipt className="w-10 h-10 opacity-20" />
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">B2B Partners (3PL)</h4>
              {[
                { name: 'Global Logistics Inc.', type: '3PL Partner', volume: 'High', status: 'Active' },
                { name: 'Retail Giant Co.', type: 'B2B Client', volume: 'Medium', status: 'Active' },
                { name: 'FastShip Solutions', type: 'Carrier Partner', volume: 'Low', status: 'Review' },
              ].map((partner, i) => (
                <div key={i} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-black dark:text-white">{partner.name}</h5>
                      <p className="text-[10px] font-bold text-zinc-400">{partner.type} • {partner.volume} Vol</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase text-zinc-400">{partner.status}</span>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-[40px] border border-zinc-100 dark:border-zinc-700">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Recent Automated Invoices</h4>
              <div className="space-y-4">
                {['INV-9012', 'INV-8821', 'INV-7712'].map((inv) => (
                  <div key={inv} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs font-black dark:text-white">{inv}</span>
                    </div>
                    <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div className="bg-zinc-900 dark:bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2 italic">Supply Chain Hub</h3>
                <p className="text-sm font-bold opacity-80">End-to-end logistics & operations management.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Layers className="w-32 h-32 rotate-12" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className="bg-white dark:bg-zinc-800 p-6 rounded-[40px] border border-zinc-100 dark:border-zinc-700 text-left group active:scale-95 transition-all shadow-sm"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg", mod.color)}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black dark:text-white mb-1">{mod.label}</h4>
                  <p className="text-[9px] font-bold text-zinc-400 leading-tight">{mod.desc}</p>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-tight dark:text-white">Active Operations</h4>
                <button className="text-xs font-bold text-blue-600">View Map</button>
              </div>
              <div className="space-y-4">
                {shipments.slice(0, 2).map((s) => (
                  <div key={s.id} className="bg-white dark:bg-zinc-800 p-5 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-sm font-black dark:text-white">{s.id}</h5>
                        <p className="text-[10px] font-bold text-zinc-400">{s.origin} → {s.destination}</p>
                      </div>
                      <span className="text-[8px] font-black px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg uppercase tracking-widest">
                        {s.status}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${s.progress}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-zinc-900 text-white flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => activeModule ? setActiveModule(null) : onBack()} 
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black italic">
              {activeModule ? modules.find(m => m.id === activeModule)?.label : 'Venzgo Logistics'}
            </h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              {activeModule ? 'Module Control' : 'Supply Chain Control'}
            </p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Box className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {renderModuleView()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700 px-6 py-4 flex items-center justify-between sticky bottom-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button onClick={() => onBack()} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <Smartphone className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setActiveModule(null)}
          className={cn("flex flex-col items-center gap-1", !activeModule ? "text-blue-600" : "text-zinc-300 dark:text-zinc-500")}
        >
          <Box className="w-6 h-6" />
          <span className="text-[10px] font-bold">Logistics</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Operations</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">History</span>
        </button>
      </div>
    </div>
  );
};

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders' | 'users' | 'promotions'>('dashboard');

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black italic">Admin Panel</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">System Control Hub</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      <div className="flex bg-zinc-800 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'inventory', label: 'Inventory', icon: Box },
          { id: 'orders', label: 'Orders', icon: ClipboardList },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'promotions', label: 'Promotions', icon: Gift },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 shrink-0",
              activeTab === tab.id ? "border-blue-600 text-blue-600 bg-blue-600/5" : "border-transparent text-zinc-500"
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Total Revenue</p>
                <h3 className="text-xl font-black">$42,850.00</h3>
                <p className="text-[8px] font-bold text-emerald-400 mt-1">+12% from last week</p>
              </div>
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Active Orders</p>
                <h3 className="text-xl font-black">156</h3>
                <p className="text-[8px] font-bold text-blue-400 mt-1">24 pending dispatch</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[40px] p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Fleet Performance</h4>
                <h3 className="text-2xl font-black mb-6">98.2% On-Time</h3>
                <div className="flex gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-xl">
                    <p className="text-[8px] font-bold opacity-60 uppercase">Active Riders</p>
                    <p className="text-sm font-black">42</p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl">
                    <p className="text-[8px] font-bold opacity-60 uppercase">Avg Delivery</p>
                    <p className="text-sm font-black">24m</p>
                  </div>
                </div>
              </div>
              <Activity className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/5 rotate-[-15deg]" />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Popular Products</h4>
              {[
                { name: 'Fresh Red Apples', sales: 1240, stock: 45, trend: 'up' },
                { name: 'Organic Milk', sales: 850, stock: 12, trend: 'down' },
                { name: 'Beef Steak', sales: 420, stock: 8, trend: 'up' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-lg">🍎</div>
                    <div>
                      <h5 className="text-xs font-black">{item.name}</h5>
                      <p className="text-[10px] font-bold text-zinc-500">{item.sales} sold • {item.stock} in stock</p>
                    </div>
                  </div>
                  <TrendingUp className={cn("w-4 h-4", item.trend === 'up' ? "text-emerald-400" : "text-rose-400 rotate-180")} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black italic">Inventory Management</h3>
              <button className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Add Product</button>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Fresh Red Apples', price: '$4.50', stock: 45, category: 'Fruits' },
                { name: 'Organic Milk', price: '$2.20', stock: 0, category: 'Dairy' },
                { name: 'Beef Steak', price: '$18.00', stock: 8, category: 'Meat' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-5 rounded-[32px] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-black">{item.name}</h5>
                    <p className="text-[10px] font-bold text-zinc-500">{item.category} • {item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-black", item.stock === 0 ? "text-rose-500" : "text-emerald-400")}>
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </p>
                    <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black italic">Order Management</h3>
            <div className="space-y-4">
              {[
                { id: 'ORD-1024', customer: 'Taha Zaheer', total: '$45.20', status: 'Pending', time: '2m ago' },
                { id: 'ORD-1023', customer: 'Ahmed Khan', total: '$12.50', status: 'Dispatched', time: '15m ago' },
                { id: 'ORD-1022', customer: 'Sara Ali', total: '$84.00', status: 'Delivered', time: '1h ago' },
              ].map((order) => (
                <div key={order.id} className="bg-white/5 p-5 rounded-[32px] border border-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="text-sm font-black">{order.id}</h5>
                      <p className="text-[10px] font-bold text-zinc-500">{order.customer} • {order.time}</p>
                    </div>
                    <span className={cn(
                      "text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                      order.status === 'Pending' ? "bg-amber-500/20 text-amber-500" : 
                      order.status === 'Dispatched' ? "bg-blue-500/20 text-blue-500" : "bg-emerald-500/20 text-emerald-500"
                    )}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <p className="text-sm font-black">{order.total}</p>
                    <div className="flex gap-2">
                      <button className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Details</button>
                      {order.status === 'Pending' && (
                        <button className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Assign</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black italic">User Management</h3>
            <div className="space-y-4">
              {[
                { name: 'Taha Zaheer', email: 'taha@example.com', role: 'Admin' },
                { name: 'Ahmed Khan', email: 'ahmed@example.com', role: 'Driver' },
                { name: 'Sara Ali', email: 'sara@example.com', role: 'User' },
              ].map((user, i) => (
                <div key={i} className="bg-white/5 p-5 rounded-[32px] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black">
                      {user.name[0]}
                    </div>
                    <div>
                      <h5 className="text-sm font-black">{user.name}</h5>
                      <p className="text-[10px] font-bold text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded-lg uppercase tracking-widest">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Campaigns</h4>
              <button className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Create New</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'PROM-1', name: 'Ramadan Special', discount: '20%', status: 'Active', usage: '1.2k' },
                { id: 'PROM-2', name: 'New User Offer', discount: '$10', status: 'Active', usage: '450' },
                { id: 'PROM-3', name: 'Weekend Flash', discount: '15%', status: 'Scheduled', usage: '0' },
              ].map((promo) => (
                <div key={promo.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-black">{promo.name}</h5>
                    <p className="text-[10px] font-bold text-zinc-500">{promo.discount} Off • {promo.usage} used</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                      promo.status === 'Active' ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-500/20 text-zinc-500"
                    )}>
                      {promo.status}
                    </span>
                    <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InAppChat = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can we help you today?", sender: 'support', time: '10:00 AM' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'user', time: '10:05 AM' }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Thanks for reaching out. A support agent will be with you shortly.", sender: 'support', time: '10:06 AM' }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-black dark:text-white">Venzgo Support</h2>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online • Typical reply 2m</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn("flex flex-col", msg.sender === 'user' ? "items-end" : "items-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-[24px] text-sm font-bold shadow-sm",
              msg.sender === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-zinc-100 dark:bg-zinc-800 dark:text-white rounded-tl-none"
            )}>
              {msg.text}
            </div>
            <span className="text-[8px] font-bold text-zinc-400 mt-1 uppercase">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your message..." 
            className="flex-1 bg-zinc-50 dark:bg-zinc-700 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none dark:text-white"
          />
          <button 
            onClick={send}
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DriverRegistration = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [docs, setDocs] = useState({ license: false, idCard: false, vehicleReg: false });

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white p-8">
      <div className="mb-12">
        <h2 className="text-3xl font-black italic mb-2">Join Venzgo Fleet</h2>
        <p className="text-sm font-bold text-zinc-500">Become a delivery partner and start earning.</p>
      </div>

      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black", step >= 1 ? "bg-blue-600" : "bg-zinc-800")}>1</div>
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className={cn("h-full bg-blue-600 transition-all", step >= 2 ? "w-full" : "w-0")} />
          </div>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black", step >= 2 ? "bg-blue-600" : "bg-zinc-800")}>2</div>
          <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className={cn("h-full bg-blue-600 transition-all", step >= 3 ? "w-full" : "w-0")} />
          </div>
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black", step >= 3 ? "bg-blue-600" : "bg-zinc-800")}>3</div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black">Personal Details</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold outline-none" />
              <input type="email" placeholder="Email Address" className="w-full bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold outline-none" />
              <input type="tel" placeholder="Phone Number" className="w-full bg-zinc-800 border-none rounded-2xl p-5 text-sm font-bold outline-none" />
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-black">Document Verification</h3>
            <div className="space-y-3">
              {[
                { id: 'license', label: 'Driving License', icon: FileText },
                { id: 'idCard', label: 'National ID Card', icon: User },
                { id: 'vehicleReg', label: 'Vehicle Registration', icon: Truck },
              ].map(doc => (
                <button 
                  key={doc.id}
                  onClick={() => setDocs(prev => ({ ...prev, [doc.id]: true }))}
                  className={cn(
                    "w-full p-6 rounded-3xl border flex items-center justify-between transition-all",
                    docs[doc.id as keyof typeof docs] ? "bg-emerald-900/20 border-emerald-500" : "bg-zinc-800 border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <doc.icon className={cn("w-6 h-6", docs[doc.id as keyof typeof docs] ? "text-emerald-500" : "text-zinc-500")} />
                    <span className="text-sm font-black">{doc.label}</span>
                  </div>
                  {docs[doc.id as keyof typeof docs] ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Plus className="w-6 h-6 text-zinc-500" />}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!Object.values(docs).every(Boolean)}
                className="flex-[2] bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-24 h-24 bg-emerald-500 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-900/40">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-black">Verification Pending</h3>
            <p className="text-sm font-bold text-zinc-500">Our team is reviewing your documents. This usually takes 24-48 hours.</p>
            <div className="bg-zinc-800 p-6 rounded-3xl text-left border border-white/5">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Next Steps</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Background check
                </li>
                <li className="flex items-center gap-3 text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Vehicle inspection
                </li>
                <li className="flex items-center gap-3 text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  Training session
                </li>
              </ul>
            </div>
            <button onClick={onComplete} className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-widest">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

const DriverDashboard = ({ onBack }: { onBack: () => void }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);

  if (!isVerified) {
    return <DriverRegistration onComplete={() => setIsVerified(true)} />;
  }

  const jobs = [
    { id: 'JOB-101', pickup: 'Warehouse A', dropoff: 'City Center', payout: '$45.00', distance: '12km' },
    { id: 'JOB-102', pickup: 'Port Terminal', dropoff: 'Industrial Zone', payout: '$120.00', distance: '35km' },
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black italic">Driver App</h2>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {isOnline ? 'Online • Accepting Jobs' : 'Offline'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            isOnline ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
          )}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeJob ? (
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-[40px] p-8">
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Active Mission</p>
              <h3 className="text-2xl font-black mb-6">{activeJob.id}</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-0.5 flex-1 bg-white/20 my-1"></div>
                    <div className="w-2 h-2 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[8px] font-bold opacity-60 uppercase">Pickup</p>
                      <p className="text-sm font-black">{activeJob.pickup}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-bold opacity-60 uppercase">Dropoff</p>
                      <p className="text-sm font-black">{activeJob.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white/10 p-6 rounded-[32px] flex flex-col items-center gap-2">
                <Navigation className="w-6 h-6 text-blue-400" />
                <span className="text-[10px] font-black uppercase">Navigate</span>
              </button>
              <button className="bg-white/10 p-6 rounded-[32px] flex flex-col items-center gap-2">
                <QrCode className="w-6 h-6 text-emerald-400" />
                <span className="text-[10px] font-black uppercase">Scan ePOD</span>
              </button>
            </div>

            <button 
              onClick={() => setActiveJob(null)}
              className="w-full bg-emerald-600 py-6 rounded-[32px] text-sm font-black uppercase tracking-widest"
            >
              Complete Delivery
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Today's Earnings</p>
                <h3 className="text-xl font-black">$284.50</h3>
              </div>
              <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Deliveries</p>
                <h3 className="text-xl font-black">12</h3>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Available Jobs</h4>
              {isOnline ? (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-black">{job.id}</h5>
                      <p className="text-[10px] font-bold text-zinc-500">{job.distance} • {job.payout}</p>
                    </div>
                    <button 
                      onClick={() => setActiveJob(job)}
                      className="bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 opacity-40">
                  <Truck className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-xs font-bold">Go online to see available jobs</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-800 border-t border-white/5 flex items-center justify-between">
        <button className="flex flex-col items-center gap-1 text-blue-400">
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-bold">Jobs</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-500">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] font-bold">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-500">
          <Settings className="w-6 h-6" />
          <span className="text-[10px] font-bold">Vehicle</span>
        </button>
      </div>
    </div>
  );
};

const GroceryStore = ({ onBack, onTrack, onSupport }: { onBack: () => void, onTrack: () => void, onSupport: () => void }) => {
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{id: number, qty: number}[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [timeSlot, setTimeSlot] = useState('ASAP');

  const categories = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Snacks', 'Bakery'];
  
  const products = [
    { id: 1, name: 'Fresh Red Apples', price: 4.50, unit: 'kg', cat: 'Fruits', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?q=80&w=400&auto=format&fit=crop', stock: 45, brand: 'Nature Fresh' },
    { id: 2, name: 'Organic Milk', price: 2.20, unit: '1L', cat: 'Dairy', img: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?q=80&w=400&auto=format&fit=crop', stock: 0, brand: 'Dairy Pure' },
    { id: 3, name: 'Beef Steak', price: 18.00, unit: '500g', cat: 'Meat', img: 'https://images.unsplash.com/photo-1546248136-3d63e7e28f90?q=80&w=400&auto=format&fit=crop', stock: 8, brand: 'Prime Cuts' },
    { id: 4, name: 'Fresh Broccoli', price: 1.80, unit: 'pc', cat: 'Vegetables', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?q=80&w=400&auto=format&fit=crop', stock: 20, brand: 'Green Farm' },
    { id: 5, name: 'Whole Wheat Bread', price: 3.50, unit: 'loaf', cat: 'Bakery', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop', stock: 15, brand: 'Bake House' },
    { id: 6, name: 'Lays Classic', price: 1.50, unit: 'bag', cat: 'Snacks', img: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?q=80&w=400&auto=format&fit=crop', stock: 100, brand: 'Lays' },
  ];

  const filtered = products.filter(p => {
    const matchesCat = category === 'All' || p.cat === category;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id, qty: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => {
    const product = products.find(p => p.id === item.id);
    return acc + (product?.price || 0) * item.qty;
  }, 0);

  if (showCheckout) {
    return (
      <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
        <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center gap-4">
          <button onClick={() => setShowCheckout(false)} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <h2 className="text-xl font-black dark:text-white">Checkout</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-white mb-4">Delivery Time Slot</h3>
            <div className="grid grid-cols-2 gap-3">
              {['ASAP (30 min)', '02:00 - 04:00 PM', '04:00 - 06:00 PM', 'Tomorrow AM'].map(slot => (
                <button 
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={cn(
                    "p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                    timeSlot === slot ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-400"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-white mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { id: 'COD', label: 'Cash on Delivery', icon: Banknote },
                { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'JAZZCASH', label: 'JazzCash', icon: Smartphone },
                { id: 'EASYPAISA', label: 'EasyPaisa', icon: Smartphone },
              ].map(method => (
                <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "w-full p-5 rounded-[32px] border flex items-center justify-between transition-all",
                    paymentMethod === method.id ? "bg-blue-50 dark:bg-blue-900/20 border-blue-600" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <method.icon className={cn("w-5 h-5", paymentMethod === method.id ? "text-blue-600" : "text-zinc-400")} />
                    <span className={cn("text-sm font-black", paymentMethod === method.id ? "dark:text-white" : "text-zinc-500")}>{method.label}</span>
                  </div>
                  <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", paymentMethod === method.id ? "border-blue-600" : "border-zinc-200")}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-zinc-800 p-6 rounded-[40px] border border-zinc-100 dark:border-zinc-700">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">Subtotal</span>
              <span className="text-xs font-black dark:text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">Delivery Fee</span>
              <span className="text-xs font-black text-emerald-500">FREE</span>
            </div>
            <div className="h-px bg-zinc-50 dark:bg-zinc-700 my-4" />
            <div className="flex justify-between">
              <span className="text-sm font-black dark:text-white">Total</span>
              <span className="text-lg font-black text-blue-600">${cartTotal.toFixed(2)}</span>
            </div>
          </section>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700">
          <button 
            onClick={onTrack}
            className="w-full bg-blue-600 text-white py-5 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Place Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black dark:text-white">Venzgo Grocery</h2>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-current" />
              <span className="text-[10px] font-black text-amber-600">Loyalty: 1,240 pts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onSupport}
            className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-zinc-50 dark:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400">
            <Heart className={cn("w-5 h-5", wishlist.length > 0 && "fill-rose-500 text-rose-500")} />
          </button>
          <button className="relative w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-800">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-zinc-800 shrink-0 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search products or brands..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-700 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none dark:text-white"
          />
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                category === cat ? "bg-zinc-900 dark:bg-blue-600 border-zinc-900 dark:border-blue-600 text-white" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-400"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* AI Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">AI Recommendations</h3>
          </div>
          <div className="bg-zinc-900 rounded-[32px] p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-lg font-black italic mb-2">Based on your history</h4>
              <p className="text-[10px] font-bold opacity-60 mb-4">You might need these today</p>
              <div className="flex gap-2">
                <div className="bg-white/10 p-2 rounded-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">🥛</div>
                  <span className="text-[10px] font-black">Milk</span>
                </div>
                <div className="bg-white/10 p-2 rounded-xl flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">🍎</div>
                  <span className="text-[10px] font-black">Apples</span>
                </div>
              </div>
            </div>
            <Sparkles className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white/5 rotate-12" />
          </div>
        </section>

        {/* Loyalty Program */}
        <section className="bg-emerald-600 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-60">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Venzgo Rewards</span>
            </div>
            <h3 className="text-2xl font-black mb-1">1,240 Points</h3>
            <p className="text-xs font-bold opacity-80 mb-6">You're $5.00 away from your next reward!</p>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">Redeem Now</button>
          </div>
          <Star className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 rotate-12" />
        </section>

        {/* Quick Reorder */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">Quick Reorder</h3>
            <button className="text-[10px] font-black text-blue-600 uppercase">View History</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {[
              { id: 1, name: 'Fresh Red Apples', price: 4.50, img: '🍎' },
              { id: 4, name: 'Fresh Broccoli', price: 1.80, img: '🥦' },
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => addToCart(item.id)}
                className="bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-700 shrink-0 flex items-center gap-3 active:scale-95 transition-all"
              >
                <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-700 rounded-xl flex items-center justify-center text-xl">
                  {item.img}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black dark:text-white">{item.name}</p>
                  <p className="text-[8px] font-bold text-zinc-400">${item.price}</p>
                </div>
                <Plus className="w-4 h-4 text-blue-600" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-black uppercase tracking-widest dark:text-white mb-4">All Products</h3>
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm flex flex-col relative"
              >
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="bg-white text-zinc-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Out of Stock</span>
                  </div>
                )}
                <div className="relative aspect-square">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="w-8 h-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-zinc-900 dark:text-white active:scale-90 transition-transform"
                    >
                      <Heart className={cn("w-4 h-4", wishlist.includes(product.id) && "fill-rose-500 text-rose-500")} />
                    </button>
                  </div>
                  <button 
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-sm text-white active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-[8px] font-black text-blue-600 uppercase mb-1">{product.brand}</p>
                  <h4 className="text-xs font-black dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-[8px] font-bold text-zinc-400 uppercase mb-3">{product.unit}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-sm font-black text-zinc-900 dark:text-white">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                      <TrendingUp className="w-2 h-2 text-emerald-600" />
                      <span className="text-[8px] font-black text-emerald-600 uppercase">Fresh</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {cart.length > 0 && (
        <div className="p-6 bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700">
          <div className="bg-blue-600 rounded-[32px] p-5 text-white flex items-center justify-between shadow-xl shadow-blue-900/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{cart.reduce((a, b) => a + b.qty, 0)} Items in Cart</p>
                <h4 className="text-lg font-black">${cartTotal.toFixed(2)}</h4>
              </div>
            </div>
            <button 
              onClick={() => setShowCheckout(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700 px-6 py-4 flex items-center justify-between sticky bottom-0 z-30">
        <button onClick={() => onBack()} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <Smartphone className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[10px] font-bold">Grocery</span>
        </button>
        <button onClick={() => onBack()} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">Orders</span>
        </button>
      </div>
    </div>
  );
};

const GroceryTracking = ({ onBack, onSupport }: { onBack: () => void, onSupport: () => void }) => {
  return (
    <div className="h-full flex flex-col bg-zinc-900 text-white">
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div>
            <h2 className="text-xl font-black italic">Order Tracking</h2>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">On the way • ETA 12 mins</p>
          </div>
        </div>
        <button 
          onClick={onSupport}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 relative">
        <MapView origin={{ lat: 31.5204, lng: 74.3587 }} destination={{ lat: 31.5304, lng: 74.3687 }} />
        
        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          <div className="bg-zinc-900/90 backdrop-blur-md p-6 rounded-[40px] border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🛵</div>
                <div>
                  <h4 className="text-lg font-black">Ahmed Khan</h4>
                  <p className="text-xs font-bold text-zinc-400">Honda CD 70 • ABC-123</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </button>
                <button className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <p className="text-xs font-black">Order Picked Up</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <p className="text-xs font-black">Rider is on the way</p>
              </div>
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-2 h-2 bg-zinc-500 rounded-full" />
                <p className="text-xs font-black">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const TripsAdventureView = ({ onBack, onRental }: { onBack: () => void, onRental: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [aiResult, setAiResult] = useState<{
    place: string;
    country: string;
    landmarks: string[];
    estimatedCostPerPerson: number;
    description: string;
    img: string;
    itinerary: { day: number; title: string; desc: string }[];
    inclusions: string[];
    rating: number;
    reviews: number;
    duration: string;
    freeCancellation: boolean;
    instantConfirmation: boolean;
  } | null>(null);

  const fetchTripDetails = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide travel information for ${searchQuery}. 
        Return a JSON object with:
        - place: a popular city or region
        - country: the country name
        - landmarks: array of 3 famous landmarks
        - estimatedCostPerPerson: numeric value in USD for a 7-day trip
        - description: short 2-sentence description
        - img: a high-quality unsplash image URL related to the place.
        - itinerary: array of 3 objects { day: number, title: string, desc: string }
        - inclusions: array of 4 strings (e.g. "4-star Hotel", "Private Guide")
        - rating: numeric 4.5-5.0
        - reviews: numeric 100-500
        - duration: string (e.g. "7 Days", "3 Nights")
        - freeCancellation: boolean
        - instantConfirmation: boolean
        Keep it realistic.`,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      setAiResult(data);
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const trips = [
    { 
      id: 1, 
      country: 'Pakistan', 
      place: 'Hunza Valley', 
      expense: 450, 
      img: 'https://images.unsplash.com/photo-1581442123178-682529061805?q=80&w=400&auto=format&fit=crop', 
      famous: 'Rakaposhi Peak, Attabad Lake',
      description: 'Experience the breathtaking beauty of the Karakoram range. Hunza is a paradise for nature lovers and adventure seekers.',
      itinerary: [
        { day: 1, title: 'Arrival in Gilgit', desc: 'Transfer to Hunza, check-in at hotel and evening walk at Karimabad Bazaar.' },
        { day: 2, title: 'Altit & Baltit Forts', desc: 'Explore the ancient forts and enjoy the panoramic views of the valley.' },
        { day: 3, title: 'Attabad Lake & Passu', desc: 'Boat ride on the turquoise lake and visit the iconic Passu Cones.' }
      ],
      inclusions: ['Luxury Transport', '4-star Accommodation', 'Professional Guide', 'Daily Breakfast'],
      rating: 4.9,
      reviews: 245,
      duration: '7 Days',
      freeCancellation: true,
      instantConfirmation: true
    },
    { 
      id: 2, 
      country: 'Turkey', 
      place: 'Cappadocia', 
      expense: 850, 
      img: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=400&auto=format&fit=crop', 
      famous: 'Hot Air Balloons, Fairy Chimneys',
      description: 'A magical landscape of fairy chimneys, ancient cave dwellings, and sunrise hot air balloon rides.',
      itinerary: [
        { day: 1, title: 'Hot Air Balloon Ride', desc: 'Sunrise flight over the valley followed by a tour of Goreme Open Air Museum.' },
        { day: 2, title: 'Underground City', desc: 'Explore the deep tunnels of Kaymakli or Derinkuyu underground cities.' },
        { day: 3, title: 'Ihlara Valley Hike', desc: 'A scenic walk along the river with rock-cut churches.' }
      ],
      inclusions: ['Balloon Flight', 'Cave Hotel Stay', 'Airport Transfers', 'Museum Entries'],
      rating: 4.8,
      reviews: 312,
      duration: '5 Days',
      freeCancellation: true,
      instantConfirmation: true
    },
    { 
      id: 3, 
      country: 'Switzerland', 
      place: 'Interlaken', 
      expense: 1200, 
      img: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=400&auto=format&fit=crop', 
      famous: 'Jungfraujoch, Lake Thun',
      description: 'The adventure capital of Europe, nestled between two stunning lakes and surrounded by the Alps.',
      itinerary: [
        { day: 1, title: 'Jungfraujoch Excursion', desc: 'Train ride to the "Top of Europe" for snow and glacier views.' },
        { day: 2, title: 'Lake Cruise', desc: 'Relaxing boat trip on Lake Brienz or Lake Thun with castle visits.' },
        { day: 3, title: 'Paragliding Adventure', desc: 'Soar over Interlaken for a birds-eye view of the mountains.' }
      ],
      inclusions: ['Swiss Travel Pass', 'Mountain Resort', 'Activity Vouchers', 'Gourmet Dining'],
      rating: 5.0,
      reviews: 189,
      duration: '8 Days',
      freeCancellation: false,
      instantConfirmation: true
    },
  ];

  if (selectedTrip) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="relative h-80">
          <img src={selectedTrip.img} alt={selectedTrip.place} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <button 
            onClick={() => setSelectedTrip(null)}
            className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                {selectedTrip.country}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-white text-[10px] font-black">{selectedTrip.rating} ({selectedTrip.reviews} reviews)</span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">{selectedTrip.place}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          <section className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase">{selectedTrip.duration}</span>
            </div>
            {selectedTrip.freeCancellation && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase">Free Cancellation</span>
              </div>
            )}
            {selectedTrip.instantConfirmation && (
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-[10px] font-black text-purple-700 dark:text-purple-400 uppercase">Instant Confirmation</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase">Mobile Ticket</span>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl">
              <Banknote className="w-4 h-4 text-rose-600" />
              <span className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase">Lowest Price Guarantee</span>
            </div>
          </section>

          <section className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Reserve Now & Pay Later</h4>
              <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-500/70">Secure your spot today and pay nothing until 48 hours before your trip.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Overview</h3>
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {selectedTrip.description}
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">What's Included</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedTrip.inclusions.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black dark:text-white uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Itinerary</h3>
            <div className="space-y-4">
              {selectedTrip.itinerary.map((day: any) => (
                <div key={day.day} className="relative pl-8 border-l-2 border-zinc-100 dark:border-zinc-800 pb-4 last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-zinc-900" />
                  <h4 className="text-xs font-black dark:text-white uppercase mb-1">Day {day.day}: {day.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-400 leading-relaxed">{day.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Booking Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-2">Select Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Travelers</h5>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-8 h-8 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white shadow-sm">-</button>
                    <span className="text-lg font-black dark:text-white">{travelers}</span>
                    <button onClick={() => setTravelers(travelers + 1)} className="w-8 h-8 bg-white dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white shadow-sm">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Price</h5>
                  <p className="text-2xl font-black text-blue-600">${(selectedTrip.expense * travelers).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-700">
          <button 
            disabled={!bookingDate}
            className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <div className="p-6 bg-white dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onBack} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <h2 className="text-xl font-black dark:text-white">Trips & Adventure</h2>
        <button onClick={onRental} className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
          <Car className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        <div className="bg-zinc-900 dark:bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden">
          <h3 className="text-2xl font-black mb-2 italic">Global Adventures</h3>
          <p className="text-sm font-bold opacity-80">Explore the world with Venzgo curated trips.</p>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Globe className="w-32 h-32 rotate-12" />
          </div>
        </div>

        {/* AI Search Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">AI Trip Explorer</h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Enter a country or city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-800 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none dark:text-white shadow-sm"
              />
            </div>
            <button 
              onClick={fetchTripDetails}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Plan"}
            </button>
          </div>

          {aiResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-zinc-800 rounded-[40px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-xl"
            >
              <div className="relative h-64">
                <img src={aiResult.img} alt={aiResult.place} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{aiResult.country}</p>
                  <h4 className="text-3xl font-black text-white">{aiResult.place}</h4>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed">{aiResult.description}</p>
                
                <div className="space-y-3">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Famous Landmarks</h5>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.landmarks.map((l, i) => (
                      <span key={i} className="bg-zinc-50 dark:bg-zinc-700 px-4 py-2 rounded-xl text-[10px] font-black dark:text-white border border-zinc-100 dark:border-zinc-600">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Travelers</h5>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-8 h-8 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">-</button>
                        <span className="text-lg font-black dark:text-white">{travelers}</span>
                        <button onClick={() => setTravelers(travelers + 1)} className="w-8 h-8 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Est. Cost</h5>
                      <p className="text-2xl font-black text-blue-600">${(aiResult.estimatedCostPerPerson * travelers).toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTrip({
                      ...aiResult,
                      expense: aiResult.estimatedCostPerPerson
                    })}
                    className="w-full bg-zinc-900 dark:bg-blue-600 text-white py-5 rounded-[32px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    View Details & Book
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </section>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-tight dark:text-white">Popular Destinations</h3>
          {trips.map((trip) => (
            <motion.div 
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-800 rounded-[32px] overflow-hidden border border-zinc-100 dark:border-zinc-700 shadow-sm"
            >
              <div className="relative h-56">
                <img src={trip.img} alt={trip.place} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                  {trip.country}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-black dark:text-white mb-1">{trip.place}</h4>
                <p className="text-xs font-bold text-zinc-400 mb-4">Famous for: {trip.famous}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-blue-600">${trip.expense}/person</p>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase">Est. Expense</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrip(trip)}
                    className="bg-zinc-900 dark:bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rental Cars Integration */}
        <section className="bg-white dark:bg-zinc-800 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-black dark:text-white">Need a ride?</h3>
            <p className="text-xs font-bold text-zinc-400">Rent a car for your adventure.</p>
            <button 
              onClick={onRental}
              className="text-blue-600 text-xs font-black uppercase tracking-widest flex items-center gap-2"
            >
              Explore Rental Cars <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center">
            <Key className="w-8 h-8 text-blue-600" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<AppStep>('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet' | 'bank'>('cash');
  const [activeService, setActiveService] = useState<string | null>(null);
  const [serviceCategory, setServiceCategory] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPrayerWidget, setShowPrayerWidget] = useState(true);
  const [showRamadanModal, setShowRamadanModal] = useState(false);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Ride Confirmed!', desc: 'Your driver is 2 mins away.', time: 'Just now', icon: Car, color: 'bg-blue-50 text-blue-600' },
    { id: 2, title: 'Promo Applied', desc: 'You saved $5.00 on your last trip.', time: '2h ago', icon: Gift, color: 'bg-emerald-50 text-emerald-600' },
    { id: 3, title: 'New Feature', desc: 'Freight booking is now live!', time: 'Yesterday', icon: Truck, color: 'bg-purple-50 text-purple-600' },
  ]);

  const addNotification = (title: string, desc: string, icon: any, color: string) => {
    const newNotif = {
      id: Date.now(),
      title,
      desc,
      time: 'Just now',
      icon,
      color
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const prayerTimes = {
    Fajr: '05:12 AM',
    Dhuhr: '12:24 PM',
    Asr: '03:45 PM',
    Maghrib: '06:15 PM',
    Isha: '07:45 PM'
  };
  
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>({ lat: 31.5204, lng: 74.3587 });
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [originAddress, setOriginAddress] = useState('My Location');
  const [destinationAddress, setDestinationAddress] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const vehicles = [
    { id: 0, name: 'Venzgo Bike', price: '$4.50', time: '2 min', desc: 'Quick & Solo', img: 'https://images.unsplash.com/photo-1558981403-c5f97cb9a5fe?q=80&w=200&auto=format&fit=crop' },
    { id: 1, name: 'VenzgoX', price: '$10.34', time: '4 min', desc: '4 seats • Economy', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=200&auto=format&fit=crop' },
    { id: 2, name: 'Venzgo Blue', price: '$17.21', time: '5 min', desc: 'Electric • Premium', img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=200&auto=format&fit=crop', isPremium: true },
    { id: 3, name: 'Luxury', price: '$35.50', time: '7 min', desc: 'Luxury Sedan • VIP', img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=200&auto=format&fit=crop', isPremium: true },
  ];

  const promotions = [
    { id: 1, title: 'Car 4-seater', discount: '10% Discount for All Trips', img: '🚕', expiry: '20/03/2026', count: 'x10' },
    { id: 2, title: 'Car 4-seater', discount: '15% Discount for All Trips', img: '🚗', expiry: '22/03/2026', count: 'x10' },
    { id: 3, title: 'Taxi 4-seater', discount: '20% Discount for All Trips', img: '🚖', expiry: '25/03/2026', count: 'x5' },
    { id: 4, title: 'Taxi 4-seater', discount: '$4.50 Discount for Total Bill $50', img: '🚕', expiry: '28/03/2026', count: 'x5' },
  ];

  return (
    <div className={cn(
      "h-screen font-sans overflow-hidden flex flex-col max-w-md mx-auto relative shadow-2xl transition-colors duration-300",
      isDarkMode ? "bg-zinc-900 text-white dark" : "bg-white text-zinc-900"
    )}>
      
      {!isLoggedIn && step === 'auth' ? (
        <AuthScreen onLogin={() => { setIsLoggedIn(true); setStep('home'); }} />
      ) : (
        <>
          {/* Ramadan Special Modal */}
      <AnimatePresence>
        {showRamadanModal && (
          <div className="fixed inset-0 z-[300] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRamadanModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[40px] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center">
                  <Moon className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white">Ramadan Special</h3>
                  <p className="text-sm font-bold text-zinc-400">Book Iftar or Sehri at top mosques & cafes.</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { name: 'Grand Mosque Iftar', price: '$15', time: '06:15 PM', type: 'Iftar' },
                  { name: 'Elite Cafe Sehri', price: '$10', time: '04:30 AM', type: 'Sehri' },
                  { name: 'Prayer Room Booking', price: 'Free', time: 'Anytime', type: 'Prayer' },
                ].map((item, i) => (
                  <button key={i} className="w-full p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between hover:border-emerald-500 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                        <Utensils className="w-5 h-5 text-zinc-400 group-hover:text-emerald-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black dark:text-white">{item.name}</h4>
                        <p className="text-[10px] font-bold text-zinc-400">{item.type} • {item.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-emerald-600">{item.price}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowRamadanModal(false)}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-900/20"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-zinc-900 z-[201] shadow-2xl flex flex-col"
            >
              <div className="p-8 bg-zinc-900 text-white">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-4 flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-900/20">T</div>
                <h3 className="text-xl font-black">Taha Zaheer</h3>
                <div className="flex items-center gap-1 mt-1 opacity-60">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">4.95 Rating</span>
                </div>
              </div>
              
              <div className="flex-1 p-6 space-y-2 bg-white dark:bg-zinc-900">
                {[
                  { icon: User, label: 'My Profile', step: 'home' },
                  { icon: Wallet, label: 'Venzgo Wallet', badge: '$120.50', step: 'home' },
                  { icon: Car, label: 'Driver Mode', isNew: true, step: 'driver_mode' },
                  { icon: Settings, label: 'Admin Panel', step: 'admin_panel' },
                  { icon: Clock, label: 'Ride History', step: 'activity' },
                  { icon: Gift, label: 'Promotions', step: 'promotions' },
                  { icon: isDarkMode ? Sun : Moon, label: isDarkMode ? 'Light Mode' : 'Dark Mode', onClick: () => setIsDarkMode(!isDarkMode) },
                  { icon: Shield, label: 'Safety', step: 'home' },
                  { icon: Settings, label: 'Settings', step: 'home' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.step) {
                        setStep(item.step as AppStep);
                      }
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-600" />
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.label}</span>
                      {item.isNew && <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase">New</span>}
                    </div>
                    {item.badge && <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">{item.badge}</span>}
                  </button>
                ))}
              </div>
              
              <div className="p-6 border-t border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button 
                  onClick={() => { setIsLoggedIn(false); setStep('auth'); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-4 p-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Step: Home (Super-App Hub) */}
      {step === 'home' && (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-y-auto no-scrollbar">
          {/* Map at Top (Uber Style) */}
          <div className="relative h-[35%] min-h-[280px] shrink-0">
            <MapView origin={origin} destination={destination} />
            
            {/* Overlay Top Bar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center text-zinc-900 dark:text-white active:scale-90 transition-transform border border-zinc-100 dark:border-zinc-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setStep('notifications')}
                  className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center text-zinc-900 dark:text-white relative border border-zinc-100 dark:border-zinc-700"
                >
                  <Bell className="w-6 h-6" />
                  <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-600 rounded-full border-2 border-white dark:border-zinc-800"></div>
                </button>
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-xl flex items-center justify-center text-white border-2 border-white dark:border-zinc-800">
                  <User className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Floating Search Bar */}
            <div className="absolute bottom-[-28px] left-6 right-6 z-20">
              <button 
                onClick={() => setStep('ride_selection')}
                className="w-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-5 rounded-[24px] flex items-center justify-between shadow-2xl shadow-zinc-200/50 dark:shadow-none group active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xl font-black text-zinc-900 dark:text-white">Where to?</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-600">Now</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                </div>
              </button>
            </div>
          </div>

          <div className="px-6 pt-12 space-y-10 pb-10">
            {/* Quick Actions */}
            <section className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setStep('ride_selection')}
                className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm flex flex-col items-center gap-3 group active:scale-95 transition-all"
              >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <Car className="w-8 h-8 text-emerald-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">Ride</span>
              </button>
              <button 
                onClick={() => setStep('courier_booking')}
                className="bg-white dark:bg-zinc-800 p-6 rounded-[32px] border border-zinc-100 dark:border-zinc-700 shadow-sm flex flex-col items-center gap-3 group active:scale-95 transition-all"
              >
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest dark:text-white">Delivery</span>
              </button>
            </section>

            {/* Service Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">All Services</h2>
              </div>
              <div className="grid grid-cols-4 gap-y-10">
                <ServiceCard icon={Bike} label="Bike" onClick={() => { setSelectedVehicle(0); setStep('ride_selection'); }} />
                <ServiceCard icon={Globe} label="Intercity" onClick={() => { setServiceCategory('City to City'); setStep('service_view'); }} />
                <ServiceCard icon={Truck} label="Freight" onClick={() => { setServiceCategory('Freight'); setStep('service_view'); }} />
                <ServiceCard icon={Plane} label="Flights" onClick={() => setStep('flight_booking')} />
                <ServiceCard icon={Bus} label="Bus" onClick={() => setStep('bus_booking')} />
                <ServiceCard icon={Train} label="Train" onClick={() => setStep('train_booking')} />
                <ServiceCard icon={Hotel} label="Hotels" onClick={() => setStep('hotel_booking')} />
                <ServiceCard icon={Utensils} label="Food" onClick={() => { setServiceCategory('Food'); setStep('service_view'); }} />
                <ServiceCard icon={Mountain} label="Trips" onClick={() => setStep('trips_adventure')} />
                <ServiceCard icon={Key} label="Rental" onClick={() => setStep('rental_cars')} />
                <ServiceCard icon={Box} label="Logistics" onClick={() => setStep('logistics')} />
                <ServiceCard icon={ShoppingCart} label="Grocery" onClick={() => setStep('grocery')} />
              </div>
            </section>

            {/* Prayer Widget */}
            {showPrayerWidget && (
              <section className="bg-zinc-900 dark:bg-emerald-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex items-center justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Next Prayer: Asr</p>
                        <p className="text-xl font-black">03:45 PM</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowRamadanModal(true)}
                      className="bg-emerald-600 text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-lg shadow-emerald-900/40"
                    >
                      Ramadan Special
                    </button>
                  </div>
                  <div className="text-right space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Qibla Direction</p>
                      <p className="text-lg font-black">245° SW</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto relative">
                      <div 
                        className="w-1 h-5 bg-emerald-500 rounded-full absolute top-1"
                        style={{ transformOrigin: 'bottom center', transform: `rotate(${qiblaAngle}deg)` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Moon className="w-40 h-40 rotate-12" />
                </div>
              </section>
            )}

            {/* Promo Banner */}
            <section 
              onClick={() => {
                setStep('ride_selection');
                setSelectedVehicle(1); // Select Venzgo Blue
              }}
              className="relative bg-emerald-600 rounded-[40px] p-8 overflow-hidden shadow-xl shadow-emerald-100 dark:shadow-none cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-white mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Venzgo Blue</span>
                </div>
                <h2 className="text-white text-3xl font-black mb-2">Electrify your ride</h2>
                <p className="text-emerald-100 text-sm font-bold mb-6">Request an EV now and save 15% on your first trip.</p>
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Book Now</button>
              </div>
              <div className="absolute right-[-40px] bottom-[-20px] opacity-20">
                <Car className="w-64 h-64 text-white rotate-[-15deg]" />
              </div>
            </section>

          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 px-8 py-4 flex items-center justify-between z-[100]">
            <button onClick={() => setStep('home')} className="flex flex-col items-center gap-1 group">
              <LayoutGrid className={cn("w-6 h-6 transition-colors", step === 'home' ? "text-emerald-600" : "text-zinc-400 group-hover:text-emerald-600")} />
              <span className={cn("text-[8px] font-black uppercase tracking-widest", step === 'home' ? "text-emerald-600" : "text-zinc-400")}>Home</span>
            </button>
            <button onClick={() => setStep('activity')} className="flex flex-col items-center gap-1 group">
              <History className="w-6 h-6 transition-colors text-zinc-400 group-hover:text-emerald-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Activity</span>
            </button>
            <button onClick={() => setStep('promotions')} className="flex flex-col items-center gap-1 group">
              <Gift className="w-6 h-6 transition-colors text-zinc-400 group-hover:text-emerald-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Offers</span>
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 group">
              <User className={cn("w-6 h-6 transition-colors", isMenuOpen ? "text-emerald-600" : "text-zinc-400 group-hover:text-emerald-600")} />
              <span className={cn("text-[8px] font-black uppercase tracking-widest", isMenuOpen ? "text-emerald-600" : "text-zinc-400")}>Profile</span>
            </button>
          </div>
        </div>
      )}


      {step === 'rental_cars' && <RentalCarsView onBack={() => setStep('home')} />}
      {step === 'trips_adventure' && <TripsAdventureView onBack={() => setStep('home')} onRental={() => setStep('rental_cars')} />}
      {step === 'train_booking' && <TrainBookingView onBack={() => setStep('home')} />}
      {step === 'hotel_booking' && <HotelBookingView onBack={() => setStep('home')} />}
      {step === 'courier_booking' && <CourierBookingView onBack={() => setStep('home')} onConfirm={() => setStep('bidding_view')} />}
      {step === 'bidding_view' && (
        <BiddingView 
          onBack={() => setStep('home')} 
          onSelect={(bid) => { 
            setStep('ride_tracking');
            // Trigger cross-promotions
            setTimeout(() => {
              addNotification('🏨 Hotel Deal!', `Heading to ${destinationAddress}? Book a luxury room at Pearl Continental for 20% off!`, Hotel, 'bg-blue-50 text-blue-600');
              addNotification('✈️ Flight Alert', 'Planning a trip? Check out our exclusive flight deals to Hunza Valley.', Plane, 'bg-emerald-50 text-emerald-600');
            }, 3000);
          }} 
        />
      )}

      {/* Step: Service View (Grocery, Food, etc.) */}
      {step === 'service_view' && (
        <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
          <div className="bg-white dark:bg-zinc-800 p-6 pb-4 shadow-sm border-b border-zinc-100 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setStep('home')} className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h2 className="text-xl font-black dark:text-white">{serviceCategory}</h2>
              <button className="w-10 h-10 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center dark:text-white">
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {['All', 'Popular', 'Near You', 'Offers', 'New'].map((cat) => (
                <button key={cat} className="whitespace-nowrap px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-700 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors dark:text-zinc-300">
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <section>
              <h3 className="text-sm font-black uppercase tracking-tight mb-4 dark:text-white">Featured {serviceCategory}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-zinc-800 rounded-3xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-700 rounded-2xl mb-3 flex items-center justify-center text-4xl">
                      {serviceCategory === 'Food' ? '🍕' : 
                       serviceCategory === 'Freight' ? '🚛' :
                       serviceCategory === 'Courier' ? '📦' :
                       serviceCategory === 'Flights' ? '✈️' :
                       serviceCategory === 'Hotels' ? '🏨' : '🌍'}
                    </div>
                    <h4 className="font-black text-sm dark:text-white">Premium {serviceCategory} {i}</h4>
                    <p className="text-[10px] font-bold text-zinc-400">4.8 ★ • Verified</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-900 dark:bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
              <h3 className="text-xl font-black mb-1 italic">Venzgo {serviceCategory}</h3>
              <p className="text-xs font-bold opacity-80">Premium booking experience.</p>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-20">
                <Shield className="w-24 h-24 rotate-12" />
              </div>
            </section>
          </div>

          {/* Bottom Navigation (Shared) */}
          <div className="bg-white dark:bg-zinc-800 border-t border-zinc-100 dark:border-zinc-700 px-6 py-4 flex items-center justify-between sticky bottom-0 z-30">
            <button onClick={() => setStep('home')} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
              <Smartphone className="w-6 h-6" />
              <span className="text-[10px] font-bold">Home</span>
            </button>
            <button 
              onClick={() => { setServiceCategory('Courier'); setStep('service_view'); }}
              className={cn("flex flex-col items-center gap-1", serviceCategory === 'Courier' ? "text-blue-600" : "text-zinc-300 dark:text-zinc-500")}
            >
              <Package className="w-6 h-6" />
              <span className="text-[10px] font-bold">Courier</span>
            </button>
            <button onClick={() => setStep('explore')} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
              <Navigation className="w-6 h-6" />
              <span className="text-[10px] font-bold">Explore</span>
            </button>
            <button onClick={() => setStep('activity')} className="flex flex-col items-center gap-1 text-zinc-300 dark:text-zinc-500">
              <History className="w-6 h-6" />
              <span className="text-[10px] font-bold">Activity</span>
            </button>
          </div>
        </div>
      )}
      {/* Step: Auth */}
      {step === 'auth' && (
        <AuthScreen onLogin={() => { setIsLoggedIn(true); setStep('home'); }} />
      )}

      {/* Step: Notifications */}
      {step === 'notifications' && (
        <NotificationScreen 
          onBack={() => setStep('home')} 
          notifications={notifications} 
          onClear={() => setNotifications([])} 
        />
      )}

      {/* Step: Ride Tracking */}
      {step === 'ride_tracking' && (
        <RideTrackingView 
          onBack={() => setStep('ride_selection')} 
          onCancel={(reason) => {
            alert(`Ride cancelled: ${reason}`);
            setStep('home');
          }} 
        />
      )}

      {/* Step: Logistics */}
      {step === 'logistics' && (
        <LogisticsDashboard onBack={() => setStep('home')} />
      )}

      {/* Step: Grocery */}
      {step === 'grocery' && (
        <GroceryStore onBack={() => setStep('home')} onTrack={() => setStep('grocery_tracking')} onSupport={() => setStep('support_chat')} />
      )}

      {/* Step: Grocery Tracking */}
      {step === 'grocery_tracking' && (
        <GroceryTracking onBack={() => setStep('grocery')} onSupport={() => setStep('support_chat')} />
      )}

      {/* Step: Flight Booking */}
      {step === 'flight_booking' && (
        <BookingFlow type="flight" onBack={() => setStep('home')} />
      )}

      {/* Step: Bus Booking */}
      {step === 'bus_booking' && (
        <BookingFlow type="bus" onBack={() => setStep('home')} />
      )}

      {/* Step: Trip Planner */}
      {step === 'trip_planner' && (
        <TripPlanner onBack={() => setStep('home')} />
      )}

      {/* Step: Activity */}
      {step === 'activity' && (
        <ActivityView onBack={() => setStep('home')} />
      )}

      {/* Step: Explore */}
      {step === 'explore' && (
        <ExploreView onBack={() => setStep('home')} />
      )}

      {/* Step: Driver Mode */}
      {step === 'driver_mode' && (
        <DriverDashboard onBack={() => setStep('home')} />
      )}

      {/* Step: Admin Panel */}
      {step === 'admin_panel' && (
        <AdminPanel onBack={() => setStep('home')} />
      )}

      {/* Step: Support Chat */}
      {step === 'support_chat' && (
        <InAppChat onBack={() => setStep('home')} />
      )}

      {/* Step: Ride Selection */}
      {step === 'ride_selection' && (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-900">
          <div className="relative h-[40%]">
            <MapView origin={origin} destination={destination} />
            <button 
              onClick={() => setStep('home')}
              className="absolute top-6 left-6 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full shadow-lg flex items-center justify-center z-10 dark:text-white"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            {/* Real Search Inputs Overlay */}
            <div className="absolute top-20 left-6 right-6 z-10 space-y-2">
              <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl p-4 border border-zinc-100 dark:border-zinc-700 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="w-0.5 h-8 bg-zinc-100 dark:bg-zinc-700"></div>
                    <div className="w-2 h-2 bg-zinc-900 dark:bg-zinc-100 rounded-sm"></div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={originAddress}
                        onChange={(e) => setOriginAddress(e.target.value)}
                        placeholder="Current Location"
                        className="w-full bg-zinc-100 dark:bg-zinc-700 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        placeholder="Where to?"
                        className="w-full bg-zinc-100 dark:bg-zinc-700 border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] -mt-6 relative z-10">
            <div className="w-12 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto my-4"></div>
            <p className="text-center text-xs font-bold text-zinc-400 mb-4 uppercase tracking-widest">Select your ride</p>
            
            <div className="flex overflow-x-auto no-scrollbar px-6 gap-4 pb-4">
              {vehicles.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  className={cn(
                    "min-w-[140px] p-4 rounded-[32px] flex flex-col items-center gap-3 transition-all border-2 shrink-0",
                    selectedVehicle === v.id ? "border-blue-600 bg-blue-50/30 dark:bg-blue-900/20" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  <div className="relative w-20 h-14">
                    <img 
                      src={v.img} 
                      alt={v.name} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    {v.isPremium && <div className="absolute -top-1 -right-1 text-blue-600"><Star className="w-3 h-3 fill-current" /></div>}
                  </div>
                  <div className="text-center">
                    <h4 className="font-black text-xs dark:text-white">{v.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-400">{v.time}</p>
                    <p className="text-[10px] font-black text-blue-600 mt-1">{v.price}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-zinc-50 dark:border-zinc-800">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
                {[
                  { id: 'cash', icon: Banknote, label: 'Cash' },
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'wallet', icon: Smartphone, label: 'Wallet' },
                  { id: 'bank', icon: Building, label: 'Bank' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full border transition-all shrink-0",
                      paymentMethod === m.id ? "bg-zinc-900 dark:bg-blue-600 border-zinc-900 dark:border-blue-600 text-white" : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500"
                    )}
                  >
                    <m.icon className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setStep('bidding_view')}
                  className="flex-1 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Confirm {vehicles[selectedVehicle].name}
                </button>
                <button className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white">
                  <Clock className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Promotions */}
      {step === 'promotions' && (
        <div className="h-full bg-white flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setStep('ride_selection')} className="p-2 hover:bg-zinc-50 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-black">Promotion</h2>
            <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1.5 rounded-full">
              <Star className="w-3 h-3 text-white fill-current" />
              <span className="text-xs font-black text-white">1,010</span>
            </div>
          </div>

          <div className="flex bg-zinc-50 p-1 rounded-2xl mb-8">
            <button className="flex-1 py-2.5 rounded-xl text-xs font-bold text-zinc-400">Redeem Rewards</button>
            <button className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white shadow-sm">My Rewards</button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">{promo.img}</span>
                    <span className="text-[10px] font-black bg-zinc-100 px-2 py-1 rounded-full">{promo.count}</span>
                  </div>
                  <h4 className="text-xs font-black mb-1">#{promo.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-400 leading-tight mb-4">{promo.discount}</p>
                  <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-wider">Expiry {promo.expiry}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Booking Confirmed */}
      {step === 'booking_confirmed' && (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-200"
          >
            <Car className="w-12 h-12" />
          </motion.div>
          <h2 className="text-3xl font-black mb-4">Ride Confirmed!</h2>
          <p className="text-zinc-500 mb-12">Your driver is on the way. They will arrive in approximately 5 minutes.</p>
          
          <div className="w-full bg-zinc-50 rounded-3xl p-6 mb-12 flex items-center gap-4 border border-zinc-100">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl">👨🏻‍✈️</div>
            <div className="text-left flex-1">
              <h4 className="font-black">Nguyen Van A</h4>
              <p className="text-xs font-bold text-zinc-400">Toyota Vios • 29A-123.45</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-blue-600 fill-current" />
              <span className="text-sm font-black">4.9</span>
            </div>
          </div>

          <button 
            onClick={() => setStep('home')}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-100"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Service Modal (Coming Soon) */}
      <AnimatePresence>
        {activeService && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="w-full max-w-md bg-white rounded-[40px] p-8 pb-12 text-center"
            >
              <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-8"></div>
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                {activeService === 'Hotels' && <Hotel className="w-10 h-10" />}
                {activeService === 'Flights' && <Plane className="w-10 h-10" />}
                {activeService === 'Food' && <Utensils className="w-10 h-10" />}
                {activeService === 'Grocery' && <ShoppingBag className="w-10 h-10" />}
                {activeService === 'Courier' && <Package className="w-10 h-10" />}
                {activeService === 'Reserve' && <Clock className="w-10 h-10" />}
                {activeService === 'Hourly' && <TrendingUp className="w-10 h-10" />}
                {activeService === 'Rent' && <Settings className="w-10 h-10" />}
                {activeService === 'Vaccine' && <Shield className="w-10 h-10" />}
                {activeService === 'More' && <MoreHorizontal className="w-10 h-10" />}
                {activeService === 'Explore' && <Navigation className="w-10 h-10" />}
                {activeService === 'Activity' && <Clock className="w-10 h-10" />}
              </div>
              <h2 className="text-2xl font-black mb-2">Venzgo {activeService}</h2>
              <p className="text-zinc-500 text-sm mb-8">
                {activeService === 'More' 
                  ? "Discover all Venzgo services including Logistics, Health, and Finance integrations."
                  : `We are integrating ${activeService} services directly into Venzgo. Stay tuned for native booking!`}
              </p>
              <button 
                onClick={() => setActiveService(null)}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatBot />
        </>
      )}
    </div>
  );
}
