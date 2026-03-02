"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { LogIn, UserPlus, Loader2, Shield, Zap, Globe } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showSuccess("Access Granted. Welcome back, Commander.");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showSuccess("Initialization sequence started. Check your email.");
      }
      navigate("/");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,162,255,0.1)] relative overflow-hidden">
          {/* Futuristic Corner Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-[2.5rem]" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/30 rounded-br-[2.5rem]" />

          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6"
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">
              CINE<span className="text-primary">AI</span>
            </h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
              {isLogin ? "Authentication Required" : "Initialize New Profile"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Network ID (Email)</Label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="commander@cineai.io" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Access Key (Password)</Label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 gap-3 font-black uppercase tracking-widest rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 group" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                  {isLogin ? "Establish Connection" : "Create Identity"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Request New Identity" : "Return to Login Terminal"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;