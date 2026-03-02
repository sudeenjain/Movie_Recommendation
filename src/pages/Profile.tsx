"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, ArrowLeft, LogOut, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { updateProfile, signOut } from "firebase/auth";
import { showSuccess, showError } from "@/utils/toast";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {auth.currentUser?.photoURL ? (
                    <img src={auth.currentUser.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{name || "Commander"}</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-2">Elite Operative</p>
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
                <p className="text-xs text-muted-foreground font-medium">Modify your neural signature.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Full Designation</Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 focus:border-primary/50 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Network Address</Label>
                  <Input 
                    id="email"
                    value={email}
                    disabled
                    className="h-14 bg-white/5 border-white/10 opacity-50 cursor-not-allowed rounded-2xl"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full md:w-auto px-12 h-14 gap-3 font-black uppercase tracking-widest rounded-2xl bg-primary" disabled={saving}>
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Commit Changes
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;