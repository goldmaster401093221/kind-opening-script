-- Update the handle_new_user function to include the country field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email,
    first_name,
    last_name,
    gender,
    highest_degree,
    user_id_number,
    linkedin_url,
    researchgate_url,
    google_scholar_url,
    phone,
    career_description,
    institution,
    college,
    department,
    country,
    state_city,
    postcode,
    experience,
    primary_research_area,
    secondary_research_area,
    keywords,
    specialization_keywords,
    research_roles,
    what_i_have,
    what_i_need
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'username',
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'gender',
    new.raw_user_meta_data ->> 'highest_degree',
    new.raw_user_meta_data ->> 'user_id_number',
    new.raw_user_meta_data ->> 'linkedin_url',
    new.raw_user_meta_data ->> 'researchgate_url',
    new.raw_user_meta_data ->> 'google_scholar_url',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'career_description',
    new.raw_user_meta_data ->> 'institution',
    new.raw_user_meta_data ->> 'college',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'state_city',
    new.raw_user_meta_data ->> 'postcode',
    new.raw_user_meta_data ->> 'experience',
    new.raw_user_meta_data ->> 'primary_research_area',
    new.raw_user_meta_data ->> 'secondary_research_area',
    CASE 
      WHEN new.raw_user_meta_data ->> 'keywords' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'keywords', ',')
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'specialization_keywords' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'specialization_keywords', ',')
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'research_roles' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'research_roles', ',')
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'what_i_have' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'what_i_have', ',')
      ELSE NULL
    END,
    CASE 
      WHEN new.raw_user_meta_data ->> 'what_i_need' IS NOT NULL 
      THEN string_to_array(new.raw_user_meta_data ->> 'what_i_need', ',')
      ELSE NULL
    END
  );
  RETURN new;
END;
$function$