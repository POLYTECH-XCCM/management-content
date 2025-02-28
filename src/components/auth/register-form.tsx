'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation";
import { RegisterSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { register } from '@/actions/register';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RegisterForm = () => {
  const router=useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      register(values).then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSuccess(data.success);
          // Redirect to login page after successful registration
          router.push("/auth/login");
        }
       
      });
    });
  };

  return (
    <CardWrapper headerLabel="Create an account" backButtonLabel="Already have an account?" backButtonHref="/auth/login" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      //  disabled={isPending}
                      placeholder="Manuella D"
                      type="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="hilary@exemple.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmation de mot de passe <span className="text-red-700">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      //{...field}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Select>
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Profession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Student">Etudiant</SelectItem>
              <SelectItem value="Teacher">Enseignant</SelectItem>
              <SelectItem value="Engineer">Ingenieur</SelectItem>
              <SelectItem value="Doctor">Medecin</SelectItem>
              <SelectItem value="Journalist">Journaliste</SelectItem>
              <SelectItem value="Other">Autre</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Domaine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Biology">Biologie</SelectItem>
              <SelectItem value="Chemistry">Chimie</SelectItem>
              <SelectItem value="Computer Science">informatique</SelectItem>
              <SelectItem value="Culture">Culture</SelectItem>
              <SelectItem value="Economics">Economie</SelectItem>
              <SelectItem value="English">Anglais</SelectItem>
              <SelectItem value="French">Francais</SelectItem>
              <SelectItem value="Geography">Geographie</SelectItem>
              <SelectItem value="History">Histoire</SelectItem>
              <SelectItem value="Math">Maths</SelectItem>
              <SelectItem value="Medicine">Medicine</SelectItem>
              <SelectItem value="Philosophy">Philosophie</SelectItem>
              <SelectItem value="Sociology">Sociologie</SelectItem>
              <SelectItem value="Other">Autre</SelectItem>
            </SelectContent>
          </Select>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Creer un compte
          </Button>

          <p className=" text-center">Connectez vous avec</p>
        </form>
      </Form>
    </CardWrapper>
  );
};
