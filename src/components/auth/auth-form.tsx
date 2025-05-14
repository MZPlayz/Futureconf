
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16px" height="16px"> {/* Adjusted size */}
    <path fill="#EA4335" d="M24 9.5c3.405 0 6.003 1.153 7.999 3.024l5.966-5.966C34.33 3.291 29.715 1.5 24 1.5c-6.627 0-12.327 3.915-14.999 9.818l7.159 5.522C17.927 12.475 20.718 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.653-.146-3.246-.422-4.781H24v9.026h12.839c-.561 3.068-2.258 5.617-4.818 7.377l7.122 5.504C43.348 37.438 46.5 31.261 46.5 24z"/>
    <path fill="#FBBC05" d="M9.001 28.621c-.504-1.522-.789-3.142-.789-4.833s.285-3.311.789-4.833L1.842 13.45C.663 16.451 0 19.995 0 23.788s.663 7.337 1.842 10.338l7.159-5.505z"/>
    <path fill="#34A853" d="M24 48c6.441 0 11.865-2.132 15.827-5.761l-7.122-5.504c-2.136 1.426-4.882 2.273-7.705 2.273-3.553 0-6.613-1.907-8.207-4.708l-7.159 5.522C11.241 43.562 17.158 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16px" height="16px" fill="currentColor" className="text-foreground">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
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
  onGitHubSignIn?: () => Promise<void>; // Added
  loading: boolean;
}

export function AuthForm({ isSignUp = false, onSubmit, onGoogleSignIn, onGitHubSignIn, loading }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const title = isSignUp ? 'Create your account' : 'Sign in to FutureConf';
  const description = isSignUp ? 'Get started with FutureConf today.' : 'Welcome back! Please enter your details.';
  const continueButtonText = 'Continue';
  const linkText = isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up";
  const linkHref = isSignUp ? '/login' : '/signup';

  return (
    <Card className="w-full max-w-sm shadow-xl bg-card/80 backdrop-blur-sm rounded-lg border-border/50">
      <CardHeader className="text-center pb-4 pt-6"> 
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle> 
        <CardDescription className="text-sm text-muted-foreground pt-1">{description}</CardDescription> 
      </CardHeader>
      <CardContent className="px-6 pb-4 space-y-4"> 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
          <div className="space-y-1.5"> 
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              className="text-sm bg-input border-border focus:border-primary h-10 rounded-md" 
              {...register('email')}
              disabled={loading}
            />
            {errors.email && <p className="text-xs text-destructive pt-1">{errors.email.message}</p>} 
          </div>
          <div className="space-y-1.5">  
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="text-sm bg-input border-border focus:border-primary h-10 rounded-md" 
              {...register('password')}
              disabled={loading}
            />
            {errors.password && <p className="text-xs text-destructive pt-1">{errors.password.message}</p>} 
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-neutral-900 hover:bg-neutral-100 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 py-2.5 text-sm font-medium rounded-md shadow-sm" 
            disabled={loading}
          > 
            {loading && !isSignUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading && isSignUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {!loading && continueButtonText}
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          {onGoogleSignIn && (
            <Button
              variant="outline"
              type="button"
              className="w-full py-2.5 text-sm font-medium rounded-md border-border hover:bg-muted/50 flex items-center justify-center text-foreground" 
              onClick={onGoogleSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              ) : (
                <>
                  <GoogleIcon /> 
                  <span className="ml-2.5">Continue with Google</span>
                </>
              )}
            </Button>
          )}
          {onGitHubSignIn && (
            <Button
              variant="outline"
              type="button"
              className="w-full py-2.5 text-sm font-medium rounded-md border-border hover:bg-muted/50 flex items-center justify-center text-foreground"
              onClick={onGitHubSignIn}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <GitHubIcon />
                  <span className="ml-2.5">Continue with GitHub</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-3 pb-6"> 
        <Link href={linkHref} passHref>
          <Button variant="link" className="text-sm text-muted-foreground hover:text-primary h-auto p-0"> 
            {linkText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
