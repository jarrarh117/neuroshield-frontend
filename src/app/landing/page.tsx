'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Lock, TrendingUp, ArrowRight, FileSearch, Link2, BarChart3, CheckCircle2, Star, Users, Award, Sparkles, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { StarfieldBackground } from '@/components/cosmic/StarfieldBackground';
import { CosmicPortalLoader } from '@/components/cosmic/CosmicPortalLoader';
import { Hero2D } from '@/components/cosmic/Hero2D';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Check sessionStorage on client-side only
  useEffect(() => {
    const hasShown = sessionStorage.getItem('loaderShown');
    if (!hasShown) {
      setShowLoader(true);
    }
    setIsReady(true);
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('loaderShown', 'true');
  };

  // Show loader only if needed
  if (showLoader && isReady) {
    return <CosmicPortalLoader onComplete={handleLoaderComplete} duration={2500} />;
  }

  // Don't render content until ready
  if (!isReady) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Layer - z-0 */}
      <div className="fixed inset-0 z-0">
        <StarfieldBackground />
      </div>
      
      {/* Navigation - z-50 */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80 shadow-lg shadow-primary/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <motion.div 
              className="flex items-center gap-3 group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Shield className="h-9 w-9 text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                NeuroShield
              </span>
            </motion.div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild className="hidden sm:inline-flex hover:bg-primary/10 transition-all duration-300">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className="btn-glow relative overflow-hidden group hidden sm:inline-flex">
                <Link href="/auth/signup" className="relative z-10">
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Content Layer - z-10 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
          {/* 2D Hero Background - Behind content */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div 
              className="absolute inset-0"
              style={{ opacity, scale }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background/80" />
              <Hero2D />
            </motion.div>
          </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              className="text-center w-full"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border border-primary/30 text-primary text-xs sm:text-sm font-medium backdrop-blur-sm shadow-lg shadow-primary/20"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.4)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
                    AI-Powered Malware Detection
                  </span>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </motion.div>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight px-2"
              >
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                  Protect Your Digital World
                </span>
                <span className="block text-primary-foreground text-2xl sm:text-3xl md:text-4xl mt-2">
                  with AI Intelligence
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-primary-foreground/90 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4"
              >
              Advanced malware detection powered by machine learning. Scan files and URLs in real-time, 
              get instant threat analysis, and stay protected with{' '}
              <span className="text-accent font-semibold">95%+ accuracy</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 sm:mb-12 px-4"
            >
              <Button size="lg" asChild className="btn-glow text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group w-full sm:w-auto">
                <Link href="/auth/signup">
                  <span className="font-semibold">Get Started Free</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto">
                <Link href="/auth/login" className="font-semibold">
                  Sign In
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm px-4"
            >
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span className="text-xs sm:text-sm">Join <span className="text-accent font-bold">10,000+</span> users</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs sm:text-sm"><span className="text-primary-foreground font-bold">4.9/5</span> rating</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                <span className="text-xs sm:text-sm"><span className="text-primary-foreground font-bold">95%+</span> accuracy</span>
              </div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-10"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-2">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold mb-3 text-foreground"
            >
              Powerful Features for
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Complete Protection
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-foreground/70 text-base max-w-2xl mx-auto leading-relaxed"
            >
              Everything you need to detect, analyze, and prevent malware threats with cutting-edge AI technology
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            <FeatureCard
              icon={FileSearch}
              title="File Scanning"
              description="Upload and analyze PE files (.exe, .dll, .sys) with our EMBER XGBoost model trained on 692 features for maximum accuracy"
              color="#38bdf8"
            />
            <FeatureCard
              icon={Link2}
              title="URL Analysis"
              description="Check URLs for phishing, malware distribution, and security threats using VirusTotal intelligence and real-time scanning"
              color="#a855f7"
            />
            <FeatureCard
              icon={BarChart3}
              title="Threat Reports"
              description="Detailed scan reports with threat severity levels, confidence scores, and exportable PDF/DOCX formats for documentation"
              color="#60a5fa"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Threat Trends"
              description="AI-generated insights on global malware trends, emerging security threats, and predictive threat intelligence"
              color="#38bdf8"
            />
            <FeatureCard
              icon={Lock}
              title="Secure & Private"
              description="Your files are analyzed securely with end-to-end encryption and never stored. Complete privacy guaranteed"
              color="#a855f7"
            />
            <FeatureCard
              icon={Zap}
              title="Real-Time Detection"
              description="Instant malware detection with 95%+ accuracy, sub-5-second scan times, and immediate threat notifications"
              color="#60a5fa"
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-2">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Process</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl font-bold mb-3 text-foreground"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-foreground/70 text-base max-w-2xl mx-auto"
            >
              Get started in three simple steps
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          >
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your free account in seconds. No credit card required, no hidden fees."
              icon={Users}
            />
            <StepCard
              number="2"
              title="Upload & Scan"
              description="Upload files or enter URLs to scan for malware and security threats instantly."
              icon={FileSearch}
            />
            <StepCard
              number="3"
              title="Get Results"
              description="Receive instant threat analysis with detailed reports and actionable recommendations."
              icon={CheckCircle2}
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-16 sm:py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
              Trusted by Thousands
            </h2>
            <p className="text-foreground/70 text-base">
              Join the community protecting their digital assets
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StatCard number="10K+" label="Active Users" index={0} />
            <StatCard number="95%" label="Accuracy Rate" index={1} />
            <StatCard number="1M+" label="Files Scanned" index={2} />
            <StatCard number="<5s" label="Scan Time" index={3} />
          </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 bg-background">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative text-center p-8 sm:p-12 rounded-3xl border border-primary/20 overflow-hidden backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(56,189,248,0.1) 100%)',
            }}
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Secure Your
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Digital Assets?
                </span>
              </h2>
              <p className="text-foreground/70 text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who trust NeuroShield for advanced malware protection and real-time threat detection
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="btn-glow text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group w-full sm:w-auto">
                  <Link href="/auth/signup">
                    <span className="font-semibold">Start Free Trial</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto">
                  <Link href="/auth/login" className="font-semibold">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 py-12 bg-background/80 backdrop-blur-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NeuroShield
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} NeuroShield. All rights reserved. Powered by AI Intelligence.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

function StepCard({ number, title, description, icon: Icon }: StepCardProps) {
  return (
    <motion.div 
      variants={itemVariants} 
      className="relative group w-full"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 transition-all duration-300 h-full">
        {/* Gradient background on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Number badge - top left */}
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/30 z-10">
          {number}
        </div>

        {/* Icon */}
        <div className="relative mb-6 mt-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <h3 className="text-xl font-bold mb-3 text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
      </div>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="relative h-full w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cosmic-card border-primary/20 h-full relative overflow-hidden group backdrop-blur-sm">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}15, transparent 70%)`,
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />

        <CardHeader className="relative z-10">
          <motion.div
            className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit relative overflow-hidden"
            animate={{
              boxShadow: isHovered
                ? `0 0 20px ${color}40, 0 0 40px ${color}20`
                : '0 0 0px transparent',
              borderColor: isHovered ? `${color}60` : 'hsl(var(--primary) / 0.2)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: `${color}10` }}
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            <Icon className="h-6 w-6 text-primary relative z-10" />
          </motion.div>
          <CardTitle className="text-xl mb-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardContent>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${color}20`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
  index: number;
}

function StatCard({ number, label, index }: StatCardProps) {
  return (
    <motion.div
      className="relative text-center"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.1, y: -5 }}
    >
      <motion.div
        className="relative"
        animate={{
          textShadow: [
            '0 0 20px rgba(56,189,248,0.3)',
            '0 0 40px rgba(168,85,247,0.5)',
            '0 0 20px rgba(56,189,248,0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          {number}
        </div>
      </motion.div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}
