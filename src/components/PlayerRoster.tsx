import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PLAYERS, PlayerName } from "@/components/PlayerAvatars";
import { Upload, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlayerProfile {
  id: string;
  player_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const PlayerRoster = () => {
  const [profiles, setProfiles] = useState<PlayerProfile[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('player_profiles')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load player profiles",
        variant: "destructive",
      });
    }
  };

  const uploadAvatar = async (playerName: PlayerName, file: File) => {
    try {
      setUploading(playerName);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${playerName.toLowerCase()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('player-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('player-avatars')
        .getPublicUrl(filePath);

      // Update or create player profile
      const { error: dbError } = await supabase
        .from('player_profiles')
        .upsert({
          player_name: playerName,
          avatar_url: data.publicUrl,
        }, {
          onConflict: 'player_name'
        });

      if (dbError) throw dbError;

      await loadProfiles();
      toast({
        title: "Success",
        description: `Avatar uploaded for ${playerName}`,
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (playerName: PlayerName, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      uploadAvatar(playerName, file);
    }
  };

  const getPlayerProfile = (playerName: PlayerName) => {
    return profiles.find(p => p.player_name === playerName);
  };

  return (
    <Card className="glass-effect shadow-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Player Roster
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLAYERS.map((playerName) => {
            const profile = getPlayerProfile(playerName);
            const isUploading = uploading === playerName;
            
            return (
              <div key={playerName} className="group">
                <div className="relative overflow-hidden rounded-lg border bg-card p-4 smooth-transition hover:shadow-glow">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background smooth-transition group-hover:ring-primary/40">
                        <AvatarImage 
                          src={profile?.avatar_url || undefined} 
                          alt={playerName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                          {playerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <Label
                        htmlFor={`avatar-${playerName}`}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 smooth-transition cursor-pointer rounded-full"
                      >
                        <Upload className="h-4 w-4 text-white" />
                      </Label>
                      
                      <Input
                        id={`avatar-${playerName}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(playerName, e)}
                        disabled={isUploading}
                      />
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">{playerName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {isUploading ? "Uploading..." : "Player"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Click on any player avatar to upload a profile picture
          </p>
        </div>
      </CardContent>
    </Card>
  );
};