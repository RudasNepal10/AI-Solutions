"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import axios from "axios";
import {
  Mail, Phone, Building2, Globe, Briefcase, User,
  MessageSquare, Send, CheckCircle, MapPin,
} from "lucide-react";
import { contactApi } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const DEFAULT_COUNTRIES = [
  { value: "", label: "Select your country…" },
  { value: "NP", label: "Nepal" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "UAE" },
  { value: "ZA", label: "South Africa" },
  { value: "NG", label: "Nigeria" },
  { value: "OTHER", label: "Other" },
];

const SERVICES = [
  { value: "", label: "Select service of interest…" },
  { value: "AI Virtual Assistant", label: "AI Virtual Assistant" },
  { value: "Rapid Prototyping", label: "Rapid Prototyping" },
  { value: "Predictive Analytics", label: "Predictive Analytics" },
  { value: "System Integration", label: "System Integration" },
  { value: "AI Security & Compliance", label: "AI Security & Compliance" },
  { value: "Process Automation", label: "Process Automation" },
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Event Inquiry", label: "Event Inquiry" },
  { value: "Other", label: "Other" },
];

const schema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(7, "Please enter a valid phone number"),
  companyName: z.string().min(2, "Company name is required"),
  country: z.string().min(1, "Please select your country"),
  jobTitle: z.string().min(2, "Job title is required"),
  serviceInterest: z.string().min(1, "Please select a service"),
  jobDetails: z.string().min(20, "Please provide at least 20 characters describing your requirements"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [countries, setCountries] = useState(DEFAULT_COUNTRIES);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Fetch all countries dynamically on component mount
  useEffect(() => {
    axios.get('https://www.apicountries.com/countries')
      .then(response => {
        console.log(response.data);
        if (Array.isArray(response.data)) {
          const list = response.data
            .map((c: any) => ({
              value: c.name || c.commonName || c.country || c.cca2 || c.code || "",
              label: c.name || c.commonName || c.country || "",
            }))
            .filter((c: any) => c.label)
            .sort((a: any, b: any) => a.label.localeCompare(b.label));

          if (list.length > 0) {
            setCountries([
              { value: "", label: "Select your country…" },
              ...list
            ]);
            return;
          }
        }
        throw new Error("Invalid format from apicountries");
      })
      .catch(error => {
        console.warn('Error fetching the country data:', error);
        
        // Fallback to restcountries.com API
        axios.get("https://restcountries.com/v3.1/all")
          .then((res) => {
            if (Array.isArray(res.data)) {
              const list = res.data
                .map((c: any) => ({
                  value: c.name?.common || c.cca2,
                  label: c.name?.common,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));

              setCountries([
                { value: "", label: "Select your country…" },
                ...list
              ]);
            }
          })
          .catch((err2) => {
            console.warn("Error fetching country data from fallback REST API, using static fallback:", err2);
            // Fallback is DEFAULT_COUNTRIES which is already set
          });
      });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await contactApi.submit({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        country: data.country,
        jobTitle: data.jobTitle,
        jobDetails: data.jobDetails,
      });

      setSubmitted(true);
      reset();
      toast.success("Message sent! We'll be in touch within 24 hours.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">
            Message Received!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Thank you for reaching out. A member of our team will review your
            requirements and contact you within one business day.
          </p>
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="section-padding mesh-bg-subtle">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 block">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-4">
            Let&apos;s Build Something
            <span className="gradient-text"> Together</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Tell us about your project requirements and one of our AI specialists
            will craft a personalised solution proposal for you.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {/* Main form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Tell Us About Your Requirements
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-5"
                id="contact-form"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    id="contact-name"
                    label="Full Name"
                    placeholder="Jane Smith"
                    required
                    leftIcon={<User className="w-4 h-4" />}
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    id="contact-email"
                    label="Email Address"
                    type="email"
                    placeholder="jane@company.com"
                    required
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    id="contact-phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="+44 7700 000000"
                    required
                    leftIcon={<Phone className="w-4 h-4" />}
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber")}
                  />
                  <Input
                    id="contact-company"
                    label="Company Name"
                    placeholder="Acme Corporation"
                    required
                    leftIcon={<Building2 className="w-4 h-4" />}
                    error={errors.companyName?.message}
                    {...register("companyName")}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Select
                    id="contact-country"
                    label="Country"
                    required
                    options={countries}
                    error={errors.country?.message}
                    {...register("country")}
                  />
                  <Input
                    id="contact-jobTitle"
                    label="Job Title"
                    placeholder="Chief Technology Officer"
                    required
                    leftIcon={<Briefcase className="w-4 h-4" />}
                    error={errors.jobTitle?.message}
                    {...register("jobTitle")}
                  />
                </div>

                <Select
                  id="contact-service"
                  label="Service of Interest"
                  required
                  options={SERVICES}
                  error={errors.serviceInterest?.message}
                  {...register("serviceInterest")}
                />

                <Textarea
                  id="contact-details"
                  label="Job Details / Requirements"
                  placeholder="Please describe your project requirements, current challenges, and what you're hoping to achieve with our AI solutions…"
                  required
                  rows={5}
                  error={errors.jobDetails?.message}
                  {...register("jobDetails")}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full sm:w-auto self-start"
                  id="contact-submit"
                >
                  Send Message
                </Button>

                <p className="text-xs text-slate-500 flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" />
                  Your data is processed securely and will never be shared with
                  third parties. See our{" "}
                  <a href="/privacy" className="text-brand-600 dark:text-brand-400 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </Card>
          </motion.div>

          {/* Contact info & Response times below */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Contact Information
              </h2>
              {[
                {
                  icon: <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
                  label: "Location",
                  value: "Sunderland, United Kingdom",
                },
                {
                  icon: <Mail className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
                  label: "Email",
                  value: "contact@aisolutions.com",
                },
                {
                  icon: <Phone className="w-4 h-4 text-brand-600 dark:text-brand-400" />,
                  label: "Phone",
                  value: "+44 191 000 0000",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 mb-4 last:mb-0">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{item.value}</p>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Response Times
              </h2>
              {[
                { label: "General Inquiries", time: "Within 24 hours" },
                { label: "Demo Requests", time: "Same business day" },
                { label: "Technical Support", time: "Within 2 hours" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2.5 border-b border-slate-200 dark:border-white/5 last:border-0"
                >
                  <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.time}
                  </span>
                </div>
              ))}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
