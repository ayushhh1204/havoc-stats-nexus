-- Create storage bucket for player profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('player-avatars', 'player-avatars', true);

-- Create storage policies for player avatars
CREATE POLICY "Player avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'player-avatars');

CREATE POLICY "Authenticated users can upload player avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'player-avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update player avatars" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'player-avatars' AND auth.role() = 'authenticated');

-- Create player profiles table
CREATE TABLE public.player_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Player profiles are viewable by everyone" 
ON public.player_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage player profiles" 
ON public.player_profiles 
FOR ALL
USING (auth.role() = 'authenticated');

-- Add trigger for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_profiles_updated_at
BEFORE UPDATE ON public.player_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();