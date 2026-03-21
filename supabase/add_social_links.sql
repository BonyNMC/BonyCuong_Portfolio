-- Migration: Add social links to site_config

ALTER TABLE public.site_config
ADD COLUMN facebook_url text DEFAULT NULL,
ADD COLUMN linkedin_url text DEFAULT NULL,
ADD COLUMN spotify_url text DEFAULT NULL;
