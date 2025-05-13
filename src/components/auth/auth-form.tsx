
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="14px" height="14px"> {/* Adjusted size for smaller text */}
    <path fill="#EA4335" d="M24 9.5c3.405 0 6.003 1.153 7.999 3.024l5.966-5.966C34.33 3.291 29.715 1.5 24 1.5c-6.627 0-12.327 3.915-14.999 9.818l7.159 5.522C17.927 12.475 20.718 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.653-.146-3.246-.422-4.781H24v9.026h12.839c-.561 3.068-2.258 5.617-4.818 7.377l7.122 5.504C43.348 37.438 46.5 31.261 46.5 24z"/>
    <path fill="#FBBC05" d="M9.001 28.621c-.504-1.522-.789-3.142-.789-4.833s.285-3.311.789-4.833L1.842 13.45C.663 16.451 0 19.995 0 23.788s.663 7.337 1.842 10.338l7.159-5.505z"/>
    <path fill="#34A853" d="M24 48c6.441 0 11.865-2.132 15.827-5.761l-7.122-5.504c-2.136 1.426-4.882 2.273-7.705 2.273-3.553 0-6.613-1.907-8.207-4.708l-7.159 5.522C11.241 43.562 17.158 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);


const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

interface AuthFormProps {
  isSignUp?: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  loading: boolean;
}

export function AuthForm({ isSignUp = false, onSubmit, onGoogleSignIn, loading }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const title = isSignUp ? 'Create an Account' : 'Welcome Back';
  const description = isSignUp ? 'Enter your email and password to sign up.' : 'Sign in to access FutureConf.';
  const buttonText = isSignUp ? 'Sign Up' : 'Sign In';
  const linkText = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
  const linkHref = isSignUp ? '/login' : '/signup';

  return (
    <Card className="w-full max-w-xs shadow-xl bg-card/90 backdrop-blur-sm rounded-md">
      <CardHeader className="text-center pb-2.5 pt-4"> 
        <CardTitle className="text-lg font-bold text-primary">{title}</CardTitle> 
        <CardDescription className="text-xs text-muted-foreground pt-0.5">{description}</CardDescription> 
      </CardHeader>
      <CardContent className="pt-0 pb-2.5"> 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5"> 
          <div className="space-y-0.5"> 
            <Label htmlFor="email" className="text-foreground/80 text-xs">Email</Label> 
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /> 
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-7 text-xs bg-input border-border focus:border-primary h-8 rounded-sm" 
                {...register('email')}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive pt-0.5">{errors.email.message}</p>} 
          </div>
          <div className="space-y-0.5">  
            <Label htmlFor="password" className="text-foreground/80 text-xs">Password</Label> 
             <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /> 
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-7 text-xs bg-input border-border focus:border-primary h-8 rounded-sm" 
                {...register('password')}
                disabled={loading}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive pt-0.5">{errors.password.message}</p>} 
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 text-xs font-semibold rounded-sm" disabled={loading}> 
            {loading ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : buttonText} 
          </Button>
        </form>

        {onGoogleSignIn && (
          <>
            <div className="my-2.5 flex items-center"> 
              <Separator className="flex-grow" />
              <span className="mx-1.5 text-xs text-muted-foreground">OR</span> 
              <Separator className="flex-grow" />
            </div>
            <Button
              variant="outline"
              className="w-full py-1.5 text-xs font-semibold rounded-sm border-border hover:bg-accent" 
              onClick={onGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> 
              ) : (
                <>
                  <GoogleIcon /> 
                  <span className="ml-1.5">Sign in with Google</span>
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2.5 pb-3"> 
        <Link href={linkHref} passHref>
          <Button variant="link" className="text-xs text-primary hover:text-primary/80 h-auto p-0"> 
            {linkText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
