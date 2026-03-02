"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";
import { User, Zap, Clock, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const GENRE_DATA = [
  { name: "Sci-Fi", value: 45, color: "#00a2ff" },
  { name: "Action", value: 30, color: "#ff0055" },
  { name: "Drama", value: 15, color: "#00ffaa" },
  { name: "Horror", value: 10, color: "#ffaa00" },
];

const ACTIVITY_DATA = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 8 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 12 },
  { day: "Sun", count: 7 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-1">
              <div className="w-full h-full rounded-[1.4rem] bg-black flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-black rounded-full" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Commander User</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black">ELITE MEMBER</Badge>
              <span className="text-xs text-muted-foreground font-medium">Joined Nebula Era 2024</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:flex gap-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">AI Score</span>
            <span className="text-2xl font-black text-primary">98.4</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Rank</span>
            <span className="text-2xl font-black text-white">#12</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Watch Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ACTIVITY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#00a2ff' }}
                />
                <Bar dataKey="count" fill="#00a2ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
              <Zap className="w-4 h-4" /> Genre DNA
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GENRE_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {GENRE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Time", value: "1,240h", icon: Clock, color: "text-blue-400" },
          { label: "Avg Rating", value: "8.4", icon: Star, color: "text-yellow-400" },
          { label: "AI Matches", value: "452", icon: Zap, color: "text-purple-400" },
          { label: "Security", value: "Level 5", icon: ShieldCheck, color: "text-green-400" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;