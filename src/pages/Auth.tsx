"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/utils/toast";
import { LogIn, Loader2, Globe, Github, Mail } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        showSuccess("Welcome back.");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        showSuccess("Account created successfully.");
      }
      navigate("/");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      showSuccess("Signed in successfully.");
      navigate("/");
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050505] relative">
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Cine<span className="text-white/50">AI</span>
            </h1>
            <p className="text-sm font-medium text-white/50">
              {isLogin ? "Sign in to your account" : "Create an account"}
            </p>
          </div>

          {!authMethod ? (
            <div className="space-y-4">
              <Button 
                onClick={() => handleSocialLogin(googleProvider)}
                className="w-full h-12 gap-3 font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
              >
                <Globe className="w-4 h-4 text-white/70" />
                Continue with Google
              </Button>
              <Button 
                onClick={() => handleSocialLogin(githubProvider)}
                className="w-full h-12 gap-3 font-semibold rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
              >
                <Github className="w-4 h-4 text-white/70" />
                Continue with GitHub
              </Button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#111] px-2 text-white/40">Or</span>
                </div>
              </div>
              <Button 
                onClick={() => setAuthMethod("email")}
                className="w-full h-12 gap-3 font-semibold rounded-lg bg-white text-black hover:bg-white/90 transition-all"
              >
                <Mail className="w-4 h-4" />
                Continue with Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 ml-1">Email</Label>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 focus:border-white/30 rounded-lg text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-white/60 ml-1">Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-white/5 border-white/10 focus:border-white/30 rounded-lg text-white"
                />
              </div>
              <Button type="submit" className="w-full h-12 font-semibold rounded-lg bg-white text-black hover:bg-white/90" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
              </Button>
              <button 
                type="button"
                onClick={() => setAuthMethod(null)} 
                className="w-full text-xs font-medium text-white/40 hover:text-white"
              >
                Back to options
              </button>
            </form>
          )}

          <div className="mt-8 text-center pt-8 border-t border-white/10">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;