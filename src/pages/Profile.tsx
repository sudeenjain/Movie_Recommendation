"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Camera, Save, ArrowLeft, LogOut, 
  Loader2, Settings, Shield, Bell, Palette, 
  History, Star, Bookmark, Zap, Globe, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth";
import { showSuccess, showError } from "@/utils/toast";
import { useWatchlist } from "@/hooks/use-watchlist";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("Cinematic explorer in the digital frontier.");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const navigate = useNavigate();
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/auth");
      return;
    }
    setEmail(user.email || user.phoneNumber || "");
    setName(user.displayName || "");
    setLoading(false);
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name
      });
      showSuccess("Neural profile updated successfully.");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) return;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <Link to="/" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Terminal
        </Link>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2 font-black uppercase tracking-widest text-[10px]">
            <LogOut className="w-4 h-4" />
            Terminate Session
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
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-black rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{name || "Commander"}</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-2">Elite Operative</p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Bookmark className="w-4 h-4 text-primary mx-auto mb-2" />
                <p className="text-xl font-black text-white">{watchlist.length}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Saved</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-2" />
                <p className="text-xl font-black text-white">98%</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">AI Match</p>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Recent Activity</h4>
            {[
              { action: "Watched Inception", time: "2h ago", icon: History },
              { action: "Added Dune to Vault", time: "5h ago", icon: Bookmark },
              { action: "Profile Synced", time: "1d ago", icon: Zap },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded-lg bg-white/5">
                  <item.icon className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.action}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Content: Tabs & Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8"
        >
          <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-black/40 backdrop-blur-3xl border border-white/10 p-1 rounded-2xl mb-8 w-full justify-start overflow-x-auto">
              <TabsTrigger value="general" className="rounded-xl gap-2 data-[state=active]:bg-primary">
                <Settings className="w-4 h-4" /> General
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-xl gap-2 data-[state=active]:bg-primary">
                <Palette className="w-4 h-4" /> Preferences
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl gap-2 data-[state=active]:bg-primary">
                <Shield className="w-4 h-4" /> Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-xl gap-2 data-[state=active]:bg-primary">
                <Bell className="w-4 h-4" /> Alerts
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="general" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Identity Configuration</h3>
                      <p className="text-xs text-muted-foreground font-medium">Modify your neural signature.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Full Designation</Label>
                        <Input 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Network Address</Label>
                        <Input 
                          value={email}
                          disabled
                          className="h-14 bg-white/5 border-white/10 opacity-50 cursor-not-allowed rounded-2xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Neural Bio</Label>
                      <Textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[120px] bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full md:w-auto px-12 h-14 gap-3 font-black uppercase tracking-widest rounded-2xl bg-primary" disabled={saving}>
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Commit Changes
                    </Button>
                  </form>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                      <Palette className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Cinematic Experience</h3>
                      <p className="text-xs text-muted-foreground font-medium">Tailor the interface to your vision.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Auto-Play Trailers</p>
                        <p className="text-xs text-muted-foreground">Preview movies automatically on hover.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">High Fidelity Particles</p>
                        <p className="text-xs text-muted-foreground">Enable advanced 3D background effects.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Interface Language</p>
                        <p className="text-xs text-muted-foreground">Current: English (Global)</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl border-white/10">Change</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Security Protocols</h3>
                      <p className="text-xs text-muted-foreground font-medium">Protect your cinematic identity.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Access Key Reset</p>
                        <p className="text-xs text-muted-foreground">Receive a secure link to change your password.</p>
                      </div>
                      <Button onClick={handlePasswordReset} variant="secondary" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Transmit Link</Button>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of neural protection.</p>
                      </div>
                      <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px] border-white/10">Configure</Button>
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