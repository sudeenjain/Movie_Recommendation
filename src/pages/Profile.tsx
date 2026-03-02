"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, ArrowLeft, LogOut, Loader2, Shield, Activity, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setEmail(user.email || "");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data) setName(data.full_name || "");
      setLoading(false);
    };

    getProfile();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      showSuccess("Neural profile updated successfully.");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-12">
        <Link to="/" className="group inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Terminal
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2 font-black uppercase tracking-widest text-[10px]">
          <LogOut className="w-4 h-4" />
          Terminate Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:scale-110 transition-transform border-4 border-black">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{name || "Commander"}</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-2">Elite Operative</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Security Level</span>
                <span className="text-green-400">Class A</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Neural Sync</span>
                <span className="text-primary">98.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Activity className="w-3 h-3" /> System Status
            </h3>
            <div className="space-y-3">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Identity Configuration</h3>
                <p className="text-xs text-muted-foreground font-medium">Modify your neural signature and access parameters.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Full Designation</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Network Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="pl-12 h-14 bg-white/5 border-white/10 opacity-50 cursor-not-allowed rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <Button type="submit" className="w-full md:w-auto px-12 h-14 gap-3 font-black uppercase tracking-widest rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" disabled={saving}>
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Commit Changes
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;