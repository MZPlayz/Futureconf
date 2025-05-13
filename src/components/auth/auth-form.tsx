
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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

interface AuthFormProps {
  isSignUp?: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

export function AuthForm({ isSignUp = false, onSubmit, loading }: AuthFormProps) {
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
    <Card className="w-full max-w-md shadow-xl bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-primary">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 bg-input border-border focus:border-primary"
                {...register('email')}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">Password</Label>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-input border-border focus:border-primary"
                {...register('password')}
                disabled={loading}
              />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-md" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : buttonText}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={linkHref} passHref>
          <Button variant="link" className="text-sm text-primary hover:text-primary/80">
            {linkText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
