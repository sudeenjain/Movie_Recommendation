"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Camera, Save, ArrowLeft, LogOut, 
  Loader2, Settings, Shield, Bell, Palette, 
  History, Star, Bookmark, Zap, Globe, Check,
  Link as LinkIcon, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth";
import { showSuccess, showError } from "@/utils/toast";
import { useWatchlist } from "@/hooks/use-watchlist";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [bio, setBio] = useState(localStorage.getItem("user_bio") || "Cinematic explorer in the digital frontier.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      setEmail(user.email || user.phoneNumber || "Unknown Identity");
      setName(user.displayName || "Commander");
      setPhotoURL(user.photoURL || "");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      localStorage.setItem("user_bio", bio);
      showSuccess("Profile updated successfully.");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!auth.currentUser || !newPhotoURL) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        photoURL: newPhotoURL
      });
      setPhotoURL(newPhotoURL);
      setIsPhotoDialogOpen(false);
      showSuccess("Visual identity updated.");
    } catch (error: any) {
      showError("Failed to update photo. Ensure the URL is valid.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email || email === "Unknown Identity") {
      showError("No valid email associated with this account.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showSuccess("Reset link transmitted to your network ID.");
    } catch (error: any) {
      showError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showSuccess("Connection terminated.");
    navigate("/auth");
  };

  const handleToggleFeature = (feature: string) => {
    showSuccess(`${feature} protocol updated.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Loader2 className="w-8 h-8 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <Link to="/" className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Home
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleLogout} className="text-white/50 hover:text-white hover:bg-white/10 gap-2 font-semibold uppercase tracking-widest text-[10px]">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Identity & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative group">
                  {photoURL ? (
                    <img src={photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                  
                  <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                    <DialogTrigger asChild>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-[#111] border-white/10 backdrop-blur-2xl rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-white font-bold tracking-widest">Update Profile Photo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Image URL</Label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/photo.jpg" 
                              value={newPhotoURL}
                              onChange={(e) => setNewPhotoURL(e.target.value)}
                              className="pl-10 bg-white/5 border-white/10 rounded-xl"
                            />
                          </div>
                        </div>
                        <Button onClick={handleUpdatePhoto} className="w-full bg-white text-black hover:bg-white/90 font-bold tracking-widest" disabled={saving}>
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Photo"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-black rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tighter text-white truncate px-2">{name}</h2>
            <p className="text-xs font-semibold text-white/40 mt-1">Free Tier</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Bookmark className="w-4 h-4 text-white/50 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{watchlist.length}</p>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-widest">Saved</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-white/50 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{Math.min(99, 70 + watchlist.length * 2)}%</p>
                <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-widest">Match Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-4">
            <h4 className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Recent Activity</h4>
            {watchlist.length > 0 ? (
              watchlist.slice(0, 3).map((movie, i) => (
                <div key={movie.id} className="flex items-center gap-3 text-xs">
                  <div className="p-2 rounded-lg bg-white/5">
                    <Bookmark className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">Added {movie.title}</p>
                    <p className="text-[10px] text-muted-foreground">Recently</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground italic">No recent neural activity detected.</p>
            )}
          </div>
        </motion.div>

        {/* Right Content: Tabs & Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full flex p-1 mb-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl h-14">
              <TabsTrigger value="general" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:text-black h-full transition-all">
                <Settings className="w-4 h-4" /> General
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:text-black h-full transition-all">
                <Palette className="w-4 h-4" /> Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-1 rounded-xl gap-2 data-[state=active]:bg-white data-[state=active]:text-black h-full transition-all">
                <Shield className="w-4 h-4" /> Security
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="general" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Account Settings</h3>
                      <p className="text-xs text-muted-foreground font-medium">Update your profile details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Full Name</Label>
                        <Input 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-14 bg-white/5 border-white/10 focus:border-white/30 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</Label>
                        <Input 
                          value={email}
                          disabled
                          className="h-14 bg-white/5 border-white/10 opacity-50 cursor-not-allowed rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-white/50 ml-1">Bio</Label>
                      <Textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[120px] bg-white/5 border-white/10 focus:border-white/30 rounded-2xl resize-none p-4"
                      />
                    </div>
                    <Button type="submit" className="px-8 h-12 gap-2 font-semibold rounded-lg bg-white text-black hover:bg-white/90 transition-all outline-none" disabled={saving}>
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Changes
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Preferences</h3>
                      <p className="text-xs text-muted-foreground font-medium">Customize your viewing experience.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Auto-Play Trailers</p>
                        <p className="text-xs text-muted-foreground">Preview movies automatically on hover.</p>
                      </div>
                      <Switch defaultChecked onCheckedChange={() => handleToggleFeature("Auto-Play")} />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">High Fidelity Particles</p>
                        <p className="text-xs text-muted-foreground">Enable advanced 3D background effects.</p>
                      </div>
                      <Switch defaultChecked onCheckedChange={() => handleToggleFeature("High Fidelity")} />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Interface Language</p>
                        <p className="text-xs text-muted-foreground">Current: English (Global)</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl border-white/10" onClick={() => showSuccess("Language locked to English.")}>Change</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">Security</h3>
                      <p className="text-xs text-muted-foreground font-medium">Protect your account.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Change Password</p>
                        <p className="text-xs text-muted-foreground">Receive a secure link to change your password.</p>
                      </div>
                      <Button onClick={handlePasswordReset} variant="secondary" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Send Link</Button>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of protection.</p>
                      </div>
                      <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px] border-white/10 text-white" onClick={() => showSuccess("2FA configuration initialized.")}>Configure</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;