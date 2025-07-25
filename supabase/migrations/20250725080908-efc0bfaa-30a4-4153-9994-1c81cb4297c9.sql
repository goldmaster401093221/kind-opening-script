-- Update the trigger function to handle all signup data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email,
    first_name,
    last_name,
    linkedin_url,
    researchgate_url,
    google_scholar_url,
    phone,
    career_description,
    institution,
    college,
    department,
    state_city,
    experience,
    primary_research_area,
    secondary_research_area,
    keywords,
    research_roles
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'linkedin_url',
    new.raw_user_meta_data ->> 'researchgate_url',
    new.raw_user_meta_data ->> 'google_scholar_url',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'career_description',
    new.raw_user_meta_data ->> 'institution',
    new.raw_user_meta_data ->> 'college',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'country_city',
    new.raw_user_meta_data ->> 'experience_years',
    new.raw_user_meta_data ->> 'primary_research_area',
    new.raw_user_meta_data ->> 'secondary_research_area',
    CASE 
      WHEN new.raw_user_meta_data ->> 'keywords' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'keywords', ',')
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'research_roles' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'research_roles', ',')
      ELSE NULL
    END
  );
  RETURN new;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();