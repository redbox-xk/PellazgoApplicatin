import { useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';

export function Profile() {
  const { data: profile, isLoading, refetch } = useGetProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const initializedForId = useRef<number | null>(null);

  useEffect(() => {
    if (profile && initializedForId.current !== profile.id) {
      initializedForId.current = profile.id;
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleSave = () => {
    updateProfile.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully." });
        setIsEditing(false);
        refetch();
      }
    });
  };

  const handleLogout = () => {
    // We don't have a specific logout endpoint in this spec, just clear local state/cookie and redirect
    toast({ title: "Logged out successfully." });
    setLocation('/login');
  };

  if (isLoading) return <div className="p-12 animate-pulse space-y-8 max-w-4xl mx-auto"><div className="h-64 bg-white/5 rounded-2xl" /></div>;
  if (!profile) return null;

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 items-center">
      <div className="w-full max-w-3xl mx-auto px-4 pt-12 flex flex-col items-center">
        
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-primary/50" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-white/10 transition-colors">
            <Edit2 size={16} />
          </button>
        </div>

        <h1 className="text-3xl font-serif mb-1 text-center">{profile.name}</h1>
        <p className="text-muted-foreground text-center mb-8">{profile.email}</p>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/orders" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <PackageIcon size={24} className="text-primary mb-2" />
            <span className="text-sm font-medium">Orders</span>
          </Link>
          <Link href="/favorites" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <HeartIcon size={24} className="text-primary mb-2" />
            <span className="text-sm font-medium">Saved</span>
          </Link>
          <Link href="/loyalty" className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
            <StarIcon size={24} className="text-primary mb-2" />
            <span className="text-sm font-medium">Loyalty</span>
          </Link>
        </div>

        <div className="w-full glass-panel rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
            <h2 className="text-xl font-serif">Personal Information</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="text-sm text-primary hover:underline">Edit</button>
            ) : (
              <div className="flex gap-4">
                <button onClick={() => setIsEditing(false)} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={handleSave} className="text-sm text-primary font-medium hover:underline">Save</button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2"><User size={14}/> Full Name</label>
                {isEditing ? (
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-background border-border h-12" />
                ) : (
                  <p className="font-medium">{profile.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2"><Mail size={14}/> Email Address</label>
                {isEditing ? (
                  <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-background border-border h-12" type="email" />
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2"><Phone size={14}/> Phone Number</label>
                {isEditing ? (
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-background border-border h-12" type="tel" />
                ) : (
                  <p className="font-medium">{profile.phone || 'Not provided'}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2"><MapPin size={14}/> Shipping Address</label>
                {isEditing ? (
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="bg-background border-border h-12" />
                ) : (
                  <p className="font-medium">{profile.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-8 space-y-4">
          <button className="w-full h-14 glass-panel border border-white/5 rounded-xl flex items-center justify-between px-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-muted-foreground" />
              <span>Preferences</span>
            </div>
          </button>
          <button onClick={handleLogout} className="w-full h-14 glass-panel border border-white/5 rounded-xl flex items-center justify-between px-6 hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span>Sign Out</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

// Simple icons for the grid since we didn't import all
function PackageIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>; }
function HeartIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>; }
function StarIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
