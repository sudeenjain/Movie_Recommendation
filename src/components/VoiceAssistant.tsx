"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface VoiceAssistantProps {
  onResult: (query: string) => void;
}

const VoiceAssistant = ({ onResult }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showUI, setShowUI] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setShowUI(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        if (transcript) {
          onResult(transcript);
          setShowUI(false);
          setTranscript("");
        }
      }, 1000);
    };

    recognition.start();
  };

  return (
    <>
      <Button
        onClick={startListening}
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-primary/20 border-primary/50 backdrop-blur-xl shadow-[0_0_20px_rgba(0,162,255,0.3)] hover:scale-110 transition-all z-50"
      >
        <Mic className="w-6 h-6 text-primary" />
      </Button>

      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 md:bottom-24 md:left-auto md:right-8 md:w-80 z-50"
          >
            <div className="bg-black/80 backdrop-blur-2xl border border-primary/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">AI Listening</span>
                </div>
                <button onClick={() => setShowUI(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="min-h-[60px] flex items-center justify-center text-center">
                <p className="text-lg font-bold text-white italic">
                  {transcript || "Say something like 'Find me sci-fi movies'..."}
                </p>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: isListening ? [10, 30, 10] : 10 }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;