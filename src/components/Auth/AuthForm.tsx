import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Chrome, Sparkles, Shield, HeartHandshake, ArrowRight } from "lucide-react";
import { Scene3D } from "@/components/Dashboard/Scene3D";

export const AuthForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'doctor'>('user');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({ title: 'Success', description: 'Logged in successfully!' });
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from('user_profiles').insert({
            user_id: data.user.id,
            display_name: name,
          });

          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: role,
          });
        }

        toast({ title: 'Success', description: 'Account created! Logging you in...' });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Google sign-in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      <Scene3D />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-[26rem] w-[26rem] rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
          <section className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/70 px-5 py-2 text-primary shadow-soft backdrop-blur">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.4em]">OvAI Login</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl">
                Seamless access to your <span className="text-primary">AI-powered wellness HQ</span>
              </h1>
              <p className="text-lg text-foreground/80 md:text-xl">
                Pick up where you left off across cycle tracking, nutrition, and personalized insights — all synced with
                our adaptive AI platform.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[{
                icon: Shield,
                title: 'Protected data',
                copy: 'Enterprise-grade security and privacy.',
              }, {
                icon: HeartHandshake,
                title: 'Guided care',
                copy: 'Personalized support every step.',
              }].map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/50 bg-card/70 p-4 text-left shadow-card backdrop-blur">
                  <item.icon className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="flex-1 border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2 text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-primary">{isLogin ? 'Welcome back' : 'Join OvAI'}</p>
                <h2 className="text-3xl font-bold text-foreground">
                  {isLogin ? 'Continue your wellness journey' : 'Create your wellness identity'}
                </h2>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                >
                  <Chrome className="h-4 w-4" />
                  {googleLoading ? 'Contacting Google...' : 'Continue with Google'}
                </Button>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
                  <div className="h-px flex-1 bg-border" />
                  <span>or</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-sm font-medium">I am a</Label>
                      <RadioGroup
                        value={role}
                        onValueChange={(value) => setRole(value as 'user' | 'doctor')}
                        className="grid gap-3 md:grid-cols-2"
                      >
                        <label
                          htmlFor="user"
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                        >
                          <RadioGroupItem value="user" id="user" />
                          User
                        </label>
                        <label
                          htmlFor="doctor"
                          className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                        >
                          <RadioGroupItem value="doctor" id="doctor" />
                          Doctor
                        </label>
                      </RadioGroup>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {isLogin ? 'New to OvAI?' : 'Already part of OvAI?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-primary hover:underline"
                >
                  {isLogin ? 'Create an account' : 'Sign in instead'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
