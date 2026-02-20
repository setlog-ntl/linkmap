-- Add main_service_id to projects table
ALTER TABLE public.projects
ADD COLUMN main_service_id UUID REFERENCES public.project_services(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.projects.main_service_id IS 'The primary/main service for this project, displayed prominently in the service map';
