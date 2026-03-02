"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Camera, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { showSuccess } from "@/utils/toast";

const Profile = () => {
  const [name, setName] = useState("Commander User");
  const [email, setEmail] = useState("commander@cineai.com");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-2xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Cinema
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-white" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">{name}</h1>
            <p className="text-muted-foreground">Manage your cinematic identity</p>
          </div>
        </div>

        <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Account Details</CardTitle>
            <CardDescription>Update your personal information and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 font-black uppercase tracking-widest">
                <Save className="w-4 h-4" />
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Tip</p>
          <p className="text-sm text-muted-foreground">Connect your account to sync your watchlist across all your devices.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;